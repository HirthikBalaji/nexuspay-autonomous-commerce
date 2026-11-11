import React from 'react';
import { Sparkles, Shield, Layers, Clock, ShoppingCart, Search, FileCode, Check } from 'lucide-react';

export default function SponsorBar({ activeTab, onSelectTab }) {
  const sponsors = [
    { id: 'paypal', name: 'PayPal', detail: 'Orders & Payouts v1', tab: 'escrow', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'aggrid', name: 'AG Grid', detail: 'Telemetry Engine', tab: 'grid', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'bryntum', name: 'Bryntum', detail: 'Milestone Gantt', tab: 'bryntum', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'channel3', name: 'Channel3', detail: 'Agent Catalog', tab: 'channel3', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'elastic', name: 'Elastic', detail: 'Vector Intelligence', tab: 'elastic', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'apimatic', name: 'Postman & APIMatic', detail: 'DevHub & SDKs', tab: 'devhub', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' }
  ];

  return (
    <div className="border-b border-white/[0.04] bg-[#070B14]/60 py-2 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Sponsor Ecosystem:</span>
        </div>

        <div className="flex items-center gap-2">
          {sponsors.map((s) => {
            const isActive = activeTab === s.tab;
            return (
              <button
                key={s.id}
                onClick={() => onSelectTab(s.tab)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white border-white/20 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`}></span>
                <span className="font-semibold text-slate-200">{s.name}</span>
                <span className="text-[10px] text-slate-400 hidden xl:inline">({s.detail})</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
