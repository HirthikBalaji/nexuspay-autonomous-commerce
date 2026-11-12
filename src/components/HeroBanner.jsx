import React from 'react';
import { Cpu, ShieldAlert, Sparkles, Play, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function HeroBanner({ 
  selectedScenario, 
  onSelectScenario, 
  onRunNegotiation, 
  isNegotiating,
  onScrollToGrid 
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A]/90 via-[#0C1222] to-[#080C16] border border-white/[0.08] p-6 sm:p-8 my-5 shadow-2xl">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0070BA]/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PayPal AI Hackathon 2026 • Grand Prize Architecture</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight leading-[1.15]">
              The Trust & Liquidity Protocol for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-[#0070BA]">
                Autonomous Agent Economy
              </span>
            </h2>

            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              When AI agents procure servers, hire specialists, and trade data autonomously, giving them open wallets is financial suicide. 
              <strong className="text-white font-medium"> NexusPay</strong> establishes cryptographic spend covenants, real-time agent contract negotiation, 
              and <strong className="text-white font-medium">PayPal Milestone Smart Escrow</strong> with sub-second <strong className="text-sky-400 font-medium">Themis AI Dispute Arbitration</strong>.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>7-Subsystem Machine: Discovery (Channel3) • Negotiation (OpenRouter LLM) • Settlement (PayPal Vault) • Execution (Bryntum) • Watchdog (Elastic) • Arbiter (Themis) • Treasury (AG Grid)</span>
              </span>
            </div>
          </div>

          {/* Quick Launch Control */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onRunNegotiation}
              disabled={isNegotiating}
              className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all shadow-lg ${
                isNegotiating
                  ? 'bg-[#0070BA]/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0070BA] to-sky-500 hover:brightness-110 shadow-[#0070BA]/30 hover:scale-[1.01] active:scale-[0.98]'
              }`}
            >
              <Play className={`w-4 h-4 fill-white ${isNegotiating ? 'animate-spin' : ''}`} />
              <span>{isNegotiating ? 'Agents Negotiating...' : 'Launch Agent Negotiation'}</span>
            </button>

            <button
              onClick={onScrollToGrid}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium bg-slate-900/80 text-slate-300 border border-white/[0.08] hover:bg-slate-800 hover:text-white transition-all"
            >
              <span>Explore AG Grid Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Scenario Presets */}
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Select Live Demonstration Scenario:
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Scenario 1 */}
            <div
              onClick={() => onSelectScenario('gpu_procurement')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all duration-150 ${
                selectedScenario === 'gpu_procurement'
                  ? 'bg-[#0D1528] border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/20'
                  : 'bg-slate-900/50 border-white/[0.06] hover:border-white/20 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${selectedScenario === 'gpu_procurement' ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Scenario A: H100 GPU Cluster Procurement
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Clean 3-Milestone execution • Verifiable CUDA hashes • PayPal Payout Releases
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Clean Settlement
                </span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => onSelectScenario('ai_security_audit')}
              className={`cursor-pointer p-4 rounded-2xl border transition-all duration-150 ${
                selectedScenario === 'ai_security_audit'
                  ? 'bg-[#181122] border-rose-500/60 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/20'
                  : 'bg-slate-900/50 border-white/[0.06] hover:border-white/20 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${selectedScenario === 'ai_security_audit' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Scenario B: AI Security Red-Teaming Audit
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      SLA latency anomaly (184ms) • Themis AI Arbiter court ruling • PayPal Refund
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0">
                  Dispute & Arbitration
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
