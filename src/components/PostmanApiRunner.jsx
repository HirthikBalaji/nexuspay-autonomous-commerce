import React, { useState } from 'react';
import { Terminal, Send, Download, FileCode, Check, Copy, Code2, ExternalLink, Zap } from 'lucide-react';
import axios from 'axios';

export default function PostmanApiRunner() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('negotiate');
  const [requestBody, setRequestBody] = useState(JSON.stringify({ scenarioId: 'gpu_procurement' }, null, 2));
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const endpoints = [
    {
      id: 'negotiate',
      name: 'POST /api/agent/negotiate',
      method: 'POST',
      url: '/api/agent/negotiate',
      defaultBody: { scenarioId: 'gpu_procurement' }
    },
    {
      id: 'createOrder',
      name: 'POST /api/paypal/create-order',
      method: 'POST',
      url: '/api/paypal/create-order',
      defaultBody: { amount: 2150.00, currency: 'USD', description: 'NexusPay Escrow Hold', customId: 'MANDATE_001' }
    },
    {
      id: 'verifyMilestone',
      name: 'POST /api/agent/verify-milestone',
      method: 'POST',
      url: '/api/agent/verify-milestone',
      defaultBody: {
        contractId: 'NP-CTR-DEMO',
        milestoneIndex: 1,
        deliverable: { name: 'Cluster Provisioning Benchmark' },
        supplierWallet: 'billing@aetheria-cloud.ai',
        amount: 537.50,
        simulateFailure: false
      }
    },
    {
      id: 'arbitrate',
      name: 'POST /api/agent/arbitrate',
      method: 'POST',
      url: '/api/agent/arbitrate',
      defaultBody: {
        contractId: 'NP-CTR-DEMO',
        disputeReason: 'SLA Latency Violation',
        agreedAmount: 2150.00,
        totalEscrowRemaining: 1612.50
      }
    },
    {
      id: 'telemetry',
      name: 'GET /api/telemetry/transactions',
      method: 'GET',
      url: '/api/telemetry/transactions',
      defaultBody: null
    },
    {
      id: 'treasury',
      name: 'GET /api/telemetry/treasury',
      method: 'GET',
      url: '/api/telemetry/treasury',
      defaultBody: null
    }
  ];

  const handleSelectEndpoint = (epId) => {
    const ep = endpoints.find(e => e.id === epId);
    if (!ep) return;
    setSelectedEndpoint(epId);
    setRequestBody(ep.defaultBody ? JSON.stringify(ep.defaultBody, null, 2) : '');
    setResponse(null);
  };

  const handleSend = async () => {
    const ep = endpoints.find(e => e.id === selectedEndpoint);
    if (!ep) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      let res;
      if (ep.method === 'POST') {
        const parsed = requestBody ? JSON.parse(requestBody) : {};
        res = await axios.post(ep.url, parsed);
      } else {
        res = await axios.get(ep.url);
      }

      setResponse({
        status: res.status,
        statusText: res.statusText || 'OK',
        timeMs: Date.now() - startTime,
        headers: res.headers,
        data: res.data
      });
    } catch (err) {
      setResponse({
        status: err.response?.status || 500,
        statusText: err.response?.statusText || 'Error',
        timeMs: Date.now() - startTime,
        headers: err.response?.headers || {},
        data: err.response?.data || { error: err.message }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeEp = endpoints.find(e => e.id === selectedEndpoint);

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header & Postman Download Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Postman API Runner & APIMatic DevHub
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  Postman v2.1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Interactive request runner, OpenAPI 3.1 schema & 1-click Postman collection export
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/postman/collection"
            download="nexuspay_postman_collection.json"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors shadow-md shadow-orange-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Postman Collection</span>
          </a>

          <a
            href="/api/docs/openapi.json"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>OpenAPI 3.1 JSON</span>
          </a>
        </div>
      </div>

      {/* Interactive Runner Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Select API Operation:
          </div>

          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => handleSelectEndpoint(ep.id)}
              className={`w-full text-left p-3 rounded-2xl border text-xs font-mono transition-all flex items-center justify-between ${
                selectedEndpoint === ep.id
                  ? 'bg-orange-950/20 border-orange-500/50 text-white shadow-sm ring-1 ring-orange-500/20'
                  : 'bg-[#0A0F1D] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  ep.method === 'POST' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {ep.method}
                </span>
                <span className="truncate">{ep.url.replace('/api', '')}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Request & Response Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* URL & Send Bar */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-white/[0.08]">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
              activeEp?.method === 'POST' ? 'bg-[#0070BA] text-white' : 'bg-emerald-600 text-white'
            }`}>
              {activeEp?.method}
            </span>
            <span className="font-mono text-xs text-slate-300 flex-1 truncate px-1">
              {activeEp?.url}
            </span>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>

          {/* Request Body (if POST) */}
          {activeEp?.method === 'POST' && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5 font-mono">
                Request Payload (JSON):
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/[0.06] font-mono text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          {/* Live Response Box */}
          {response && (
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    response.status < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-slate-400 text-[11px]">{response.timeMs}ms</span>
                </div>
                <span className="text-[10px] text-slate-500">Express API</span>
              </div>

              <pre className="max-h-60 overflow-y-auto text-slate-300 text-[11px] leading-relaxed">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
