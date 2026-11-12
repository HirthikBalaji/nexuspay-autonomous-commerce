import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SponsorBar({ activeTab, onSelectTab }) {
  const subsystems = [
    { id: 'channel3', step: '1', role: 'Discovery', engine: 'Channel3', tab: 'channel3', color: 'text-purple-300' },
    { id: 'negotiation', step: '2', role: 'Negotiation', engine: 'LLM Agents', tab: 'negotiation', color: 'text-indigo-300' },
    { id: 'paypal', step: '3', role: 'Settlement', engine: 'PayPal Orders v2', tab: 'escrow', color: 'text-sky-300' },
    { id: 'bryntum', step: '4', role: 'Execution', engine: 'Bryntum Gantt', tab: 'bryntum', color: 'text-emerald-300' },
    { id: 'elastic', step: '5', role: 'Watchdog', engine: 'Elastic Vectors', tab: 'elastic', color: 'text-cyan-300' },
    { id: 'themis', step: '6', role: 'Arbiter', engine: 'Themis AI Court', tab: 'themis', color: 'text-rose-300' },
    { id: 'aggrid', step: '7', role: 'Treasury', engine: 'AG Grid', tab: 'grid', color: 'text-amber-300' }
  ];

  return (
    <div className="border-b border-white/[0.04] bg-[#070B14]/70 py-2 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Autonomous Architecture Pipeline:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {subsystems.map((s, idx) => {
            const isActive = activeTab === s.tab;
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => onSelectTab(s.tab)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white border-sky-500/40 shadow-sm'
                      : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`}></span>
                  <span className="text-[10px] text-slate-500 font-bold">{s.step}.</span>
                  <span className="font-semibold text-slate-200">{s.role}</span>
                  <span className={`text-[10px] hidden lg:inline font-mono ${s.color}`}>({s.engine})</span>
                </button>
                {idx < subsystems.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 hidden sm:inline" />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
}
