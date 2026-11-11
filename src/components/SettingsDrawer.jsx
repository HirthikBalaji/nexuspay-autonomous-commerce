import React, { useState, useEffect } from 'react';
import { X, Key, Radio, Check, Save, Shield, Terminal, RefreshCw, AlertCircle, Activity, Wifi, ExternalLink } from 'lucide-react';
import { paypalService } from '../services/paypalService';
import { formatRelativeTime } from '../utils/formatters';
import axios from 'axios';

export default function SettingsDrawer({ isOpen, onClose }) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [simulationMode, setSimulationMode] = useState(true);
  const [webhooks, setWebhooks] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Connection testing state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      loadWebhooks();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      const config = await paypalService.getCredentials();
      if (config) {
        setClientId(config.clientId || '');
        setSimulationMode(config.simulationMode !== false);
      }
    } catch (err) {
      console.warn('Failed to load credentials:', err);
    }
  };

  const loadWebhooks = async () => {
    try {
      const data = await paypalService.getWebhookEvents();
      if (data?.events) {
        setWebhooks(data.events);
      }
    } catch (err) {
      console.warn('Failed to load webhooks:', err);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await axios.get('/api/paypal/test-connection');
      setConnectionStatus(res.data);
    } catch (err) {
      setConnectionStatus({
        connected: false,
        error: err.response?.data?.error || err.message,
        message: 'Connection test failed.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await paypalService.updateCredentials(clientId, clientSecret, simulationMode);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      handleTestConnection();
    } catch (err) {
      alert('Error saving credentials: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D1424] border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-paypal-light/20 text-paypal-cyan">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PayPal Sandbox & Gateway Settings</h3>
              <p className="text-xs text-slate-400">Configure developer keys & inspect cloud webhooks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Connection Diagnostics Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-paypal-cyan" />
                <span className="text-xs font-semibold uppercase text-slate-300">
                  PayPal Sandbox Health
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <Wifi className={`w-3 h-3 ${testingConnection ? 'animate-spin text-paypal-cyan' : ''}`} />
                <span>{testingConnection ? 'Pinging...' : 'Test Ping'}</span>
              </button>
            </div>

            {connectionStatus ? (
              <div className={`p-3 rounded-lg text-xs font-mono ${
                connectionStatus.connected
                  ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/40 border border-amber-800 text-amber-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Status: {connectionStatus.connected ? 'ONLINE (Live Sandbox)' : 'SIMULATION MODE'}</span>
                  <span>{connectionStatus.latencyMs}ms</span>
                </div>
                <div className="text-[11px] mt-1 font-sans opacity-90">{connectionStatus.message}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono">
                Click "Test Ping" to measure round-trip latency to https://api-m.sandbox.paypal.com.
              </div>
            )}
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                PayPal Developer Credentials (Sandbox):
              </span>
              <a
                href="https://developer.paypal.com/dashboard/applications/sandbox"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-paypal-cyan hover:underline flex items-center gap-1"
              >
                <span>Get Keys</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                PayPal Client ID:
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Paste PayPal Sandbox Client ID..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-paypal-cyan"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                PayPal Client Secret:
              </label>
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Paste PayPal Sandbox Client Secret..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-paypal-cyan"
              />
            </div>

            {/* Mode Selector */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Interactive Sandbox Simulation (Instant Demo)</span>
                <input
                  type="checkbox"
                  checked={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.checked)}
                  className="rounded text-paypal-cyan focus:ring-0"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                When enabled, returns realistic PayPal Orders v2 & Payouts schemas without requiring custom developer credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-paypal-light hover:bg-sky-500 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-paypal-light/20"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? 'Credentials Saved!' : 'Save PayPal Configuration'}</span>
            </button>
          </form>

          {/* Real-time Webhook Audit Feed */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-paypal-cyan" />
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  PayPal Webhooks Stream
                </span>
              </div>
              <button
                onClick={loadWebhooks}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Refresh Webhooks"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {webhooks.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No webhooks recorded yet.
                </div>
              ) : (
                webhooks.map((wh, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-paypal-cyan font-bold">{wh.event_type}</span>
                      <span className="text-slate-500 text-[10px]">{formatRelativeTime(wh.create_time)}</span>
                    </div>
                    <div className="text-slate-300 text-xs font-sans">{wh.summary}</div>
                    <div className="text-slate-500 text-[10px] mt-1">ID: {wh.id} • Status: {wh.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
