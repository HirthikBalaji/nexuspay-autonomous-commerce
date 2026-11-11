import React from 'react';
import { Sparkles, CheckCircle2, Shield, Layers, FileCode, Clock, ShoppingCart, Search, Terminal } from 'lucide-react';

export default function SponsorBar({ activeTab, onSelectTab }) {
  const sponsors = [
    { id: 'paypal', name: 'PayPal Developer', role: 'Orders v2 & Payouts v1 Rail', tab: 'escrow', color: 'from-blue-600 to-paypal-light', icon: Shield },
    { id: 'aggrid', name: 'AG Grid', role: 'Enterprise Telemetry Grid', tab: 'grid', color: 'from-amber-500 to-yellow-400', icon: Layers },
    { id: 'bryntum', name: 'Bryntum', role: 'Gantt & Milestone Scheduler', tab: 'bryntum', color: 'from-emerald-500 to-teal-400', icon: Clock },
    { id: 'channel3', name: 'Channel3', role: 'AI Agent Commerce Catalog', tab: 'channel3', color: 'from-purple-500 to-indigo-400', icon: ShoppingCart },
    { id: 'elastic', name: 'Elastic', role: 'Vector Search & Anomaly Log', tab: 'elastic', color: 'from-cyan-500 to-sky-400', icon: Search },
    { id: 'apimatic', name: 'APIMatic & Postman', role: 'OpenAPI 3.1 & SDK DevHub', tab: 'devhub', color: 'from-orange-500 to-rose-400', icon: FileCode }
  ];

  return (
    <div className="bg-[#0b101d] border-y border-slate-800/80 py-2.5 px-4 lg:px-8 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-[780px]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
          <Sparkles className="w-4 h-4 text-paypal-cyan" />
          <span>Integrated Sponsor Suite:</span>
        </div>

        <div className="flex items-center gap-3">
          {sponsors.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.tab;
            return (
              <button
                key={s.id}
                onClick={() => onSelectTab(s.tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                  isActive
                    ? 'bg-slate-800 border-paypal-cyan text-white shadow-md shadow-paypal-cyan/20 scale-[1.03]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-1 rounded bg-gradient-to-br ${s.color} text-white`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white leading-none">{s.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{s.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
