import React from 'react';
import { Play, RefreshCw, Cpu, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Header({
  activeTab,
  selectedScenario,
  onSelectScenario,
  onRunNegotiation,
  isNegotiating,
  onRefresh,
  treasury
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'escrow': return 'Autonomous Escrow & Clearinghouse';
      case 'negotiation': return 'Multi-Agent Negotiation Arena';
      case 'themis': return 'Themis AI Arbitration Court';
      case 'grid': return 'AG Grid Enterprise Fleet Telemetry';
      case 'bryntum': return 'Bryntum Milestone Gantt & Scheduler';
      case 'channel3': return 'Channel3 Agentic Commerce Catalog';
      case 'elastic': return 'Elastic Vector Search & Anomaly Log';
      case 'devhub': return 'Postman API Runner & APIMatic DevHub';
      default: return 'NexusPay Platform';
    }
  };

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#090D18]/80 backdrop-blur-xl px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <span>{getTabTitle()}</span>
          <span className="hidden xl:inline-block w-1.5 h-1.5 rounded-full bg-sky-400"></span>
        </h2>
      </div>

      {/* Scenario Switcher Tabs */}
      <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/[0.06]">
        <button
          onClick={() => onSelectScenario('gpu_procurement')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedScenario === 'gpu_procurement'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>GPU Procurement (Clean)</span>
        </button>

        <button
          onClick={() => onSelectScenario('ai_security_audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedScenario === 'ai_security_audit'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Audit (Dispute)</span>
        </button>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Treasury Escrow Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs">
          <span className="text-slate-400 text-[11px]">Escrow Locked:</span>
          <span className="font-mono font-bold text-sky-400">
            {formatCurrency(treasury?.totalEscrowLocked || 4100)}
          </span>
        </div>

        {/* Launch Negotiation CTA */}
        <button
          onClick={onRunNegotiation}
          disabled={isNegotiating}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md ${
            isNegotiating
              ? 'bg-[#0070BA]/50 cursor-wait'
              : 'bg-gradient-to-r from-[#0070BA] to-sky-500 hover:brightness-110 shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.98]'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isNegotiating ? 'animate-spin' : ''}`} />
          <span>{isNegotiating ? 'Negotiating...' : 'Launch Agents'}</span>
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Refresh Data & Balances"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
