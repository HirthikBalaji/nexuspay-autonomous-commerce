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
      <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-8 text-center my-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400">
          <ArrowRightLeft className="w-8 h-8 text-paypal-cyan" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Autonomous Negotiation Arena Ready</h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
          Watch Buyer Agent (Atlas) and Supplier Agent (Hermes) autonomously negotiate specifications, SLAs, dynamic volume pricing, and PayPal escrow terms in real-time.
        </p>
        <button
          onClick={onRunNegotiation}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-paypal-dark to-paypal-light text-white font-medium text-sm hover:brightness-110 shadow-lg shadow-paypal-light/20 transition-all"
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
    <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 my-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-paypal-cyan animate-pulse"></span>
            <h3 className="text-lg font-bold text-white">Live Multi-Agent Negotiation Arena</h3>
            {contract?.contractId && (
              <span className="font-mono text-xs text-paypal-cyan bg-paypal-cyan/10 border border-paypal-cyan/20 px-2 py-0.5 rounded">
                {contract.contractId}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic convergence protocol between autonomous economic actors using PayPal Escrow Covenants
          </p>
        </div>

        {/* Agents Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-paypal-light/20 flex items-center justify-center text-paypal-cyan text-xs font-bold">
              A
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none">Buyer Agent</div>
              <div className="text-xs font-medium text-white">{buyer.name.split(' ')[0]}</div>
            </div>
          </div>

          <div className="text-slate-600 font-mono text-xs">VS</div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              H
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none">Supplier Agent</div>
              <div className="text-xs font-medium text-white">{supplier.name.split(' ')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Message Stream */}
      <div className="space-y-4 py-5 max-h-[420px] overflow-y-auto pr-2">
        {rounds.map((r, idx) => {
          const isBuyer = r.senderRole === 'BUYER_AGENT';
          return (
            <div 
              key={idx} 
              className={`flex flex-col sm:flex-row items-start gap-3 p-4 rounded-xl border transition-all ${
                isBuyer
                  ? 'bg-[#0a101f] border-paypal-light/30 sm:mr-8'
                  : 'bg-[#111326] border-indigo-500/30 sm:ml-8'
              }`}
            >
              {/* Agent Icon */}
              <div className={`p-2 rounded-lg shrink-0 ${isBuyer ? 'bg-paypal-light/20 text-paypal-cyan' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <Bot className="w-5 h-5" />
              </div>

              {/* Message Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{r.sender}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isBuyer ? 'bg-paypal-cyan/15 text-paypal-cyan' : 'bg-indigo-400/15 text-indigo-300'
                    }`}>
                      {r.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Round {r.round} of 4</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {r.message}
                </p>

                {/* Structured proposal snippet */}
                {r.proposal && (
                  <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-slate-800/80 font-mono text-[11px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                    {r.proposal.budget && (
                      <span className="text-emerald-400 font-semibold">
                        Proposed Amount: {formatCurrency(r.proposal.budget)}
                      </span>
                    )}
                    {r.proposal.sla && (
                      <span className="text-slate-400">
                        SLA: <span className="text-white">{r.proposal.sla}</span>
                      </span>
                    )}
                    {r.proposal.contractHash && (
                      <span className="text-paypal-cyan">
                        SHA-256: {truncateHash(r.proposal.contractHash, 8, 6)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Signed Agreement Banner */}
      {contract?.agreedAmount && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0a1b2a] to-paypal-dark/30 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Cryptographic Contract Agreement Reached</h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  100% Signed
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Total Escrow: <strong className="text-emerald-400 font-mono text-sm">{formatCurrency(contract.agreedAmount)}</strong> | 
                PayPal Order ID: <span className="font-mono text-paypal-cyan">{contract.paypalOrder?.id || 'ORD-INITIALIZED'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToEscrow}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-paypal-cyan hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-paypal-cyan/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Proceed to PayPal Smart Escrow</span>
            <DollarSign className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
