import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, Zap, ArrowRight, DollarSign } from 'lucide-react';
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
        // Trigger celebratory confetti for PayPal Payout release!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0079C1', '#00B8D9', '#10B981', '#FFC439']
        });
      }
    } finally {
      setVerifyingIndex(null);
    }
  };

  return (
    <div id="escrow-section" className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 my-6 shadow-xl">
      {/* Top Banner / Escrow Vault Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-paypal-light/20 text-paypal-cyan">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                PayPal Smart Escrow Vault
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isOrderCaptured 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isOrderCaptured ? 'FUNDS SECURED (CAPTURE)' : 'PENDING AUTHORIZATION'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Contract: <span className="font-mono text-slate-300">{contract.contractId}</span> • 
                PayPal Order: <span className="font-mono text-paypal-cyan">{contract.paypalOrder?.id || 'ORD-8921A4B9'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Financial Escrow Gauge */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
            <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Remaining in Escrow</div>
            <div className="text-base font-bold font-mono text-paypal-cyan">
              {formatCurrency(remainingEscrow)}
            </div>
          </div>

          {!isOrderCaptured ? (
            <button
              onClick={onOpenPayPalModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-paypal-gold via-yellow-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-yellow-500/20 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>Authorize PayPal Deposit</span>
            </button>
          ) : (
            <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow Vault Active</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Milestone Deliverables Progression */}
      <div className="mt-6 space-y-4">
        <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
          Milestone Settlement Schedule (PayPal Payouts v1 Rail):
        </div>

        <div className="grid grid-cols-1 gap-4">
          {deliverables.map((d, idx) => {
            const isReleased = d.status === 'VERIFIED_RELEASED';
            const isDisputed = d.status === 'DISPUTED';
            const isVerifying = verifyingIndex === idx;

            return (
              <div
                key={d.id}
                className={`p-4 rounded-xl border transition-all ${
                  isReleased
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : isDisputed
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Milestone Info */}
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isReleased
                        ? 'bg-emerald-500 text-slate-950'
                        : isDisputed
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isReleased ? '✓' : `M${idx + 1}`}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{d.name}</h4>
                        <span className="text-xs font-mono font-semibold text-paypal-cyan">
                          {formatCurrency(d.amount)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({(d.share * 100).toFixed(0)}% Tranche)
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        Proof Requirement: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 text-[11px]">{d.proofType}</code>
                      </p>

                      {/* Display Proof Hash / Payout if Released */}
                      {isReleased && d.payoutDetails && (
                        <div className="mt-2 text-[11px] font-mono text-emerald-400 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Payout Batch ID: {d.payoutDetails.batch_header?.payout_batch_id || 'PO-BATCH-VERIFIED'}</span>
                          <span>Proof: {truncateHash(d.verificationProof?.hash || '0x49f1a8c9b2e', 8, 6)}</span>
                        </div>
                      )}

                      {/* Display Breach info if disputed */}
                      {isDisputed && (
                        <div className="mt-2 text-[11px] font-mono text-red-400 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Verification Rejected: Latency spike (184ms) violated 35ms SLA covenant.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Simulation Toggles */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Failure Simulation Toggle */}
                    {!isReleased && !isDisputed && (
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
                        <input
                          type="checkbox"
                          checked={simulateFailures[idx] || false}
                          onChange={(e) => setSimulateFailures({
                            ...simulateFailures,
                            [idx]: e.target.checked
                          })}
                          className="rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0"
                        />
                        <span className="text-red-400">Simulate SLA Breach</span>
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
                            ? 'bg-paypal-light/50 text-white cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
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
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Escalate to Themis AI Arbiter</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>PayPal Payout Settled</span>
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
