import React from 'react';
import { 
  ShoppingCart, 
  MessageSquare, 
  Shield, 
  Clock, 
  Search, 
  Scale, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function LifecyclePipelineBar({ activeTab, onSelectTab }) {
  const LIFECYCLE_STAGES = [
    {
      step: 1,
      id: 'channel3',
      layer: 'Discovery',
      engine: 'Channel3',
      subsystem: 'Supplier Catalog',
      role: 'How agents find suppliers',
      icon: ShoppingCart,
      color: 'text-purple-400',
      activeBorder: 'border-purple-500/60 bg-purple-950/20 shadow-purple-500/10'
    },
    {
      step: 2,
      id: 'negotiation',
      layer: 'Negotiation',
      engine: 'OpenRouter LLM',
      subsystem: 'Dynamic Reasoning',
      role: 'How agents agree',
      icon: MessageSquare,
      color: 'text-indigo-400',
      activeBorder: 'border-indigo-500/60 bg-indigo-950/20 shadow-indigo-500/10'
    },
    {
      step: 3,
      id: 'escrow',
      layer: 'Settlement',
      engine: 'PayPal Vault',
      subsystem: 'Smart Escrow Rails',
      role: 'How funds lock & disburse',
      icon: Shield,
      color: 'text-sky-400',
      activeBorder: 'border-sky-500/60 bg-sky-950/20 shadow-sky-500/10'
    },
    {
      step: 4,
      id: 'bryntum',
      layer: 'Execution',
      engine: 'Bryntum Gantt',
      subsystem: 'Milestone Scheduler',
      role: 'Execution timeline & critical path',
      icon: Clock,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-500/60 bg-emerald-950/20 shadow-emerald-500/10'
    },
    {
      step: 5,
      id: 'elastic',
      layer: 'Watchdog',
      engine: 'Elastic Vectors',
      subsystem: '1,536-dim Anomaly Log',
      role: 'Telemetry SLA watchdog',
      icon: Search,
      color: 'text-cyan-400',
      activeBorder: 'border-cyan-500/60 bg-cyan-950/20 shadow-cyan-500/10'
    },
    {
      step: 6,
      id: 'themis',
      layer: 'Judicial',
      engine: 'Themis AI Court',
      subsystem: 'Dispute Arbitration',
      role: 'Automated clawback & refunds',
      icon: Scale,
      color: 'text-rose-400',
      activeBorder: 'border-rose-500/60 bg-rose-950/20 shadow-rose-500/10'
    },
    {
      step: 7,
      id: 'grid',
      layer: 'Treasury',
      engine: 'AG Grid',
      subsystem: 'Institutional Terminal',
      role: 'Fleet risk & circuit breakers',
      icon: Layers,
      color: 'text-amber-400',
      activeBorder: 'border-amber-500/60 bg-amber-950/20 shadow-amber-500/10'
    }
  ];

  return (
    <div className="w-full my-4 rounded-3xl bg-[#090E1B] border border-white/[0.08] p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Autonomous Commerce Lifecycle: The 7 Subsystems
          </h4>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Unified Machine Architecture • Click any subsystem to inspect
        </div>
      </div>

      {/* 7-Step Interactive Pipeline Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {LIFECYCLE_STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeTab === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectTab(stage.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between group ${
                isActive
                  ? `${stage.activeBorder} shadow-lg ring-1 ring-white/10`
                  : 'bg-slate-900/60 border-white/[0.05] hover:border-white/20 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stage.step}
                  </span>
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${stage.color}`} />
                </div>

                <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                  <span>{stage.layer}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>}
                </div>

                <div className="text-[10px] font-mono text-slate-300 font-medium truncate mt-0.5">
                  {stage.engine}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/[0.04] text-[9px] text-slate-400 leading-snug font-sans">
                {stage.role}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
