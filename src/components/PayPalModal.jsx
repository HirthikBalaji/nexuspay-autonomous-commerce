import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, Lock, ShieldCheck, CheckCircle2, ArrowRight, DollarSign, Zap, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDualCurrency } from '../utils/formatters';
import { paypalService } from '../services/paypalService';

export default function PayPalModal({
  isOpen,
  onClose,
  contract,
  onApproveEscrow,
  paypalClientId
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkError, setSdkError] = useState(null);

  if (!isOpen || !contract) return null;

  const orderAmount = contract.agreedAmount || 2150;
  const orderId = contract.paypalOrder?.id || 'ORD-8921A4B9';
  const effectiveClientId = paypalClientId && paypalClientId.trim() !== '' ? paypalClientId.trim() : 'test';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#0D1424] border border-white/[0.08] w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0070BA] to-[#003087] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-[#0070BA]/20">
            Ψ
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              PayPal Smart Escrow Authorization
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Official SDK
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contract: <span className="font-mono text-sky-400">{contract.contractId}</span>
            </p>
          </div>
        </div>

        {/* Amount & Mandate Breakdown */}
        <div className="my-4 p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Escrow Commitment:</span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {formatDualCurrency(orderAmount)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-1.5 text-xs text-slate-300">
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
              <span className="font-mono text-sky-400">{orderId}</span>
            </div>
          </div>
        </div>

        {/* Interactive Payment Section */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Real PayPal JS SDK Buttons */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
            <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center justify-between">
              <span>Official PayPal Smart Buttons</span>
              <span className="text-[10px] text-sky-400 font-mono">Live Sandbox Rail</span>
            </div>

            <PayPalScriptProvider options={{
              clientId: effectiveClientId,
              currency: 'USD',
              intent: 'capture',
              components: 'buttons'
            }}>
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  shape: 'rect',
                  color: 'gold',
                  height: 42,
                  label: 'pay'
                }}
                createOrder={async () => {
                  try {
                    const res = await paypalService.createOrder({
                      amount: orderAmount,
                      currency: 'USD',
                      description: `NexusPay Escrow [${contract.contractId}]`,
                      customId: contract.contractId
                    });
                    return res.id;
                  } catch (err) {
                    console.error('Error creating order via PayPal SDK:', err);
                    return orderId;
                  }
                }}
                onApprove={async (data) => {
                  setIsProcessing(true);
                  try {
                    await paypalService.captureOrder(data.orderID || orderId);
                    await onApproveEscrow(data.orderID || orderId);
                    onClose();
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                onError={(err) => {
                  console.warn('PayPal Button SDK Info:', err);
                  setSdkError(err.message);
                }}
              />
            </PayPalScriptProvider>
          </div>

          {/* Quick Instant Sandbox Auto-Approve Option */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/[0.06]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500">
              Or Autonomous Quick-Approval
            </span>
            <div className="flex-grow border-t border-white/[0.06]"></div>
          </div>

          <button
            onClick={handleInstantApprove}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/[0.08]"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isProcessing ? 'Capturing Escrow...' : 'Instant 1-Click Sandbox Authorization'}</span>
          </button>
        </div>

        {/* Security badge footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted Vault</span>
          </div>
          <span className="font-mono text-slate-500">PayPal REST v2</span>
        </div>
      </div>
    </div>
  );
}
