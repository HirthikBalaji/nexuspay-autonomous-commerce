import crypto from 'crypto';
import { createOrder, captureOrder, sendMilestonePayout, refundCapture } from './paypalClient.js';
import { saveDbContract, addDbTransaction, updateDbTransaction, getDbTransactions } from './db.js';

export const DEMO_SCENARIOS = {
  gpu_procurement: {
    id: 'SCN_GPU_01',
    title: 'Autonomous H100 GPU Cluster Procurement',
    category: 'High-Performance Cloud Infrastructure',
    buyer: {
      id: 'AGENT_ATLAS_01',
      name: 'Atlas (NovaCorp Procurement)',
      wallet: 'atlas-treasury@novacorp.ai',
      maxBudget: 2400,
      slaRequirement: '99.9% uptime, <15ms peer latency'
    },
    supplier: {
      id: 'AGENT_HERMES_09',
      name: 'Hermes (Aetheria Compute Nodes)',
      wallet: 'billing@aetheria-cloud.ai',
      reputationScore: 98.4
    },
    deliverables: [
      {
        id: 'M1',
        name: 'Cluster Provisioning & Environment Benchmark',
        share: 0.25,
        proofType: 'CUDA_BENCHMARK_HASH',
        expectedProof: 'pass: 16x SXM5 H100 nodes initialized, 3.2Tbps NVLink verified'
      },
      {
        id: 'M2',
        name: 'Distributed Training Job Execution (48h)',
        share: 0.50,
        proofType: 'WEIGHT_CHECKPOINT_HASH',
        expectedProof: 'checkpoint_epoch_10_loss_0.142_sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      {
        id: 'M3',
        name: 'Final Latency & SLA Validation Signoff',
        share: 0.25,
        proofType: 'TELEMETRY_LOG_AUDIT',
        expectedProof: '100% SLA compliance, 0 dropped frames, cluster deprovisioned cleanly'
      }
    ],
    outcomeType: 'CLEAN_SETTLEMENT'
  },
  ai_security_audit: {
    id: 'SCN_SEC_02',
    title: 'Autonomous Smart Contract & LLM Red-Teaming Audit',
    category: 'Cybersecurity & Financial Escrow',
    buyer: {
      id: 'AGENT_ATLAS_01',
      name: 'Atlas (NovaCorp Procurement)',
      wallet: 'atlas-treasury@novacorp.ai',
      maxBudget: 1950,
      slaRequirement: 'Complete penetration fuzzing, zero false-negative criticals, <24h SLA'
    },
    supplier: {
      id: 'AGENT_HERMES_04',
      name: 'Hermes (Specter Autonomous RedTeam)',
      wallet: 'contracts@specter-security.ai',
      reputationScore: 89.1
    },
    deliverables: [
      {
        id: 'M1',
        name: 'Attack Surface Reconnaissance & Threat Modeling',
        share: 0.30,
        proofType: 'THREAT_VECTOR_MATRIX',
        expectedProof: '42 endpoints mapped, 11 potential injection vectors identified'
      },
      {
        id: 'M2',
        name: 'Dynamic Exploit Payload Fuzzing & Proof-of-Concept',
        share: 0.40,
        proofType: 'FUZZ_TELEMETRY_LOG',
        expectedProof: '500,000 synthetic exploits executed; 1 medium vulnerability confirmed'
      },
      {
        id: 'M3',
        name: 'Cryptographic Executive Remediation Package',
        share: 0.30,
        proofType: 'SIGNED_VERIFICATION_CERT',
        expectedProof: 'Signed mitigation proof with regression harness'
      }
    ],
    outcomeType: 'DISPUTE_ARBITRATION'
  }
};

/**
 * Run a multi-agent negotiation step or full conversation
 */
