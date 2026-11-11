import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, AlertTriangle, ShieldCheck, Zap, DollarSign, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, truncateHash } from '../utils/formatters';

export default function EscrowTimeline({
  contract,
  deliverables,
  onVerifyMilestone,
  onOpenPayPalModal,
  isOrderCaptured,
  onEscalateToArbitration
}) {
  const [verifyingIndex, setVerifyingIndex] = useState(null);
  const [simulateFailures, setSimulateFailures] = useState({});

  if (!contract) return null;

  const totalAmount = contract.agreedAmount || 2150;
  const releasedAmount = deliverables
    .filter(d => d.status === 'VERIFIED_RELEASED')
    .reduce((sum, d) => sum + d.amount, 0);
  const remainingEscrow = totalAmount - releasedAmount;

  const handleVerify = async (index, deliverable) => {
    setVerifyingIndex(index);
    const shouldFail = simulateFailures[index] || false;
    
    try {
      const res = await onVerifyMilestone(index, deliverable, shouldFail);
      if (res?.success) {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#0070BA', '#38BDF8', '#10B981', '#F59E0B']
        });
      }
    } finally {
      setVerifyingIndex(null);
    }
  };

  return (
    <div id="escrow-section" className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Top Banner / Escrow Vault Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  PayPal Smart Escrow Vault
                </h3>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isOrderCaptured 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {isOrderCaptured ? 'FUNDS SECURED (CAPTURE)' : 'PENDING AUTHORIZATION'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Contract: <span className="font-mono text-slate-300">{contract.contractId}</span> • 
                Order: <span className="font-mono text-sky-400">{contract.paypalOrder?.id || 'ORD-8921A4B9'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Financial Escrow Gauge & CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-slate-900/80 border border-white/[0.06] px-4 py-2 rounded-2xl text-right">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Remaining Escrow</div>
            <div className="text-base font-bold font-mono text-sky-400">
              {formatCurrency(remainingEscrow)}
            </div>
          </div>

          {!isOrderCaptured ? (
            <button
              onClick={onOpenPayPalModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Authorize PayPal Deposit</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Escrow Vault Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Milestone Settlement Schedule */}
      <div className="mt-6 space-y-3.5">
        <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
          Conditional Settlement Schedule (PayPal Payouts v1):
        </div>

        <div className="space-y-3">
          {deliverables.map((d, idx) => {
            const isReleased = d.status === 'VERIFIED_RELEASED';
            const isDisputed = d.status === 'DISPUTED';
            const isVerifying = verifyingIndex === idx;

            return (
              <div
                key={d.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isReleased
                    ? 'bg-[#0B1522] border-emerald-500/30'
                    : isDisputed
                    ? 'bg-[#181120] border-rose-500/40'
                    : 'bg-[#0A0F1D] border-white/[0.06] hover:border-white/10'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Milestone Info */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isReleased
                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                        : isDisputed
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isReleased ? <Check className="w-4 h-4 stroke-[3]" /> : `M${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{d.name}</h4>
                        <span className="text-xs font-mono font-bold text-sky-400">
                          {formatCurrency(d.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({(d.share * 100).toFixed(0)}% Tranche)
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        Proof Requirement: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 text-[11px] font-mono">{d.proofType}</code>
                      </p>

                      {/* Display Proof & Payout if Released */}
                      {isReleased && d.payoutDetails && (
                        <div className="mt-2 text-[11px] font-mono text-emerald-400 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Payout Batch: {d.payoutDetails.batch_header?.payout_batch_id || 'PO-BATCH-VERIFIED'}</span>
                          <span>Proof Hash: {truncateHash(d.verificationProof?.hash || '0x49f1a8c9b2e', 8, 6)}</span>
                        </div>
                      )}

                      {/* Display Breach info if disputed */}
                      {isDisputed && (
                        <div className="mt-2 text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Verification Rejected: Latency spike (184ms) violated 35ms ceiling.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Simulation Toggles */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Failure Simulation Toggle */}
                    {!isReleased && !isDisputed && (
                      <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/20">
                        <input
                          type="checkbox"
                          checked={simulateFailures[idx] || false}
                          onChange={(e) => setSimulateFailures({
                            ...simulateFailures,
                            [idx]: e.target.checked
                          })}
                          className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                        />
                        <span className="text-rose-400 font-medium">Simulate SLA Breach</span>
                      </label>
                    )}

                    {/* Verification / Payout Button */}
                    {!isReleased && !isDisputed ? (
                      <button
                        onClick={() => handleVerify(idx, d)}
                        disabled={isVerifying || !isOrderCaptured}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          !isOrderCaptured
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : isVerifying
                            ? 'bg-sky-600/50 text-white cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.01]'
                        }`}
                      >
                        {isVerifying ? (
                          <>
                            <Zap className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify & Release Payout</span>
                          </>
                        )}
                      </button>
                    ) : isDisputed ? (
                      <button
                        onClick={onEscalateToArbitration}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Escalate to Themis AI Arbiter</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Payout Settled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
