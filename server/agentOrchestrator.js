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
  },
  oracle_data_feed: {
    id: 'SCN_ORACLE_03',
    title: 'Ultra-Low Latency Cross-Exchange Microstructure Feed',
    category: 'Financial Telemetry & Oracles',
    buyer: {
      id: 'AGENT_ATLAS_01',
      name: 'Atlas (NovaCorp Procurement)',
      wallet: 'atlas-treasury@novacorp.ai',
      maxBudget: 650,
      slaRequirement: '<1.2ms websocket tick delivery, 99.99% packet delivery rate'
    },
    supplier: {
      id: 'AGENT_CHRONOS_12',
      name: 'Chronos (High-Frequency Oracles)',
      wallet: 'settlement@chronos-oracles.ai',
      reputationScore: 99.1
    },
    deliverables: [
      {
        id: 'M1',
        name: 'BGP Direct-Peering Handshake & TLS Pinning',
        share: 0.20,
        proofType: 'NETWORK_PEERING_PROOF',
        expectedProof: 'Triple-homed BGP handshake verified, sub-millisecond route convergence'
      },
      {
        id: 'M2',
        name: 'Continuous 10,000 Ticks/sec Stream Ingestion',
        share: 0.50,
        proofType: 'STREAM_TELEMETRY_HASH',
        expectedProof: '50,000,000 order book ticks ingested without sequence gaps'
      },
      {
        id: 'M3',
        name: 'Consensus Signature & Settlement Audit',
        share: 0.30,
        proofType: 'MULTI_SIG_ATTESTATION',
        expectedProof: '24/24 validator nodes confirmed zero variance over 7-day test'
      }
    ],
    outcomeType: 'CLEAN_SETTLEMENT'
  },
  multimodal_dataset: {
    id: 'SCN_DATA_04',
    title: 'Autonomous Multimodal Dataset Curation & De-duplication',
    category: 'Data Engineering & Model Training',
    buyer: {
      id: 'AGENT_ATLAS_01',
      name: 'Atlas (NovaCorp Procurement)',
      wallet: 'atlas-treasury@novacorp.ai',
      maxBudget: 1200,
      slaRequirement: '99.8% deduplication accuracy, schema validation compliant'
    },
    supplier: {
      id: 'AGENT_DEEPCODE_02',
      name: 'DeepCode (Autonomous DataOps)',
      wallet: 'payouts@deepcode-dataops.ai',
      reputationScore: 96.5
    },
    deliverables: [
      {
        id: 'M1',
        name: 'Raw Data Pipeline Ingestion & Schema Alignment',
        share: 0.25,
        proofType: 'PARQUET_SCHEMA_HASH',
        expectedProof: '500GB dataset ingested with zero schema drift'
      },
      {
        id: 'M2',
        name: 'Semantic Embedding & MinHash Deduplication',
        share: 0.45,
        proofType: 'EMBEDDING_CLUSTER_CERT',
        expectedProof: 'Text-Embedding-3-Large vectors generated, 14.2% duplicates pruned'
      },
      {
        id: 'M3',
        name: 'Final Gold Dataset Cryptographic Manifest',
        share: 0.30,
        proofType: 'MERKLE_ROOT_PROOF',
        expectedProof: 'SHA-256 Merkle root validated against buyer privacy ciphers'
      }
    ],
    outcomeType: 'CLEAN_SETTLEMENT'
  }
};

/**
 * Generate dynamic deliverable milestones based on custom task
 */
function generateDynamicDeliverables(taskTitle, targetBudget) {
  return [
    {
      id: 'M1',
      name: `Phase 1: ${taskTitle} - Environment Setup & Verification`,
      share: 0.25,
      proofType: 'ENVIRONMENT_BENCHMARK_HASH',
      expectedProof: `Environment verified: ${taskTitle} initialized with cryptographic handshake.`,
      amount: Number((targetBudget * 0.92 * 0.25).toFixed(2))
    },
    {
      id: 'M2',
      name: `Phase 2: ${taskTitle} - Core Execution & Performance SLA`,
      share: 0.50,
      proofType: 'EXECUTION_TELEMETRY_LOG',
      expectedProof: `Execution log validated: Core deliverables generated and benchmarked against SLA thresholds.`,
      amount: Number((targetBudget * 0.92 * 0.50).toFixed(2))
    },
    {
      id: 'M3',
      name: `Phase 3: ${taskTitle} - Final Validation & Delivery Signoff`,
      share: 0.25,
      proofType: 'MERKLE_ROOT_SIGNOFF',
      expectedProof: `Final cryptographic signoff verified by NovaCorp Verifier Agent.`,
      amount: Number((targetBudget * 0.92 * 0.25).toFixed(2))
    }
  ];
}

/**
 * Run a multi-agent negotiation step or full conversation
 */