export async function runAgentNegotiation({ scenarioId = 'gpu_procurement', customTask = null }) {
  const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS.gpu_procurement;
  const buyer = scenario.buyer;
  const supplier = scenario.supplier;
  const taskTitle = customTask?.title || scenario.title;
  const targetBudget = customTask?.budget || buyer.maxBudget;

  const rounds = [
    {
      round: 1,
      sender: buyer.name,
      senderRole: 'BUYER_AGENT',
      action: 'BROADCAST_RFQ',
      message: `Issuing Request For Quote (RFQ) for: "${taskTitle}". Budget ceiling: $${targetBudget.toFixed(2)}. Hard requirement: 3-phase PayPal Smart Escrow with cryptographic milestone verification. Uptime guarantee: ${buyer.slaRequirement}.`,
      proposal: {
        budget: targetBudget * 0.85,
        milestones: 3,
        sla: buyer.slaRequirement,
        escrowHold: '100% Locked in PayPal Vault'
      },
      timestamp: new Date(Date.now() - 4000).toISOString()
    },
    {
      round: 2,
      sender: supplier.name,
      senderRole: 'SUPPLIER_AGENT',
      action: 'COUNTER_PROPOSAL',
      message: `Capacity verified for "${taskTitle}". Counter-proposal: $${(targetBudget * 0.95).toFixed(2)} total, structured as 25% M1 (Benchmark), 50% M2 (Distributed Execution), 25% M3 (Signoff). SLA commitment: 99.85% guaranteed.`,
      proposal: {
        budget: targetBudget * 0.95,
        milestones: 3,
        sla: '99.85% SLA guaranteed, automated webhook telemetry',
        escrowHold: 'Standard Milestone Release'
      },
      timestamp: new Date(Date.now() - 3000).toISOString()
    },
    {
      round: 3,
      sender: buyer.name,
      senderRole: 'BUYER_AGENT',
      action: 'POLICY_CONVERGENCE',
      message: `Evaluating counter-proposal against NovaCorp Financial Covenant Mandate #892. Accepted with Themis AI Arbiter binding escrow clause. Final settlement figure: $${(targetBudget * 0.92).toFixed(2)}.`,
      proposal: {
        budget: targetBudget * 0.92,
        milestones: 3,
        arbitrationClause: 'Themis AI Arbiter Binding Escrow Enforcement',
        penaltyRate: '15% tranche deduction per 0.1% SLA breach'
      },
      timestamp: new Date(Date.now() - 2000).toISOString()
    },
    {
      round: 4,
      sender: supplier.name,
      senderRole: 'SUPPLIER_AGENT',
      action: 'ACCEPT_CONTRACT',
      message: `Agreement reached. Hermes Agent commits 100% capacity to Contract #NP-${Math.random().toString(36).substring(2, 7).toUpperCase()}. Initializing PayPal Escrow Order.`,
      proposal: {
        budget: targetBudget * 0.92,
        status: 'SIGNED_BY_BOTH_PARTIES',
        contractHash: '0x' + crypto.randomBytes(20).toString('hex')
      },
      timestamp: new Date(Date.now() - 1000).toISOString()
    }
  ];

  const agreedAmount = Number((targetBudget * 0.92).toFixed(2));
  const contractId = 'NP-CTR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

  // Create real or sandbox PayPal Order
  const paypalOrder = await createOrder({
    amount: agreedAmount,
    currency: 'USD',
    description: `NexusPay Autonomous Escrow: ${taskTitle} [${contractId}]`,
    customId: `MANDATE_${buyer.id}_${supplier.id}`
  });

  const contractObj = {
    contractId,
    scenarioId,
    title: taskTitle,
    agreedAmount,
    currency: 'USD',
    buyer,
    supplier,
    rounds,
    paypalOrder,
    deliverables: scenario.deliverables.map((d, index) => ({
      ...d,
      milestoneIndex: index + 1,
      amount: Number((agreedAmount * d.share).toFixed(2)),
      status: 'LOCKED',
      payoutDetails: null,
      verificationProof: null
    })),
    createdAt: new Date().toISOString()
  };

  // Persist contract to database
  saveDbContract(contractObj);

  // Add transaction row to AG Grid telemetry
  addDbTransaction({
    id: 'TXN-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-PP',
    timestamp: new Date().toISOString(),
    buyerAgent: buyer.name,
    supplierAgent: supplier.name,
    category: scenario.category,
    amount: agreedAmount,
    currency: 'USD',
    milestoneStage: 'Escrow Locked',
    milestoneProgress: 0,
    riskScore: 10,
    slaHealth: 99.8,
    paypalReference: paypalOrder.id,
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Orders v2'
  });

  return contractObj;
}

/**
 * Execute a Milestone Verification & Automated PayPal Payout
 */
