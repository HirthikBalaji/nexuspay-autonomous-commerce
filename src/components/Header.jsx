import React from 'react';
import { Play, RefreshCw, Cpu, ShieldAlert, Trophy, Radio } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function Header({
  activeTab,
  selectedScenario,
  onSelectScenario,
  onRunNegotiation,
  isNegotiating,
  onRefresh,
  treasury,
  onOpenTour,
  paypalConfig
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

  const isLiveSandbox = paypalConfig?.clientId && !paypalConfig?.simulationMode;

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#090D18]/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <span>{getTabTitle()}</span>
          <span className="hidden xl:inline-block w-1.5 h-1.5 rounded-full bg-sky-400"></span>
        </h2>

        {/* Live PayPal Sandbox Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>PayPal Sandbox: LIVE (APP-6ET35875)</span>
        </div>
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
          <span>GPU (Clean)</span>
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
          <span>Audit (Dispute)</span>
        </button>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Judge Tour Button (Highlight for Hackathon Judges) */}
        <button
          onClick={onOpenTour}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:brightness-125 text-xs font-bold tracking-wide transition-all shadow-md shadow-amber-500/10 hover:scale-[1.02]"
          title="Interactive 90-Second Guided Tour for Hackathon Judges"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Judge Tour</span>
        </button>

        {/* Treasury Escrow Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-xs">
          <span className="text-slate-400 text-[11px]">Vault:</span>
          <span className="font-mono font-bold text-sky-400">
            {formatCurrency(treasury?.totalEscrowLocked || 4100)}
          </span>
        </div>

        {/* Launch Negotiation CTA */}
        <button
          onClick={onRunNegotiation}
          disabled={isNegotiating}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-md ${
            isNegotiating
              ? 'bg-[#0070BA]/50 cursor-wait'
              : 'bg-gradient-to-r from-[#0070BA] to-sky-500 hover:brightness-110 shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.98]'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isNegotiating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isNegotiating ? 'Negotiating...' : 'Launch Agents'}</span>
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
