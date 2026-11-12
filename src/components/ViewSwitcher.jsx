import React from 'react';
import { 
  ShoppingCart, 
  MessageSquare, 
  Shield, 
  Clock, 
  Search, 
  Scale, 
  Layers, 
  Terminal 
} from 'lucide-react';

export default function ViewSwitcher({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'channel3', label: '1. Discovery', engine: 'Channel3', icon: ShoppingCart },
    { id: 'negotiation', label: '2. Negotiation', engine: 'LLM Agents', icon: MessageSquare },
    { id: 'escrow', label: '3. Settlement', engine: 'PayPal Vault', icon: Shield },
    { id: 'bryntum', label: '4. Execution', engine: 'Bryntum Gantt', icon: Clock },
    { id: 'elastic', label: '5. Watchdog', engine: 'Elastic kNN', icon: Search },
    { id: 'themis', label: '6. Arbiter', engine: 'Themis AI', icon: Scale },
    { id: 'grid', label: '7. Treasury', engine: 'AG Grid', icon: Layers },
    { id: 'devhub', label: 'DevHub', engine: 'OpenAPI', icon: Terminal }
  ];

  return (
    <div className="w-full my-4 overflow-x-auto scrollbar-none pb-1">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/[0.07] backdrop-blur-lg w-max sm:w-full justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-1 justify-center ${
                isActive
                  ? 'bg-[#151e33] text-white shadow-md border border-sky-500/30 ring-1 ring-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{tab.label}</span>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                  isActive 
                    ? 'bg-sky-500/20 text-sky-300' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {tab.engine}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
