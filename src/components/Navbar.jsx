import React from 'react';
import { Shield, Zap, Lock, Terminal, FileCode, Settings, AlertOctagon, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Navbar({ 
  treasury, 
  onOpenSettings, 
  onOpenDocs, 
  emergencyFreeze, 
  onToggleFreeze, 
  onRefresh 
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-paypal-dark via-paypal-light to-paypal-cyan p-0.5 shadow-lg shadow-paypal-light/20">
            <div className="w-full h-full bg-[#080C14] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-paypal-cyan to-white text-xl">
                Ψ
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-paypal-cyan rounded-full animate-ping opacity-75"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                NEXUS<span className="text-paypal-cyan">PAY</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-paypal-light/20 text-paypal-cyan border border-paypal-light/30">
                Autonomous Escrow v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Agent Commerce Clearinghouse on PayPal Developer Platform
            </p>
          </div>
        </div>

        {/* Real-time Status Badges */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0c1220] px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">PayPal:</span>
            <span className="font-mono text-emerald-400 font-medium">Orders v2 + Payouts</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-paypal-cyan animate-pulse"></span>
            <span className="text-slate-400">AI Arbiter:</span>
            <span className="font-mono text-paypal-cyan font-medium">Themis Armed</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-400">Grid:</span>
            <span className="font-mono text-amber-400 font-medium">AG Grid v36</span>
          </div>
        </div>

        {/* Live Treasury & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Treasury Quick Stat */}
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Escrow In-Flight
            </div>
            <div className="font-mono text-sm font-semibold text-white">
              {formatCurrency(treasury?.totalEscrowLocked || 4100)}
            </div>
          </div>

          {/* Emergency Killswitch / Freeze */}
          <button
            onClick={onToggleFreeze}
            title={emergencyFreeze ? "Emergency freeze active! Click to unfreeze agent fleet." : "Activate Emergency Circuit Breaker (Freeze all autonomous spending)"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              emergencyFreeze 
                ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/50' 
                : 'bg-red-950/40 text-red-400 border border-red-800/60 hover:bg-red-900/40 hover:text-red-300'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="hidden sm:inline">{emergencyFreeze ? 'Fleet Frozen' : 'Panic Freeze'}</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh All Telemetry & Balances"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* APIMatic & OpenAPI Docs */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <FileCode className="w-4 h-4 text-paypal-cyan" />
            <span className="hidden md:inline">OpenAPI / APIMatic</span>
          </button>

          {/* Settings / PayPal Sandbox config */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Configure PayPal Sandbox Credentials & View Webhooks"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>

      </div>
    </header>
  );
}
