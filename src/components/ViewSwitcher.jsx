import React from 'react';
import { Shield, Layers, Clock, ShoppingCart, Search, Terminal } from 'lucide-react';

export default function ViewSwitcher({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'escrow', label: 'Smart Escrow & Agents', icon: Shield, badge: 'Core' },
    { id: 'grid', label: 'AG Grid Telemetry', icon: Layers, badge: '$5K Prize' },
    { id: 'bryntum', label: 'Bryntum Gantt', icon: Clock, badge: 'Gantt' },
    { id: 'channel3', label: 'Channel3 Catalog', icon: ShoppingCart, badge: 'Commerce' },
    { id: 'elastic', label: 'Elastic Intelligence', icon: Search, badge: 'Search' },
    { id: 'devhub', label: 'Postman & APIMatic', icon: Terminal, badge: 'API Hub' }
  ];

  return (
    <div className="w-full my-5 overflow-x-auto scrollbar-none pb-1">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/[0.07] backdrop-blur-lg w-max sm:w-full justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-1 justify-center ${
                isActive
                  ? 'bg-[#151e33] text-white shadow-md border border-white/10 ring-1 ring-white/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className="font-medium">{tab.label}</span>
              <span className={`text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded-md ${
                isActive 
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
