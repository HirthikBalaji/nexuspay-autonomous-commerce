import React from 'react';
import { Shield, Layers, Clock, ShoppingCart, Search, Terminal } from 'lucide-react';

export default function ViewSwitcher({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'escrow', label: 'PayPal Smart Escrow & Agents', icon: Shield, badge: 'Core' },
    { id: 'grid', label: 'AG Grid Fleet Telemetry', icon: Layers, badge: '$5K Prize' },
    { id: 'bryntum', label: 'Bryntum Milestone Gantt', icon: Clock, badge: 'Scheduler' },
    { id: 'channel3', label: 'Channel3 Commerce Catalog', icon: ShoppingCart, badge: 'Catalog' },
    { id: 'elastic', label: 'Elastic Intelligence & Logs', icon: Search, badge: 'Search' },
    { id: 'devhub', label: 'Postman & APIMatic DevHub', icon: Terminal, badge: 'API Runner' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 my-4 scrollbar-none border-b border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-gradient-to-r from-paypal-dark to-slate-900 border-paypal-cyan text-white shadow-lg shadow-paypal-cyan/10 scale-[1.02]'
                : 'bg-[#0D1424] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-paypal-cyan' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
              isActive ? 'bg-paypal-cyan/20 text-paypal-cyan' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
}
