import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import NegotiationArena from './components/NegotiationArena';
import EscrowTimeline from './components/EscrowTimeline';
import ThemisArbiter from './components/ThemisArbiter';
import AgentTelemetryGrid from './components/AgentTelemetryGrid';
import BryntumGanttView from './components/BryntumGanttView';
import Channel3Catalog from './components/Channel3Catalog';
import ElasticSearchConsole from './components/ElasticSearchConsole';
import PostmanApiRunner from './components/PostmanApiRunner';
import PayPalModal from './components/PayPalModal';
import SettingsDrawer from './components/SettingsDrawer';
import ApiDocsModal from './components/ApiDocsModal';
import JudgeTourModal from './components/JudgeTourModal';
import confetti from 'canvas-confetti';

import { agentService } from './services/agentService';
import { paypalService } from './services/paypalService';

export default function App() {
  const [activeTab, setActiveTab] = useState('escrow');
  const [selectedScenario, setSelectedScenario] = useState('gpu_procurement');
  const [contract, setContract] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [isOrderCaptured, setIsOrderCaptured] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);

  // PayPal Sandbox configuration state
  const [paypalConfig, setPaypalConfig] = useState(null);

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
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [txData, trData, ppConfig] = await Promise.all([
        agentService.getTransactions(),
        agentService.getTreasuryStats(),
        paypalService.getCredentials().catch(() => null)
      ]);
      if (txData?.transactions) setTransactions(txData.transactions);
      if (trData) setTreasury(trData);
      if (ppConfig) setPaypalConfig(ppConfig);
    } catch (err) {
      console.warn('Initial data load warning:', err.message);
    }
  };

  // Launch Multi-Agent Negotiation
  const handleRunNegotiation = async (customTask = null, overrideScenario = null) => {
    setIsNegotiating(true);
    setDisputeData(null);
    setArbitrationRuling(null);
    setIsOrderCaptured(false);

    const scenarioToUse = overrideScenario || selectedScenario;

    try {
      const data = await agentService.negotiate({
        scenarioId: scenarioToUse,
        customTask: customTask
      });
      setContract(data);
      setDeliverables(data.deliverables || []);
      setIsOrderCaptured(true);
      loadInitialData();
    } catch (err) {
      alert('Negotiation failed: ' + err.message);
    } finally {
      setIsNegotiating(false);
    }
  };

  // Channel3 Dispatch: loads item directly into negotiation
  const handleDispatchChannel3Rfq = (item) => {
    setActiveTab('escrow');
    handleRunNegotiation({
      title: item.name,
      budget: item.estimatedContractBudget,
      slaRequirement: item.slaGuarantee
    });
  };

  // Bryntum Milestone Trigger
  const handleBryntumPayout = async (task) => {
    try {
      const res = await paypalService.payoutMilestone({
        senderBatchId: `BATCH_BRYNTUM_${task.id}`,
        receiverEmail: 'billing@aetheria-cloud.ai',
        amount: task.paypalDisbursement,
        currency: 'USD',
        note: `Bryntum Scheduler Release: ${task.name}`
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#0070BA', '#38BDF8']
      });

      alert(`Milestone Payout Dispatched via PayPal Payouts v1! Batch ID: ${res.batch_header?.payout_batch_id || 'PO-BATCH-RELEASED'}`);
      loadInitialData();
    } catch (err) {
      alert('Bryntum payout release error: ' + err.message);
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

      setTimeout(() => {
        document.getElementById('themis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

      return { success: false, status: 'DISPUTE_TRIGGERED' };
    }

    try {
      const res = await agentService.verifyMilestone({
        contractId: contract.contractId,
        milestoneIndex: index + 1,
        deliverable,
        supplierWallet: contract.supplier?.wallet,
        amount: deliverable.amount,
        simulateFailure: false
      });

      if (res.success) {
        const updated = [...deliverables];
        updated[index] = {
          ...updated[index],
          status: 'VERIFIED_RELEASED',
          verificationProof: res.verificationProof,
          payoutDetails: res.payoutResult
        };
        setDeliverables(updated);
        loadInitialData();
      }
      return res;
    } catch (err) {
      alert('Verification or payout failed: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  // Run Themis AI Arbitration Court
  const handleRunArbitration = async () => {
    setIsArbitrating(true);

    try {
      const contractId = contract?.contractId || 'NP-CTR-DISPUTE-DEMO';
      const agreedAmount = contract?.agreedAmount || 1950.00;
      const remainingEscrow = deliverables
        .filter(d => d.status !== 'VERIFIED_RELEASED')
        .reduce((sum, d) => sum + d.amount, 0);

      const ruling = await agentService.arbitrate({
        contractId: contractId,
        disputeReason: disputeData?.reason || 'SLA Latency Violation',
        agreedAmount: agreedAmount,
        totalEscrowRemaining: remainingEscrow || agreedAmount * 0.75,
        captureId: contract?.paypalOrder?.id || 'CAP-8921-DEMO',
        breachEvidence: {
          observedLatency: 184.2,
          ceilingLatency: 35.0,
          droppedBatches: 4
        }
      });

      setArbitrationRuling(ruling);

      const updated = deliverables.length > 0
        ? deliverables.map(d => ({
            ...d,
            status: d.status === 'VERIFIED_RELEASED' ? 'VERIFIED_RELEASED' : 'ARBITRATED_SETTLED'
          }))
        : [
            { id: 'M1', name: 'Milestone 1: Attack Reconnaissance', status: 'VERIFIED_RELEASED', amount: 585.00 },
            { id: 'M2', name: 'Milestone 2: Payload Fuzzing (Breached)', status: 'ARBITRATED_SETTLED', amount: 780.00 },
            { id: 'M3', name: 'Milestone 3: Executive Remediation', status: 'ARBITRATED_SETTLED', amount: 585.00 }
          ];
      setDeliverables(updated);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#F43F5E', '#0070BA', '#38BDF8', '#10B981']
      });

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
      loadInitialData();
    } catch (err) {
      console.warn('Capture notice:', err.message);
      setIsOrderCaptured(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C16] text-slate-100 flex font-sans antialiased">
      {/* Sleek Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        emergencyFreeze={emergencyFreeze}
        onToggleFreeze={handleToggleFreeze}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        treasury={treasury}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Workspace Top Header */}
        <Header
          activeTab={activeTab}
          selectedScenario={selectedScenario}
          onSelectScenario={handleSelectScenario}
          onRunNegotiation={() => handleRunNegotiation()}
          isNegotiating={isNegotiating}
          onRefresh={loadInitialData}
          treasury={treasury}
          onOpenTour={() => setIsTourOpen(true)}
        />

        {/* View Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: Core Dashboard & Escrow */}
          {activeTab === 'escrow' && (
            <DashboardOverview
              treasury={treasury}
              contract={contract}
              deliverables={deliverables}
              isNegotiating={isNegotiating}
              onRunNegotiation={handleRunNegotiation}
              onVerifyMilestone={handleVerifyMilestone}
              onOpenPayPalModal={() => setIsPayPalModalOpen(true)}
              isOrderCaptured={isOrderCaptured}
              onEscalateToArbitration={() => {
                setActiveTab('themis');
              }}
              disputeData={disputeData}
              onRunArbitration={handleRunArbitration}
              arbitrationRuling={arbitrationRuling}
              isArbitrating={isArbitrating}
              transactions={transactions}
              onRowAction={handleRowAction}
              onNavigateToTab={setActiveTab}
              selectedScenario={selectedScenario}
              onSelectScenario={handleSelectScenario}
              onAddTransaction={(newTxn) => setTransactions(prev => [newTxn, ...prev])}
            />
          )}

          {/* TAB 2: Focused Multi-Agent Negotiation Arena */}
          {activeTab === 'negotiation' && (
            <div className="space-y-5 animate-fade-in">
              <NegotiationArena
                contract={contract}
                isNegotiating={isNegotiating}
                onRunNegotiation={handleRunNegotiation}
                onProceedToEscrow={() => setActiveTab('escrow')}
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
              />
            </div>
          )}

          {/* TAB 3: Focused Themis AI Arbitration Court */}
          {activeTab === 'themis' && (
            <div className="space-y-5 animate-fade-in">
              <ThemisArbiter
                contract={contract}
                disputeData={disputeData || {
                  milestoneIndex: 2,
                  reason: 'SLA Latency Violation: 184.2ms exceeded 35ms ceiling (Contract clause 4.2)'
                }}
                onRunArbitration={handleRunArbitration}
                arbitrationRuling={arbitrationRuling}
                isArbitrating={isArbitrating}
              />
            </div>
          )}

          {/* TAB 4: AG Grid Fleet Telemetry */}
          {activeTab === 'grid' && (
            <div className="space-y-4 animate-fade-in">
              <AgentTelemetryGrid
                transactions={transactions}
                onRowAction={handleRowAction}
                onAddTransaction={(newTxn) => setTransactions(prev => [newTxn, ...prev])}
              />
            </div>
          )}

          {/* TAB 5: Bryntum Milestone Gantt */}
          {activeTab === 'bryntum' && (
            <div className="animate-fade-in">
              <BryntumGanttView 
                onTriggerMilestonePayout={handleBryntumPayout} 
                onNavigateToArbitration={() => setActiveTab('themis')}
              />
            </div>
          )}

          {/* TAB 6: Channel3 Commerce Catalog */}
          {activeTab === 'channel3' && (
            <div className="animate-fade-in">
              <Channel3Catalog onDispatchRfq={handleDispatchChannel3Rfq} />
            </div>
          )}

          {/* TAB 7: Elastic Search Intelligence */}
          {activeTab === 'elastic' && (
            <div className="animate-fade-in">
              <ElasticSearchConsole />
            </div>
          )}

          {/* TAB 8: Postman & APIMatic DevHub */}
          {activeTab === 'devhub' && (
            <div className="animate-fade-in">
              <PostmanApiRunner />
            </div>
          )}
        </main>

        {/* Minimalist Footer */}
        <footer className="border-t border-white/[0.04] bg-[#070A12] py-4 px-6 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">NEXUSPAY</span>
            <span>•</span>
            <span>Autonomous Agent Commerce on PayPal Developer Platform</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>PayPal Orders v2 & Payouts</span>
            <span>•</span>
            <span>AG Grid</span>
            <span>•</span>
            <span>Bryntum</span>
            <span>•</span>
            <span>Channel3</span>
            <span>•</span>
            <span>Elastic</span>
            <span>•</span>
            <span>Postman</span>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <PayPalModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        contract={contract}
        onApproveEscrow={handleApproveEscrow}
        paypalClientId={paypalConfig?.clientId}
      />

      <JudgeTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRunNegotiation={handleRunNegotiation}
        onOpenPayPalModal={() => setIsPayPalModalOpen(true)}
        onVerifyMilestone={handleVerifyMilestone}
        onEscalateToArbitration={() => setActiveTab('themis')}
        onRunArbitration={handleRunArbitration}
        deliverables={deliverables}
        contract={contract}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ApiDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