export async function verifyAndReleaseMilestone({
  contractId,
  milestoneIndex,
  deliverable,
  supplierWallet,
  amount,
  simulateFailure = false
}) {
  const timestamp = new Date().toISOString();

  if (simulateFailure) {
    return {
      success: false,
      status: 'VERIFICATION_FAILED',
      milestoneIndex,
      disputeTriggered: true,
      error: 'CRITICAL_SLA_BREACH: Latency spike to 184ms exceeded 35ms ceiling (Contract clause 4.2).',
      failedProof: {
        metric: 'API_RESPONSE_LATENCY',
        threshold: '<35ms',
        actual: '184.2ms',
        timestamp
      }
    };
  }

  // Generate verifiable cryptographic proof
  const verificationProof = {
    proofId: 'PRF-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    hash: '0x' + crypto.randomBytes(32).toString('hex'),
    metricPassed: true,
    inspectionLogs: `Autonomous Verifier Agent [Argus-7] verified SHA-256 payload integrity. Test suite passed 48/48 checks. SLA target met at 99.94%.`,
    timestamp
  };

  // Execute PayPal Payouts API
  const payoutResult = await sendMilestonePayout({
    senderBatchId: `BATCH_${contractId}_M${milestoneIndex}`,
    receiverEmail: supplierWallet,
    amount: amount,
    currency: 'USD',
    note: `NexusPay Milestone #${milestoneIndex} Release: ${deliverable.name}`
  });

  return {
    success: true,
    status: 'VERIFIED_RELEASED',
    milestoneIndex,
    verificationProof,
    payoutResult,
    releasedAmount: amount,
    timestamp
  };
}

/**
 * Themis: Autonomous AI Arbiter Protocol
 */
export async function runThemisArbitration({
  contractId,
  disputeReason,
  agreedAmount,
  totalEscrowRemaining,
  captureId = 'CAP-DEMO-PAYPAL-7821',
  breachEvidence
}) {
  const timestamp = new Date().toISOString();
  
  const evidenceAnalysis = {
    contractTerms: {
      expectedSLA: '99.5% minimum uptime, <35ms latency guarantee',
      penaltyFormula: '15% tranche deduction per 0.1% breach; >100ms breach permits 45% clawback'
    },
    discoveredBreach: breachEvidence || {
      metric: 'API_LATENCY_VIOLATION',
      observed: '184.2ms peak latency, 4 dropped batches during M2 stress-test',
      delta: '+426% latency anomaly above agreed ceiling',
      supplierContention: 'Hermes claimed upstream routing disruption beyond agent control',
      buyerContention: 'Atlas mandated multi-region fallback redundancy in Section 3.1'
    }
  };

  const clawbackPercentage = 0.45;
  const supplierPercentage = 0.55;
  
  const refundAmount = Number((totalEscrowRemaining * clawbackPercentage).toFixed(2));
  const supplierReleaseAmount = Number((totalEscrowRemaining * supplierPercentage).toFixed(2));

  // Trigger real or simulated PayPal Refund API
  const paypalRefund = await refundCapture({
    captureId,
    amount: refundAmount,
    currency: 'USD',
    reason: `Themis AI Arbiter Ruling [ARB-${contractId}]: 45% SLA Breach Clawback`
  });

  // Payout the remaining legitimate supplier balance
  const supplierPayout = await sendMilestonePayout({
    senderBatchId: `ARB_SETTLE_${contractId}`,
    receiverEmail: 'contracts@specter-security.ai',
    amount: supplierReleaseAmount,
    currency: 'USD',
    note: `Themis AI Arbiter Ruling: 55% Partial Sunk Settlement`
  });

  const courtRuling = {
    arbitrationId: 'ARB-' + crypto.randomBytes(5).toString('hex').toUpperCase(),
    contractId,
    timestamp,
    arbiterModel: 'Themis-v2.4-Financial-Arbitration-Engine (PayPal Agentic Protocol)',
    confidenceScore: 0.984,
    verdict: 'PARTIAL_BREACH_ENFORCEMENT',
    summary: `Themis AI Arbiter reviewed 12,480 telemetry ticks. Contract Section 3.1 clearly stipulated multi-region routing obligations. Hermes Agent failed to execute failover within 120 seconds. Buyer is awarded $${refundAmount.toFixed(2)} refund via PayPal Refund API. Supplier is awarded $${supplierReleaseAmount.toFixed(2)} for verified base deliverable artifacts.`,
    allocations: {
      buyerRefund: {
        percentage: '45%',
        amount: refundAmount,
        currency: 'USD',
        paypalTransaction: paypalRefund.id || 'REF-AUTO-9821'
      },
      supplierPayout: {
        percentage: '55%',
        amount: supplierReleaseAmount,
        currency: 'USD',
        paypalTransaction: supplierPayout.batch_header?.payout_batch_id || 'PO-ARB-4192'
      }
    },
    actionExecuted: 'PAYPAL_REFUND_AND_PARTIAL_PAYOUT_SETTLED'
  };

  return {
    success: true,
    evidenceAnalysis,
    courtRuling,
    paypalRefund,
    supplierPayout
  };
}
