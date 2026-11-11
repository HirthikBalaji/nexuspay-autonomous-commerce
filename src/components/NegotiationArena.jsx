import React from 'react';
import { Bot, UserCheck, Shield, Check, Clock, ArrowRightLeft, FileCheck, DollarSign } from 'lucide-react';
import { formatCurrency, truncateHash } from '../utils/formatters';

export default function NegotiationArena({ 
  contract, 
  isNegotiating, 
  onRunNegotiation,
  onProceedToEscrow 
}) {
  if (!contract && !isNegotiating) {
    return (
      <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-8 text-center my-5 shadow-xl">
        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <ArrowRightLeft className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1.5">Autonomous Negotiation Arena</h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          Watch Buyer Agent (Atlas) and Supplier Agent (Hermes) autonomously negotiate specifications, SLAs, dynamic volume pricing, and PayPal escrow terms in real-time.
        </p>
        <button
          onClick={onRunNegotiation}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0070BA] to-sky-500 text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.01]"
        >
          Start Live Negotiation Simulation
        </button>
      </div>
    );
  }

  const buyer = contract?.buyer || { name: 'Atlas (NovaCorp Procurement)', id: 'AGENT_ATLAS_01' };
  const supplier = contract?.supplier || { name: 'Hermes (Aetheria Nodes)', id: 'AGENT_HERMES_09' };
  const rounds = contract?.rounds || [];

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <h3 className="text-base font-bold text-white">Live Multi-Agent Negotiation Arena</h3>
            {contract?.contractId && (
              <span className="font-mono text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md">
                {contract.contractId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-normal">
            Autonomous dynamic price & SLA convergence with PayPal Escrow Covenants
          </p>
        </div>

        {/* Agents Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
            <div className="w-5 h-5 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-400 text-xs font-bold">
              A
            </div>
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Buyer</div>
              <div className="text-xs font-semibold text-white">{buyer.name.split(' ')[0]}</div>
            </div>
          </div>

          <span className="text-slate-600 font-mono text-xs">VS</span>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06]">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              H
            </div>
            <div className="text-left">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Supplier</div>
              <div className="text-xs font-semibold text-white">{supplier.name.split(' ')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Message Stream */}
      <div className="space-y-3.5 py-5 max-h-[440px] overflow-y-auto pr-2">
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
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Proceed to PayPal Smart Escrow</span>
            <DollarSign className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