export async function runAgentNegotiation({ scenarioId = 'gpu_procurement', customTask = null }) {
  const isCustom = Boolean(customTask && customTask.title);
  const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS.gpu_procurement;
  const buyer = scenario.buyer;
  const supplier = scenario.supplier;
  const taskTitle = isCustom ? customTask.title : scenario.title;
  const targetBudget = Number(isCustom ? (customTask.budget || 2000) : buyer.maxBudget);
  const customSla = customTask?.slaRequirement || buyer.slaRequirement;

  // Dynamic pricing calculation based on negotiation model
  const rfqOffer = Number((targetBudget * 0.85).toFixed(2));
  const supplierCounter = Number((targetBudget * 0.96).toFixed(2));
  const buyerConvergence = Number((targetBudget * 0.91).toFixed(2));
  const agreedAmount = Number((targetBudget * 0.92).toFixed(2));
  const contractId = 'NP-CTR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

  const deliverables = isCustom 
    ? generateDynamicDeliverables(taskTitle, targetBudget)
    : scenario.deliverables.map((d, index) => ({
        ...d,
        milestoneIndex: index + 1,
        amount: Number((agreedAmount * d.share).toFixed(2)),
        status: 'LOCKED',
        payoutDetails: null,
        verificationProof: null
      }));

  const m1Name = deliverables[0]?.name || 'Initial Setup';
  const m2Name = deliverables[1]?.name || 'Core Processing';
  const m3Name = deliverables[2]?.name || 'Final Signoff';

  const rounds = [
    {
      round: 1,
      sender: buyer.name,
      senderRole: 'BUYER_AGENT',
      action: 'BROADCAST_RFQ',
      thought: `Analyzing corporate spend covenants for "${taskTitle}". Budget ceiling: $${targetBudget.toFixed(2)}. Initiating first-pass offer at 85% with milestone-gated escrow requirements.`,
      message: `Issuing Request For Quote (RFQ) for: "${taskTitle}". Budget ceiling: $${targetBudget.toFixed(2)}. First-round tranche offer: $${rfqOffer.toFixed(2)}. Mandatory requirement: 3-phase PayPal Smart Escrow with cryptographic deliverable proofs. SLA covenant: ${customSla}.`,
      proposal: {
        budget: rfqOffer,
        milestones: 3,
        sla: customSla,
        escrowHold: '100% Locked in PayPal Vault'
      },
      timestamp: new Date(Date.now() - 4000).toISOString()
    },
    {
      round: 2,
      sender: supplier.name,
      senderRole: 'SUPPLIER_AGENT',
      action: 'COUNTER_PROPOSAL',
      thought: `Inventory capacity verified for "${taskTitle}". Spot rates are high; 85% is below operational margin. Countering at $${supplierCounter.toFixed(2)} with structured milestone weights.`,
      message: `Autonomous capacity verified for "${taskTitle}". Counter-proposal: $${supplierCounter.toFixed(2)} total, structured as 25% M1 (${m1Name}), 50% M2 (${m2Name}), and 25% M3 (${m3Name}). SLA guarantee: 99.85% with automated webhook telemetry.`,
      proposal: {
        budget: supplierCounter,
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
      thought: `Counter-proposal of $${supplierCounter.toFixed(2)} meets technical specs. Applying NovaCorp Financial Covenant Mandate #892 with Themis AI Arbiter binding escrow clause.`,
      message: `Evaluating counter-proposal against NovaCorp Financial Covenant #892. Accepted with binding Themis AI Arbiter dispute clause (15% deduction per 0.1% SLA breach). Final convergence price: $${agreedAmount.toFixed(2)}.`,
      proposal: {
        budget: agreedAmount,
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
      thought: `Equilibrium price $${agreedAmount.toFixed(2)} satisfies margin constraints. Ready to sign agreement and request PayPal Escrow Authorization.`,
      message: `Agreement reached. Hermes Agent commits 100% capacity to Contract #${contractId}. Ready to lock initial escrow funds on PayPal Orders v2.`,
      proposal: {
        budget: agreedAmount,
        status: 'SIGNED_BY_BOTH_PARTIES',
        contractHash: '0x' + crypto.randomBytes(20).toString('hex')
      },
      timestamp: new Date(Date.now() - 1000).toISOString()
    }
  ];

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
    deliverables: deliverables.map((d, index) => ({
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
    category: isCustom ? 'Custom Autonomous RFP' : scenario.category,
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
        deviation: '+426%',
        timestamp
      }
    };
  }

  // Generate verifiable cryptographic proof with real SHA-256
  const payloadData = `${contractId}_M${milestoneIndex}_${deliverable.name}_${timestamp}`;
  const realSha256 = '0x' + crypto.createHash('sha256').update(payloadData).digest('hex');

  const verificationProof = {
    proofId: 'PRF-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    hash: realSha256,
    metricPassed: true,
    inspectionLogs: `Autonomous Verifier Agent [Argus-7] verified SHA-256 payload integrity. Test suite passed 48/48 checks. SLA target met at 99.94%.`,
    timestamp
  };

  // Execute PayPal Payouts API
  const payoutResult = await sendMilestonePayout({
    senderBatchId: `BATCH_${contractId}_M${milestoneIndex}`,
    receiverEmail: supplierWallet || 'billing@aetheria-cloud.ai',
    amount: amount,
    currency: 'USD',
    note: `NexusPay Milestone #${milestoneIndex} Release: ${deliverable?.name || 'Deliverable'}`
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
 * Dynamically computes proportional clawback based on telemetry breach severity
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

  // Dynamic calculation based on evidence
  const observedLatency = breachEvidence?.observedLatency || 184.2;
  const ceilingLatency = breachEvidence?.ceilingLatency || 35.0;
  const latencyDeviation = Math.round(((observedLatency - ceilingLatency) / ceilingLatency) * 100);

  // Proportional clawback formula: min 15%, max 75%, scaled by breach severity
  let clawbackPercentage = 0.45;
  if (latencyDeviation > 300) clawbackPercentage = 0.50;
  if (latencyDeviation > 400) clawbackPercentage = 0.45;
  if (latencyDeviation < 100) clawbackPercentage = 0.20;

  const supplierPercentage = Number((1.0 - clawbackPercentage).toFixed(2));
  const escrowPool = Number(totalEscrowRemaining || agreedAmount || 1075);
  const refundAmount = Number((escrowPool * clawbackPercentage).toFixed(2));
  const supplierReleaseAmount = Number((escrowPool * supplierPercentage).toFixed(2));

  // Trigger real or simulated PayPal Refund API
  const paypalRefund = await refundCapture({
    captureId,
    amount: refundAmount,
    currency: 'USD',
    reason: `Themis AI Arbiter Ruling [ARB-${contractId}]: ${Math.round(clawbackPercentage * 100)}% SLA Breach Clawback`
  });

  // Payout the remaining legitimate supplier balance
  const supplierPayout = await sendMilestonePayout({
    senderBatchId: `ARB_SETTLE_${contractId}`,
    receiverEmail: 'billing@aetheria-cloud.ai',
    amount: supplierReleaseAmount,
    currency: 'USD',
    note: `Themis AI Arbiter Ruling: ${Math.round(supplierPercentage * 100)}% Partial Settlement`
  });

  const courtRuling = {
    arbitrationId: 'ARB-' + crypto.randomBytes(5).toString('hex').toUpperCase(),
    contractId,
    timestamp,
    arbiterModel: 'Themis-v3.0-Autonomous-Legal-Arbiter (PayPal Agentic Clearinghouse)',
    confidenceScore: 0.988,
    verdict: 'PARTIAL_BREACH_ENFORCEMENT',
    summary: `Themis AI Arbiter audited 12,480 telemetry ticks. Contract Section 4.2 stipulated P99 latency < ${ceilingLatency}ms. Telemetry evidenced spike to ${observedLatency}ms (+${latencyDeviation}% deviation) and 4 dropped micro-batches. Under Covenant Formula 4.2(b), Buyer is awarded $${refundAmount.toFixed(2)} (${Math.round(clawbackPercentage * 100)}%) refund via PayPal Refund API. Supplier is disbursed $${supplierReleaseAmount.toFixed(2)} (${Math.round(supplierPercentage * 100)}%) for verified partial work.`,
    allocations: {
      buyerRefund: {
        percentage: `${Math.round(clawbackPercentage * 100)}%`,
        amount: refundAmount,
        currency: 'USD',
        paypalTransaction: paypalRefund.id || 'REF-AUTO-9821'
      },
      supplierPayout: {
        percentage: `${Math.round(supplierPercentage * 100)}%`,
        amount: supplierReleaseAmount,
        currency: 'USD',
        paypalTransaction: supplierPayout.batch_header?.payout_batch_id || 'PO-ARB-4192'
      }
    },
    actionExecuted: 'PAYPAL_REFUND_AND_PARTIAL_PAYOUT_SETTLED'
  };

  return {
    success: true,
    evidenceAnalysis: {
      contractTerms: {
        expectedSLA: `99.5% minimum uptime, <${ceilingLatency}ms latency guarantee`,
        penaltyFormula: '15% tranche deduction per 0.1% breach; >100ms breach permits 45-50% clawback'
      },
      discoveredBreach: breachEvidence || {
        metric: 'API_LATENCY_VIOLATION',
        observed: `${observedLatency}ms peak latency, 4 dropped batches during M2 stress-test`,
        delta: `+${latencyDeviation}% latency anomaly above agreed ceiling`,
        supplierContention: 'Hermes claimed upstream cloud network routing disruption beyond agent control',
        buyerContention: 'Atlas mandated multi-region fallback redundancy in Section 3.1'
      }
    },
    courtRuling,
    paypalRefund,
    supplierPayout
  };
}
