import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TreasuryOverview from './components/TreasuryOverview';
import NegotiationArena from './components/NegotiationArena';
import EscrowTimeline from './components/EscrowTimeline';
import ThemisArbiter from './components/ThemisArbiter';
import AgentTelemetryGrid from './components/AgentTelemetryGrid';
import PayPalModal from './components/PayPalModal';
import SettingsDrawer from './components/SettingsDrawer';
import ApiDocsModal from './components/ApiDocsModal';

import { agentService } from './services/agentService';
import { paypalService } from './services/paypalService';

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState('gpu_procurement');
  const [contract, setContract] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [isOrderCaptured, setIsOrderCaptured] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Dispute & Arbitration state
  const [disputeData, setDisputeData] = useState(null);
  const [arbitrationRuling, setArbitrationRuling] = useState(null);
  const [isArbitrating, setIsArbitrating] = useState(false);

  // AG Grid & Treasury state
  const [transactions, setTransactions] = useState([]);
  const [treasury, setTreasury] = useState(null);
  const [emergencyFreeze, setEmergencyFreeze] = useState(false);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [txData, trData] = await Promise.all([
        agentService.getTransactions(),
        agentService.getTreasuryStats()
      ]);
      if (txData?.transactions) setTransactions(txData.transactions);
      if (trData) setTreasury(trData);
    } catch (err) {
      console.warn('Initial data load warning:', err.message);
    }
  };

  // Launch Multi-Agent Negotiation
  const handleRunNegotiation = async () => {
    setIsNegotiating(true);
    setDisputeData(null);
    setArbitrationRuling(null);
    setIsOrderCaptured(false);

    try {
      const data = await agentService.negotiate({ scenarioId: selectedScenario });
      setContract(data);
      setDeliverables(data.deliverables || []);
      
      // Auto-capture order for immediate smooth demonstration
      setIsOrderCaptured(true);
    } catch (err) {
      alert('Negotiation failed: ' + err.message);
    } finally {
      setIsNegotiating(false);
    }
  };

  // Switch scenario preset
  const handleSelectScenario = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setContract(null);
    setDeliverables([]);
    setDisputeData(null);
    setArbitrationRuling(null);
    setIsOrderCaptured(false);
  };

  // Milestone Verification & PayPal Payout Release
  const handleVerifyMilestone = async (index, deliverable, simulateFailure) => {
    if (!contract) return;

    if (simulateFailure) {
      // Mark milestone as disputed
      const updated = [...deliverables];
      updated[index] = {
        ...updated[index],
        status: 'DISPUTED'
      };
      setDeliverables(updated);
      setDisputeData({
        milestoneIndex: index + 1,
        deliverable,
        reason: 'CRITICAL_SLA_BREACH: API Latency exceeded 35ms ceiling (184ms recorded)'
      });

      // Scroll smoothly to Themis court section
      setTimeout(() => {
        document.getElementById('themis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

      return { success: false, disputeTriggered: true };
    }

    try {
      const res = await agentService.verifyMilestone({
        contractId: contract.contractId,
        milestoneIndex: index + 1,
        deliverable,
        supplierWallet: contract.supplier?.wallet || 'billing@aetheria-cloud.ai',
        amount: deliverable.amount,
        simulateFailure: false
      });

      if (res?.success) {
        const updated = [...deliverables];
        updated[index] = {
          ...updated[index],
          status: 'VERIFIED_RELEASED',
          verificationProof: res.verificationProof,
          payoutDetails: res.payoutResult
        };
        setDeliverables(updated);

        // Refresh treasury & telemetry
        loadInitialData();
        return res;
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    }
  };

  // Run Themis AI Arbitration Court
  const handleRunArbitration = async () => {
    if (!contract) return;
    setIsArbitrating(true);

    try {
      const remainingEscrow = deliverables
        .filter(d => d.status !== 'VERIFIED_RELEASED')
        .reduce((sum, d) => sum + d.amount, 0);

      const ruling = await agentService.arbitrate({
        contractId: contract.contractId,
        disputeReason: disputeData?.reason || 'SLA Latency Violation',
        agreedAmount: contract.agreedAmount,
        totalEscrowRemaining: remainingEscrow || contract.agreedAmount * 0.75,
        captureId: contract.paypalOrder?.id || 'CAP-8921-DEMO'
      });

      setArbitrationRuling(ruling);

      // Update deliverables status
      const updated = deliverables.map(d => ({
        ...d,
        status: d.status === 'VERIFIED_RELEASED' ? 'VERIFIED_RELEASED' : 'ARBITRATED_SETTLED'
      }));
      setDeliverables(updated);

      // Refresh telemetry
      loadInitialData();
    } catch (err) {
      alert('Arbitration failed: ' + err.message);
    } finally {
      setIsArbitrating(false);
    }
  };

  // Row Action handler for AG Grid (Freeze / Release)
  const handleRowAction = async (transactionId, action) => {
    try {
      await agentService.triggerTelemetryAction(transactionId, action);
      loadInitialData();
    } catch (err) {
      alert('Failed to execute row action: ' + err.message);
    }
  };

  // Emergency Panic Freeze
  const handleToggleFreeze = () => {
    const newState = !emergencyFreeze;
    setEmergencyFreeze(newState);
    if (newState) {
      // Pause all active agents in grid
      setTransactions(prev => prev.map(t => ({
        ...t,
        agentStatus: 'FROZEN',
        riskScore: Math.max(t.riskScore, 85)
      })));
    } else {
      loadInitialData();
    }
  };

  // Approve PayPal Escrow deposit
  const handleApproveEscrow = async (orderId) => {
    try {
      await paypalService.captureOrder(orderId);
      setIsOrderCaptured(true);
    } catch (err) {
      console.warn('Capture warning:', err.message);
      setIsOrderCaptured(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        treasury={treasury}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        emergencyFreeze={emergencyFreeze}
        onToggleFreeze={handleToggleFreeze}
        onRefresh={loadInitialData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-4">
        {/* Hero Banner & Scenario Switcher */}
        <HeroBanner
          selectedScenario={selectedScenario}
          onSelectScenario={handleSelectScenario}
          onRunNegotiation={handleRunNegotiation}
          isNegotiating={isNegotiating}
          onScrollToGrid={() => document.getElementById('telemetry-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* Global Treasury Overview */}
        <TreasuryOverview treasury={treasury} />

        {/* Multi-Agent Negotiation Arena */}
        <NegotiationArena
          contract={contract}
          isNegotiating={isNegotiating}
          onRunNegotiation={handleRunNegotiation}
          onProceedToEscrow={() => document.getElementById('escrow-section')?.scrollIntoView({ behavior: 'smooth' })}
        />

        {/* PayPal Smart Escrow & Milestone Progression */}
        {contract && (
          <EscrowTimeline
            contract={contract}
            deliverables={deliverables}
            onVerifyMilestone={handleVerifyMilestone}
            onOpenPayPalModal={() => setIsPayPalModalOpen(true)}
            isOrderCaptured={isOrderCaptured}
            onEscalateToArbitration={() => document.getElementById('themis-section')?.scrollIntoView({ behavior: 'smooth' })}
          />
        )}

        {/* Themis AI Autonomous Arbitration Court (Appears on SLA breach) */}
        <ThemisArbiter
          contract={contract}
          disputeData={disputeData}
          onRunArbitration={handleRunArbitration}
          arbitrationRuling={arbitrationRuling}
          isArbitrating={isArbitrating}
        />

        {/* Enterprise AG Grid Fleet Telemetry */}
        <AgentTelemetryGrid
          transactions={transactions}
          onRowAction={handleRowAction}
        />
      </main>

      {/* Modals & Drawers */}
      <PayPalModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        contract={contract}
        onApproveEscrow={handleApproveEscrow}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ApiDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#080C14] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">NEXUSPAY</span>
            <span>•</span>
            <span>Built for the PayPal AI Global Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PayPal Developer Rails</span>
            <span>•</span>
            <span>AG Grid Enterprise</span>
            <span>•</span>
            <span>APIMatic Ready</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
