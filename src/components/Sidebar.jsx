import React from 'react';
import { 
  Shield, 
  Layers, 
  Clock, 
  ShoppingCart, 
  Search, 
  Terminal, 
  MessageSquare, 
  Scale, 
  LayoutDashboard, 
  AlertOctagon, 
  Settings, 
  FileCode, 
  Wifi, 
  Sparkles,
  ExternalLink,
  Trophy,
  ArrowRight
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  emergencyFreeze, 
  onToggleFreeze, 
  onOpenSettings, 
  onOpenDocs,
  treasury,
  onOpenTour
}) {
  const lifecycleNav = [
    { 
      step: 1, 
      id: 'channel3', 
      label: '1. Discovery Layer', 
      engine: 'Channel3 Catalog', 
      icon: ShoppingCart, 
      badge: 'Discovery', 
      color: 'text-purple-400' 
    },
    { 
      step: 2, 
      id: 'negotiation', 
      label: '2. Negotiation Layer', 
      engine: 'OpenRouter LLM', 
      icon: MessageSquare, 
      badge: 'AI Deliberation', 
      color: 'text-indigo-400' 
    },
    { 
      step: 3, 
      id: 'escrow', 
      label: '3. Settlement Rails', 
      engine: 'PayPal Orders & Vault', 
      icon: LayoutDashboard, 
      badge: 'Escrow Core', 
      color: 'text-sky-400' 
    },
    { 
      step: 4, 
      id: 'bryntum', 
      label: '4. Execution Timeline', 
      engine: 'Bryntum Gantt SDK', 
      icon: Clock, 
      badge: 'Scheduler', 
      color: 'text-emerald-400' 
    },
    { 
      step: 5, 
      id: 'elastic', 
      label: '5. Telemetry Watchdog', 
      engine: 'Elastic 1,536-dim Vectors', 
      icon: Search, 
      badge: 'Anomaly Log', 
      color: 'text-cyan-400' 
    },
    { 
      step: 6, 
      id: 'themis', 
      label: '6. Judicial Arbiter', 
      engine: 'Themis AI Arbitration', 
      icon: Scale, 
      badge: 'PayPal Refunds', 
      color: 'text-rose-400' 
    },
    { 
      step: 7, 
      id: 'grid', 
      label: '7. Treasury Terminal', 
      engine: 'AG Grid Telemetry', 
      icon: Layers, 
      badge: 'Risk Monitor', 
      color: 'text-amber-400' 
    },
  ];

  const developerNav = [
    { 
      id: 'devhub', 
      label: 'Developer Protocol', 
      engine: 'Postman & APIMatic MCP', 
      icon: Terminal, 
      badge: 'OpenAPI', 
      color: 'text-orange-400' 
    }
  ];

  return (
    <aside className="w-64 bg-[#090D18] border-r border-white/[0.07] flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto scrollbar-none z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0070BA] via-[#003087] to-indigo-900 p-[1px] shadow-md shadow-[#0070BA]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#080C16] rounded-[11px] flex items-center justify-center">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 via-white to-blue-200 text-lg">
                  Ψ
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-sans">
                  NEXUS<span className="text-sky-400">PAY</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono">
                PayPal AI Clearinghouse
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-3.5 space-y-5">
          {/* Judge Guided Walkthrough Tour Button */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:brightness-125 transition-all shadow-md shadow-amber-500/10 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Judge Tour (90s)</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                Start
              </span>
            </button>
          )}

          {/* Unified Commerce Lifecycle Pipeline */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Commerce Lifecycle</span>
              <span className="text-[9px] font-mono text-sky-400 font-semibold">7 Subsystems</span>
            </div>
            <div className="space-y-1">
              {lifecycleNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#121B30] text-white border border-sky-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : 'text-slate-400'}`} />
                      <div className="text-left truncate">
                        <div className="leading-snug truncate font-medium">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{item.engine}</div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                      isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Developer Protocol & Ecosystem */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Developer Protocol</span>
              <Sparkles className="w-3 h-3 text-sky-400" />
            </div>
            <div className="space-y-1">
              {developerNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#121B30] text-white border border-sky-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : 'text-slate-400'}`} />
                      <div className="text-left truncate">
                        <div className="leading-snug truncate font-medium">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{item.engine}</div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                      isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="p-3.5 border-t border-white/[0.06] bg-[#070A12]/80 space-y-2.5">
        {/* Emergency Panic Circuit Breaker */}
        <button
          onClick={onToggleFreeze}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            emergencyFreeze
              ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
              : 'bg-rose-950/20 text-rose-400 border border-rose-500/20 hover:bg-rose-900/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{emergencyFreeze ? 'Fleet Frozen' : 'Emergency Freeze'}</span>
          </div>
          <span className="text-[9px] font-mono uppercase bg-black/40 px-1.5 py-0.5 rounded">
            {emergencyFreeze ? 'STOP' : 'HALT'}
          </span>
        </button>

        {/* System Settings & Docs */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onOpenDocs}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>OpenAPI</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-all"
            title="PayPal Sandbox Configuration"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </aside>
  );
}
