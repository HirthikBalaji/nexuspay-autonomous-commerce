import React, { useState } from 'react';
import { 
  Bot, 
  ArrowRightLeft, 
  FileCheck, 
  DollarSign, 
  BrainCircuit, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Send 
} from 'lucide-react';
import { formatCurrency, truncateHash } from '../utils/formatters';

export default function NegotiationArena({ 
  contract, 
  isNegotiating, 
  onRunNegotiation,
  onProceedToEscrow,
  selectedScenario,
  onSelectScenario
}) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('Custom 32-Node H200 Cloud GPU Cluster');
  const [customBudget, setCustomBudget] = useState('3200');
  const [customSla, setCustomSla] = useState('99.95% uptime, <10ms peer latency');

  const presets = [
    { id: 'gpu_procurement', label: '⚡ H100 GPU Cluster', budget: 2400 },
    { id: 'ai_security_audit', label: '🛡️ LLM Red-Team Audit', budget: 1950 },
    { id: 'oracle_data_feed', label: '📈 Real-time Oracle Feed', budget: 650 },
    { id: 'multimodal_dataset', label: '📊 Dataset Curation', budget: 1200 }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle || !customBudget) return;
    onRunNegotiation({
      title: customTitle,
      budget: parseFloat(customBudget),
      slaRequirement: customSla
    });
  };

  const buyer = contract?.buyer || { name: 'Atlas (NovaCorp Procurement)', id: 'AGENT_ATLAS_01' };
  const supplier = contract?.supplier || { name: 'Hermes (Aetheria Nodes)', id: 'AGENT_HERMES_09' };
  const rounds = contract?.rounds || [];

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white">Autonomous Multi-Agent Negotiation Arena</h3>
            {contract?.contractId && (
              <span className="font-mono text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
                {contract.contractId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Autonomous dynamic price & SLA convergence governed by PayPal Smart Escrow Covenants
          </p>
        </div>

        {/* Presets & Custom Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          {!showCustomForm ? (
            <>
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (onSelectScenario) onSelectScenario(p.id);
                    onRunNegotiation(null, p.id);
                  }}
                  disabled={isNegotiating}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    selectedScenario === p.id && !contract?.isCustom
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border-white/[0.06] hover:text-white hover:border-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setShowCustomForm(true)}
                className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all flex items-center gap-1.5 font-medium"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom RFP</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowCustomForm(false)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all"
            >
              Back to Presets
            </button>
          )}
        </div>
      </div>

      {/* Custom RFP Form Drawer */}
      {showCustomForm && (
        <form onSubmit={handleCustomSubmit} className="mt-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Judge Custom RFP Generator (Generative Agent Deliberation)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Procurement Mandate Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder="e.g. 100k Synthetic Audio Training Tokens"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Budget Ceiling ($ USD)</label>
              <input
                type="number"
                value={customBudget}
                onChange={e => setCustomBudget(e.target.value)}
                placeholder="2500"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Strict SLA Requirement</label>
              <input
                type="text"
                value={customSla}
                onChange={e => setCustomSla(e.target.value)}
                placeholder="99.9% uptime, <15ms latency"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isNegotiating}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isNegotiating ? 'Agents Deliberating...' : 'Deploy Autonomous Negotiation'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Agents Badges Bar */}
      <div className="flex items-center justify-between mt-4 py-2 border-b border-white/[0.04] text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xs font-bold">
            A
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block leading-none">Buyer Agent</span>
            <span className="font-semibold text-slate-200">{buyer.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/[0.06] text-[10px] font-mono text-slate-400">
          <ArrowRightLeft className="w-3 h-3 text-sky-400" />
          <span>Equilibrium Protocol Active</span>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block leading-none">Supplier Agent</span>
            <span className="font-semibold text-slate-200">{supplier.name}</span>
          </div>
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
            H
          </div>
        </div>
      </div>

      {/* Real-time Message Stream */}
      <div className="space-y-3.5 py-5 max-h-[440px] overflow-y-auto pr-2">
        {rounds.length === 0 && !isNegotiating && (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">
            Click any preset or "Deploy Autonomous Negotiation" above to launch real-time agent deliberation.
          </div>
        )}

        {rounds.map((r, idx) => {
          const isBuyer = r.senderRole === 'BUYER_AGENT';
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border transition-all ${
                isBuyer
                  ? 'bg-[#0B1324] border-sky-500/20 md:mr-10'
                  : 'bg-[#121124] border-indigo-500/20 md:ml-10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isBuyer ? 'bg-sky-500/10 text-sky-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  <Bot className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{r.sender}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                        isBuyer ? 'bg-sky-500/15 text-sky-400' : 'bg-indigo-500/15 text-indigo-300'
                      }`}>
                        {r.action}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Round {r.round}/4</span>
                  </div>

                  {/* Agent Internal Chain of Thought Reasoning Pill */}
                  {r.thought && (
                    <div className="mb-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.04] text-[11px] text-slate-400 font-mono flex items-start gap-2">
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                      <span className="italic leading-relaxed">{r.thought}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans">
                    {r.message}
                  </p>

                  {/* Proposal Summary Pill */}
                  {r.proposal && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.05] font-mono text-[11px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      {r.proposal.budget && (
                        <span className="text-emerald-400 font-semibold">
                          Target: {formatCurrency(r.proposal.budget)}
                        </span>
                      )}
                      {r.proposal.sla && (
                        <span className="text-slate-400">
                          SLA: <span className="text-slate-200">{r.proposal.sla}</span>
                        </span>
                      )}
                      {r.proposal.contractHash && (
                        <span className="text-sky-400">
                          SHA-256: {truncateHash(r.proposal.contractHash, 8, 6)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isNegotiating && (
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-sky-500/20 text-center animate-pulse flex items-center justify-center gap-2 text-xs font-mono text-sky-400">
            <Zap className="w-4 h-4 animate-spin" />
            <span>Autonomous agents negotiating dynamic covenants & PayPal escrow milestones...</span>
          </div>
        )}
      </div>

      {/* Final Signed Agreement Banner */}
      {contract?.agreedAmount && (
        <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0A1A28] to-[#0A1224] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Cryptographic Agreement Executed</h4>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Total Escrow: <strong className="text-emerald-400 font-mono text-sm">{formatCurrency(contract.agreedAmount)}</strong> | 
                PayPal Order: <span className="font-mono text-sky-400">{contract.paypalOrder?.id || 'ORD-INITIALIZED'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToEscrow}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02]"
          >
            <span>Proceed to PayPal Smart Escrow</span>
            <DollarSign className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
