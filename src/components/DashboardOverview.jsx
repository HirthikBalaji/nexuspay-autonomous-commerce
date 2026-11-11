import React from 'react';
import TreasuryOverview from './TreasuryOverview';
import NegotiationArena from './NegotiationArena';
import EscrowTimeline from './EscrowTimeline';
import ThemisArbiter from './ThemisArbiter';
import AgentTelemetryGrid from './AgentTelemetryGrid';
import { ShieldCheck, Cpu, ShieldAlert, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function DashboardOverview({
  treasury,
  contract,
  deliverables,
  isNegotiating,
  onRunNegotiation,
  onVerifyMilestone,
  onOpenPayPalModal,
  isOrderCaptured,
  onEscalateToArbitration,
  disputeData,
  onRunArbitration,
  arbitrationRuling,
  isArbitrating,
  transactions,
  onRowAction,
  onNavigateToTab,
  selectedScenario,
  onSelectScenario,
  onAddTransaction
}) {
  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <TreasuryOverview treasury={treasury} />

      {/* Two-Column Core Layout: Negotiation (Left) + PayPal Escrow (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Agent Negotiation Arena (7 cols) */}
        <div className="lg:col-span-7">
          <NegotiationArena
            contract={contract}
            isNegotiating={isNegotiating}
            onRunNegotiation={onRunNegotiation}
            onProceedToEscrow={() => document.getElementById('escrow-section')?.scrollIntoView({ behavior: 'smooth' })}
            selectedScenario={selectedScenario}
            onSelectScenario={onSelectScenario}
          />
        </div>

        {/* Right Column: PayPal Smart Escrow Vault (5 cols) */}
        <div className="lg:col-span-5">
          {contract ? (
            <EscrowTimeline
              contract={contract}
              deliverables={deliverables}
              onVerifyMilestone={onVerifyMilestone}
              onOpenPayPalModal={onOpenPayPalModal}
              isOrderCaptured={isOrderCaptured}
              onEscalateToArbitration={onEscalateToArbitration}
            />
          ) : (
            <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 text-center shadow-xl my-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">PayPal Smart Escrow Vault</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5 leading-relaxed">
                Awaiting agreement execution. Launch the agent negotiation to initialize the PayPal Orders v2 escrow lock.
              </p>
              <button
                onClick={() => onRunNegotiation()}
                disabled={isNegotiating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070BA] to-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-500/20 hover:scale-[1.01]"
              >
                Launch Autonomous Agreement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Themis AI Arbiter Court (Slides in on Dispute) */}
      <ThemisArbiter
        contract={contract}
        disputeData={disputeData}
        onRunArbitration={onRunArbitration}
        arbitrationRuling={arbitrationRuling}
        isArbitrating={isArbitrating}
      />

      {/* Enterprise Fleet Telemetry Snippet with Quick Link */}
      <div className="mt-6">
        <AgentTelemetryGrid
          transactions={transactions}
          onRowAction={onRowAction}
          onAddTransaction={onAddTransaction}
        />
      </div>
    </div>
  );
}
