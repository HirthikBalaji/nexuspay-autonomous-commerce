import React, { useState } from 'react';
import { X, FileCode, Check, Copy, ExternalLink, Code2, Terminal } from 'lucide-react';

export default function ApiDocsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('python');

  if (!isOpen) return null;

  const pythonSnippet = `import requests

# 1. Initialize Autonomous Multi-Agent Negotiation
res = requests.post("http://localhost:5000/api/agent/negotiate", json={
    "scenarioId": "gpu_procurement",
    "customTask": {
        "title": "H100 GPU Cluster Procurement",
        "budget": 2400.00
    }
})
contract = res.json()
contract_id = contract["contractId"]
paypal_order_id = contract["paypalOrder"]["id"]

print(f"Contract Negotiated: {contract_id} | PayPal Order: {paypal_order_id}")

# 2. Release Milestone 1 upon Verifiable Benchmark Proof
payout = requests.post("http://localhost:5000/api/agent/verify-milestone", json={
    "contractId": contract_id,
    "milestoneIndex": 1,
    "deliverable": contract["deliverables"][0],
    "supplierWallet": "billing@aetheria-cloud.ai",
    "amount": 537.50
})
print("PayPal Payout Settled:", payout.json()["payoutResult"]["batch_header"]["payout_batch_id"])`;

  const tsSnippet = `import axios from 'axios';

// Execute Autonomous Escrow Negotiation
const { data: contract } = await axios.post('/api/agent/negotiate', {
  scenarioId: 'gpu_procurement'
});

console.log('Agreed Escrow:', contract.agreedAmount, 'PayPal Order:', contract.paypalOrder.id);

// Verify & Release Milestone 1 via PayPal Payouts
const { data: payout } = await axios.post('/api/agent/verify-milestone', {
  contractId: contract.contractId,
  milestoneIndex: 1,
  deliverable: contract.deliverables[0],
  supplierWallet: 'billing@aetheria-cloud.ai',
  amount: 537.50
});

console.log('Payout Released:', payout.payoutResult.batch_header.payout_batch_id);`;

  const curlSnippet = `# Negotiate Contract & Initialize PayPal Escrow Order
curl -X POST http://localhost:5000/api/agent/negotiate \\
  -H "Content-Type: application/json" \\
  -d '{"scenarioId":"gpu_procurement"}'

# Verify Deliverable & Trigger PayPal Payout
curl -X POST http://localhost:5000/api/agent/verify-milestone \\
  -H "Content-Type: application/json" \\
  -d '{"contractId":"NP-CTR-A892","milestoneIndex":1,"supplierWallet":"billing@aetheria-cloud.ai","amount":537.50}'`;

  const currentCode = activeTab === 'python' ? pythonSnippet : activeTab === 'ts' ? tsSnippet : curlSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#0D1424] border border-white/[0.08] w-full max-w-3xl rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">APIMatic & OpenAPI 3.1 Developer Spec</h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase">
                APIMatic Context Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Autonomous Agent Commerce Protocol API endpoints & 1-click SDK generation
            </p>
          </div>
        </div>

        {/* Description & Links */}
        <div className="my-4 p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Raw OpenAPI 3.1 Schema:</span>
            <a
              href="/api/docs/openapi.json"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>/api/docs/openapi.json</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed font-normal">
            Compatible with <strong>APIMatic Context Plugins</strong> and <strong>Postman Collections</strong>. 
            Generate certified SDKs in Python, TypeScript, Java, and C# with zero boilerplate!
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'python'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python SDK
            </button>
            <button
              onClick={() => setActiveTab('ts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'ts'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TypeScript / Node.js
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'curl'
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL CLI
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="flex-1 overflow-y-auto mt-3 p-4 rounded-2xl bg-black/50 border border-white/[0.06] font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{currentCode}</pre>
        </div>
      </div>
    </div>
  );
}
