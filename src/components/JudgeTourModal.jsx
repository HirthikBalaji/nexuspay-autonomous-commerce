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
      targetTab: 'channel3',
      title: 'Stage 1: Discovery Layer (Channel3 Catalog)',
      sponsorBadge: 'Channel3 • Agent Discovery Protocol',
      description: 'Autonomous Buyer Agent discovers compute clusters with real-time spot pricing, supplier trust ratings, and 1-click RFQ dispatch into the negotiation pipeline.',
      actionLabel: 'Inspect Supplier Catalog & Dispatch RFQ',
      onExecute: () => {
        onSelectTab('channel3');
        setCurrentStep(1);
      }
    },
    {
      step: 2,
      targetTab: 'negotiation',
      title: 'Stage 2: Negotiation Layer (OpenRouter LLM)',
      sponsorBadge: 'PayPal + AI • Real LLM Covenants',
      description: 'Atlas (Buyer) and Hermes (Supplier) engage in dynamic multi-turn reasoning powered by live OpenRouter LLM inference, settling price, deliverables, and SLA covenants.',
      actionLabel: 'Launch Negotiation & Agree Covenants',
      onExecute: () => {
        onSelectTab('negotiation');
        onRunNegotiation();
        setCurrentStep(2);
      }
    },
    {
      step: 3,
      targetTab: 'escrow',
      title: 'Stage 3: Settlement Rails (PayPal Vault & Orders v2)',
      sponsorBadge: 'PayPal Grand Prize • Orders v2 & Payouts API',
      description: 'Escrow commitment is securely authorized and captured into the smart clearinghouse vault via PayPal Orders v2 API with official PayPal JS SDK buttons.',
      actionLabel: 'View Settlement Rails & Verify Milestone 1',
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
      title: 'Stage 4: Execution Timeline (Bryntum Gantt)',
      sponsorBadge: 'Bryntum Gantt • Real @bryntum/gantt Engine',
      description: 'Interactive execution timeline with task dependencies, 32-hour critical path horizon, draggable milestones, and milestone disbursement trigger points.',
      actionLabel: 'Inspect Critical Path & Milestone Dependencies',
      onExecute: () => {
        onSelectTab('bryntum');
        setCurrentStep(4);
      }
    },
    {
      step: 5,
      targetTab: 'elastic',
      title: 'Stage 5: Telemetry Watchdog (Elastic Vectors)',
      sponsorBadge: 'Elastic • 1,536-dim SLA Vector Embeddings',
      description: 'Elasticsearch Query DSL engine monitors agent telemetry in real-time. Detects +426% latency anomaly (184ms vs 35ms ceiling) via cosine vector similarity scoring.',
      actionLabel: 'Inspect SLA Anomaly & Escalate to Arbiter',
      onExecute: () => {
        onSelectTab('elastic');
        setCurrentStep(5);
      }
    },
    {
      step: 6,
      targetTab: 'themis',
      title: 'Stage 6: Judicial Arbiter (Themis AI Court)',
      sponsorBadge: 'Themis AI • Live OpenRouter LLM Judicial Ruling',
      description: 'Themis autonomous judicial model calls OpenRouter in real-time to analyze telemetry logs, deliver an authoritative legal ruling on SLA covenants, and trigger PayPal Refund API + partial payout.',
      actionLabel: 'Deliberate Case & Enforce PayPal Refund',
      onExecute: () => {
        onSelectTab('themis');
        onRunArbitration?.();
        setCurrentStep(6);
      }
    },
    {
      step: 7,
      targetTab: 'grid',
      title: 'Stage 7: Treasury Risk Terminal (AG Grid Enterprise)',
      sponsorBadge: 'AG Grid • Institutional Fleet Telemetry',
      description: 'Enterprise treasury console powered by AG Grid with live tick streaming, SVG risk gauges, sub-millisecond filtering, and 1-click agent freeze circuit breakers.',
      actionLabel: 'Explore Treasury Fleet & Export Report',
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
