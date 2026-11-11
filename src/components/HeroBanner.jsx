import React from 'react';
import { Cpu, ShieldAlert, Sparkles, Play, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ 
  selectedScenario, 
  onSelectScenario, 
  onRunNegotiation, 
  isNegotiating,
  onScrollToGrid 
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0f172a]/90 via-[#0a0f1d] to-[#080C14] border border-slate-800/80 p-6 md:p-8 my-6 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-paypal-light/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-paypal-cyan/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paypal-cyan/10 border border-paypal-cyan/30 text-paypal-cyan text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              PayPal AI Hackathon 2026 • Grand Prize Contender
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              The Trust & Liquidity Protocol for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-paypal-cyan via-sky-400 to-paypal-light">
                Autonomous Agent Economy
              </span>
            </h2>

            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              When AI agents procure servers, hire specialists, and trade data autonomously, giving them open wallets is financial suicide. 
              <strong className="text-white font-medium"> NexusPay</strong> introduces cryptographic spend covenants, real-time agent-to-agent contract negotiation, 
              and <strong className="text-white font-medium">PayPal Milestone Smart Escrow</strong> with sub-second <strong className="text-paypal-cyan font-medium">Themis AI Dispute Arbitration</strong>.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero-Trust Spend Mandates
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-paypal-cyan" />
                PayPal Orders v2 & Payouts API
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                AG Grid Real-time Telemetry
              </span>
            </div>
          </div>

          {/* Quick Launch Control */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onRunNegotiation}
              disabled={isNegotiating}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
                isNegotiating
                  ? 'bg-paypal-light/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-paypal-dark via-paypal-light to-paypal-cyan hover:shadow-paypal-light/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Play className={`w-4 h-4 fill-white ${isNegotiating ? 'animate-spin' : ''}`} />
              {isNegotiating ? 'Agents Negotiating...' : 'Launch Agent Negotiation'}
            </button>

            <button
              onClick={onScrollToGrid}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all"
            >
              <span>Explore AG Grid Live Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Scenario Presets */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Select Live Demonstration Scenario:
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario 1 */}
            <div
              onClick={() => onSelectScenario('gpu_procurement')}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                selectedScenario === 'gpu_procurement'
                  ? 'bg-gradient-to-r from-paypal-dark/30 to-slate-900 border-paypal-cyan shadow-md shadow-paypal-cyan/10'
                  : 'bg-[#0a0f1d] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-paypal-cyan/10 text-paypal-cyan">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Scenario A: H100 GPU Cluster Procurement
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Clean 3-Milestone execution • Verifiable CUDA hashes • PayPal Payout Releases
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  HAPPY PATH
                </span>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => onSelectScenario('ai_security_audit')}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                selectedScenario === 'ai_security_audit'
                  ? 'bg-gradient-to-r from-red-950/20 to-slate-900 border-red-500 shadow-md shadow-red-500/10'
                  : 'bg-[#0a0f1d] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Scenario B: AI Security Red-Teaming Audit
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      SLA latency anomaly (184ms) • Themis AI Arbiter court ruling • PayPal Refund
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                  DISPUTE & ARBITRATION
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
