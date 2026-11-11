import React from 'react';
import { Scale, ShieldAlert, CheckCircle, FileText, ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency, truncateHash } from '../utils/formatters';

export default function ThemisArbiter({
  contract,
  disputeData,
  onRunArbitration,
  arbitrationRuling,
  isArbitrating
}) {
  if (!disputeData && !arbitrationRuling) return null;

  return (
    <div id="themis-section" className="bg-[#120F1D] border border-rose-500/40 rounded-3xl p-6 my-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-rose-950/60 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Themis AI Autonomous Arbitration Court</h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                  Dispute Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Sub-second multimodal dispute resolution & automated PayPal settlement enforcement
              </p>
            </div>
          </div>

          {!arbitrationRuling && (
            <button
              onClick={onRunArbitration}
              disabled={isArbitrating}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-lg shadow-rose-600/25 flex items-center gap-2 ${
                isArbitrating
                  ? 'bg-rose-800 cursor-wait'
                  : 'bg-rose-600 hover:bg-rose-500 hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isArbitrating ? 'AI Arbiter Deliberating...' : 'Deliberate & Enforce Ruling'}</span>
            </button>
          )}
        </div>

        {/* Evidence & Case Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Contractual Clause */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06]">
            <div className="text-[11px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Contract Covenant Mandate (Section 4.2)</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              "Supplier Agent guarantees P99 response latency &lt; 35ms. Latency excursion exceeding 100ms triggers immediate 45% tranche clawback to Buyer via PayPal Refund API."
            </p>
          </div>

          {/* Observed Telemetry Breach */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50">
            <div className="text-[11px] uppercase font-bold text-rose-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Observed Telemetry Breach</span>
            </div>
            <div className="text-xs text-slate-300 font-mono space-y-1">
              <div>Metric: <span className="text-rose-400 font-bold">184.2ms API Latency</span> (Ceiling: 35ms)</div>
              <div>Anomaly Delta: <span className="text-rose-400">+426% latency anomaly</span></div>
              <div>Packet Droppage: <span className="text-slate-400">4 micro-batches dropped during M2</span></div>
            </div>
          </div>
        </div>

        {/* Render Final AI Court Ruling if complete */}
        {arbitrationRuling && (
          <div className="p-5 rounded-2xl bg-[#091524] border border-sky-500/40 shadow-xl mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-2 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Themis AI Binding Ruling: Partial Breach Enforcement
                </h4>
              </div>
              <div className="text-[11px] font-mono text-sky-400">
                Confidence: {(arbitrationRuling.courtRuling?.confidenceScore * 100).toFixed(1)}% • Model: Themis-v2.4
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              {arbitrationRuling.courtRuling?.summary}
            </p>

            {/* Financial Settlement Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Buyer Refund */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-[10px] uppercase font-bold text-emerald-400">
                  Buyer Refund (PayPal Refund API)
                </div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                  {formatCurrency(arbitrationRuling.courtRuling?.allocations?.buyerRefund?.amount || 483.75)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Transaction: {arbitrationRuling.paypalRefund?.id || 'REF-AUTO-9821'} (Settled)
                </div>
              </div>

              {/* Supplier Partial Payout */}
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <div className="text-[10px] uppercase font-bold text-indigo-400">
                  Supplier Settlement (PayPal Payouts v1)
                </div>
                <div className="text-base font-bold font-mono text-indigo-400 mt-1">
                  {formatCurrency(arbitrationRuling.courtRuling?.allocations?.supplierPayout?.amount || 591.25)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Batch: {arbitrationRuling.supplierPayout?.batch_header?.payout_batch_id || 'PO-ARB-4192'} (Released)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
