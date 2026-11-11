import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function PayPalModal({
  isOpen,
  onClose,
  contract,
  onApproveEscrow
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !contract) return null;

  const orderAmount = contract.agreedAmount || 2150;
  const orderId = contract.paypalOrder?.id || 'ORD-8921A4B9';

  const handleInstantApprove = async () => {
    setIsProcessing(true);
    try {
      await onApproveEscrow(orderId);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D1424] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-paypal-dark to-paypal-light flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-paypal-light/20">
            Ψ
          </div>
          <div>
            <h3 className="text-base font-bold text-white">PayPal Smart Escrow Authorization</h3>
            <p className="text-xs text-slate-400">
              Contract Ref: <span className="font-mono text-paypal-cyan">{contract.contractId}</span>
            </p>
          </div>
        </div>

        {/* Amount & Mandate Breakdown */}
        <div className="my-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Escrow Commitment:</span>
            <span className="text-xl font-bold font-mono text-paypal-cyan">
              {formatCurrency(orderAmount)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Payer Agent Wallet:</span>
              <span className="font-mono text-slate-200">atlas-treasury@novacorp.ai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficiary Agent:</span>
              <span className="font-mono text-indigo-300">contracts@specter-security.ai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">PayPal Order ID:</span>
              <span className="font-mono text-paypal-cyan">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Disbursement Rail:</span>
              <span className="font-mono text-emerald-400">3-Milestone Conditional Payouts</span>
            </div>
          </div>
        </div>

        {/* Payment Buttons Section */}
        <div className="space-y-3">
          {/* Instant 1-Click Sandbox Authorization Button */}
          <button
            onClick={handleInstantApprove}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-paypal-gold via-yellow-400 to-amber-500 hover:brightness-105 active:scale-[0.99] text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? 'Locking Funds in PayPal Vault...' : 'Authorize Escrow with PayPal'}</span>
          </button>

          {/* Fallback info */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographically sealed under NovaCorp Mandate #892</span>
          </div>
        </div>
      </div>
    </div>
  );
}
