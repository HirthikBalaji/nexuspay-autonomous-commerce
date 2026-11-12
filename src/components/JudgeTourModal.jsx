import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Scale, 
  Clock, 
  Search, 
  Radio 
} from 'lucide-react';

export default function JudgeTourModal({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onRunNegotiation,
  onOpenPayPalModal,
  onVerifyMilestone,
  onEscalateToArbitration,
  onRunArbitration,
  deliverables = [],
  contract
}) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const TOUR_STEPS = [
    {
      step: 1,
      targetTab: 'catalog',
      title: '1. Channel3 Dynamic Agent Commerce Catalog',
      sponsorBadge: 'Channel3 ($1,500 Prize)',
      description: 'Autonomous Buyer Agent discovers compute clusters with real-time spot pricing, supplier trust ratings, and 1-click RFQ dispatch.',
      actionLabel: 'Dispatch RFQ to Agents & Open Negotiation',
      onExecute: () => {
        onSelectTab('escrow');
        onRunNegotiation();
        setCurrentStep(1);
      }
    },
    {
      step: 2,
      targetTab: 'escrow',
      title: '2. Real OpenRouter LLM Negotiation & Spend Covenants',
      sponsorBadge: 'PayPal + AI ($5,000 Prize) • OpenRouter LLM',
      description: 'Atlas (Buyer) and Hermes (Supplier) engage in dynamic multi-turn negotiation powered by real OpenRouter LLM inference, settling price, milestones, and SLA covenants in real time.',
      actionLabel: 'View Agreement & Lock PayPal Escrow',
      onExecute: () => {
        onSelectTab('escrow');
        onOpenPayPalModal();
        setCurrentStep(2);
      }
    },
    {
      step: 3,
      targetTab: 'escrow',
      title: '3. PayPal Smart Escrow Vault (Orders v2 API)',
      sponsorBadge: 'PayPal Grand Prize ($12,000)',
      description: 'Escrow commitment is securely authorized and captured into the smart clearinghouse vault via PayPal Orders v2 API with official PayPal JS SDK buttons.',
      actionLabel: 'Verify Milestone 1 & Trigger PayPal Payout',
      onExecute: () => {
        onSelectTab('escrow');
        if (deliverables[0]) {
          onVerifyMilestone(0, deliverables[0], false);
        }
        setCurrentStep(3);
      }
    },
    {
      step: 4,
      targetTab: 'bryntum',
      title: '4. Bryntum Interactive Milestone Gantt & Critical Path',
      sponsorBadge: 'Bryntum ($1,000 Prize)',
      description: 'Interactive project scheduler with task dependencies, 32h critical path horizon, and automated PayPal disbursement trigger points.',
      actionLabel: 'Trigger Milestone 2 SLA Breach & Elastic Anomaly',
      onExecute: () => {
        onSelectTab('escrow');
        if (deliverables[1]) {
          onVerifyMilestone(1, deliverables[1], true);
        }
        setCurrentStep(4);
      }
    },
    {
      step: 5,
      targetTab: 'elastic',
      title: '5. Elastic Telemetry Search & Anomaly Detection',
      sponsorBadge: 'Elastic Impact Prize',
      description: 'Elasticsearch Query DSL simulator scores telemetry anomaly (0.92 critical) upon detecting a +426% latency spike (184ms vs 35ms ceiling).',
      actionLabel: 'Escalate to Themis AI Arbiter Court',
      onExecute: () => {
        onSelectTab('arbitration');
        onEscalateToArbitration?.();
        setCurrentStep(5);
      }
    },
    {
      step: 6,
      targetTab: 'arbitration',
      title: '6. Themis AI Arbiter (Real OpenRouter LLM Judicial Ruling)',
      sponsorBadge: 'Sub-Second Multimodal Dispute • OpenRouter LLM',
      description: 'Themis autonomous judicial AI model calls OpenRouter in real-time to analyze telemetry logs, deliver an authoritative legal ruling on SLA covenants, and trigger PayPal Refund API + partial payout.',
      actionLabel: 'Deliberate Case & Enforce PayPal Ruling',
      onExecute: () => {
        onSelectTab('arbitration');
        onRunArbitration?.();
        setCurrentStep(6);
      }
    },
    {
      step: 7,
      targetTab: 'grid',
      title: '7. AG Grid Enterprise Telemetry & Circuit Breakers',
      sponsorBadge: 'AG Grid 1st Place ($5,000 Prize)',
      description: 'Enterprise treasury console powered by AG Grid with live tick streaming, SVG risk gauges, sub-millisecond filtering, and 1-click agent freeze circuit breakers.',
      actionLabel: 'Explore Full Treasury & Export CSV',
      onExecute: () => {
        onSelectTab('grid');
        onClose();
      }
    }
  ];

  const current = TOUR_STEPS[currentStep] || TOUR_STEPS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#0D1424] border border-amber-500/40 w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl relative shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Judge Guided Walkthrough Tour</h3>
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Experience the end-to-end autonomous agent commerce flow in 90 seconds
            </p>
          </div>
        </div>

        {/* Step Body */}
        <div className="my-5 p-5 rounded-2xl bg-slate-900/80 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">{current.title}</span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold">
              {current.sponsorBadge}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {current.description}
          </p>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-2 pb-5">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                onSelectTab(s.targetTab);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => {
                const prev = Math.max(0, currentStep - 1);
                setCurrentStep(prev);
                onSelectTab(TOUR_STEPS[prev].targetTab);
              }}
              disabled={currentStep === 0}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                const next = Math.min(TOUR_STEPS.length - 1, currentStep + 1);
                setCurrentStep(next);
                onSelectTab(TOUR_STEPS[next].targetTab);
              }}
              disabled={currentStep === TOUR_STEPS.length - 1}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1.5"
            >
              <span>Skip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={current.onExecute}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>{current.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
