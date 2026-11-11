import React from 'react';
import { Shield, Zap, Lock, Terminal, FileCode, Settings, AlertOctagon, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Navbar({ 
  treasury, 
  onOpenSettings, 
  onOpenDocs, 
  emergencyFreeze, 
  onToggleFreeze, 
  onRefresh 
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#080C16]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0070BA] via-[#003087] to-[#1E293B] p-[1px] shadow-sm shadow-[#0070BA]/30">
            <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 via-white to-blue-200 text-base leading-none">
                Ψ
              </span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#080C16]"></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-white font-sans">
              NEXUS<span className="text-sky-400">PAY</span>
            </span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Agentic Escrow
            </span>
          </div>
        </div>

        {/* Center Live System Signals (Discrete & Elegant) */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/60 border border-white/[0.06] px-3.5 py-1.5 rounded-full text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">PayPal:</span>
            <span className="font-mono text-slate-200 font-medium">Orders v2</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span className="text-slate-400">Arbiter:</span>
            <span className="font-mono text-slate-200 font-medium">Themis AI</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-400">Telemetry:</span>
            <span className="font-mono text-slate-200 font-medium">AG Grid v36</span>
          </div>
        </div>

        {/* Live Treasury & Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Treasury Escrow Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs">
            <span className="text-slate-400 text-[11px]">Escrow:</span>
            <span className="font-mono font-bold text-sky-400">
              {formatCurrency(treasury?.totalEscrowLocked || 4100)}
            </span>
          </div>

          {/* Emergency Panic Freeze */}
          <button
            onClick={onToggleFreeze}
            title={emergencyFreeze ? "Emergency freeze active! Click to unfreeze fleet." : "Emergency Freeze: Pause all autonomous agent spending"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              emergencyFreeze 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 animate-pulse' 
                : 'bg-slate-900/80 text-rose-400 border border-rose-500/30 hover:bg-rose-950/40 hover:border-rose-500/50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{emergencyFreeze ? 'Fleet Frozen' : 'Panic Freeze'}</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Data & Balances"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* OpenAPI / APIMatic Specs */}
          <button
            onClick={onOpenDocs}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>API Docs</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Configure PayPal Credentials & Webhooks"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>

      </div>
    </header>
  );
}
