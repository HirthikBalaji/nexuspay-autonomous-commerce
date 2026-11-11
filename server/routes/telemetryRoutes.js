import express from 'express';

const router = express.Router();

// High-density realistic pre-seeded agentic commerce transactions
let transactions = [
  {
    id: 'TXN-98214-PP',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    buyerAgent: 'Atlas-01 (NovaCorp)',
    supplierAgent: 'Hermes-09 (Aetheria)',
    category: 'GPU Cluster Compute',
    amount: 2150.00,
    currency: 'USD',
    milestoneStage: 'Escrow Locked',
    milestoneProgress: 0,
    riskScore: 12,
    slaHealth: 99.8,
    paypalReference: 'ORD-8921A4B9',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Orders v2'
  },
  {
    id: 'TXN-98213-PP',
    timestamp: new Date(Date.now() - 480000).toISOString(),
    buyerAgent: 'Atlas-01 (NovaCorp)',
    supplierAgent: 'Specter-04 (RedTeam)',
    category: 'Autonomous Red-Teaming',
    amount: 1950.00,
    currency: 'USD',
    milestoneStage: 'In Arbitration',
    milestoneProgress: 65,
    riskScore: 78,
    slaHealth: 84.2,
    paypalReference: 'REF-PENDING-THEMIS',
    agentStatus: 'FLAGGED',
    settlementRail: 'Themis AI Arbiter'
  },
  {
    id: 'TXN-98212-PP',
    timestamp: new Date(Date.now() - 950000).toISOString(),
    buyerAgent: 'Vector-02 (DataOps)',
    supplierAgent: 'Chronos-12 (Oracle Feed)',
    category: 'Real-time Oracle Latency',
    amount: 420.50,
    currency: 'USD',
    milestoneStage: 'Completed',
    milestoneProgress: 100,
    riskScore: 6,
    slaHealth: 99.99,
    paypalReference: 'PO-BATCH-892104',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98211-PP',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    buyerAgent: 'Krypton-07 (Treasury)',
    supplierAgent: 'Nexus-Micro (Edge CDN)',
    category: 'Decentralized Edge Routing',
    amount: 860.00,
    currency: 'USD',
    milestoneStage: 'Tranche 2 Released',
    milestoneProgress: 66,
    riskScore: 18,
    slaHealth: 99.4,
    paypalReference: 'PO-BATCH-774129',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98210-PP',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    buyerAgent: 'Apex-05 (SupplyChain)',
    supplierAgent: 'Logis-Bot (Freight AI)',
    category: 'Autonomous Multimodal Customs',
    amount: 3450.00,
    currency: 'USD',
    milestoneStage: 'Tranche 1 Released',
    milestoneProgress: 33,
    riskScore: 24,
    slaHealth: 98.7,
    paypalReference: 'PO-BATCH-661208',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98209-PP',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    buyerAgent: 'Atlas-01 (NovaCorp)',
    supplierAgent: 'DeepCode-03 (Synthesizer)',
    category: 'Zero-Shot Code Generation',
    amount: 1100.00,
    currency: 'USD',
    milestoneStage: 'Completed',
    milestoneProgress: 100,
    riskScore: 8,
    slaHealth: 99.95,
    paypalReference: 'PO-BATCH-551982',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98208-PP',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    buyerAgent: 'Sentinel-09 (RiskOps)',
    supplierAgent: 'Veritas-01 (Fact-Checker)',
    category: 'Regulatory Compliance Sweep',
    amount: 675.00,
    currency: 'USD',
    milestoneStage: 'Completed',
    milestoneProgress: 100,
    riskScore: 14,
    slaHealth: 99.2,
    paypalReference: 'PO-BATCH-441092',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98207-PP',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    buyerAgent: 'Apex-05 (SupplyChain)',
    supplierAgent: 'Aetheria-Nodes',
    category: 'GPU Cluster Compute',
    amount: 4800.00,
    currency: 'USD',
    milestoneStage: 'Completed',
    milestoneProgress: 100,
    riskScore: 5,
    slaHealth: 99.98,
    paypalReference: 'PO-BATCH-330194',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  },
  {
    id: 'TXN-98206-PP',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    buyerAgent: 'Vector-02 (DataOps)',
    supplierAgent: 'Specter-04 (RedTeam)',
    category: 'Penetration Testing Fuzzing',
    amount: 1250.00,
    currency: 'USD',
    milestoneStage: 'Refunded (Arbitrated)',
    milestoneProgress: 100,
    riskScore: 88,
    slaHealth: 76.4,
    paypalReference: 'REF-330912-THEMIS',
    agentStatus: 'PAUSED',
    settlementRail: 'Themis AI Arbiter'
  },
  {
    id: 'TXN-98205-PP',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    buyerAgent: 'Krypton-07 (Treasury)',
    supplierAgent: 'Hermes-09 (Aetheria)',
    category: 'Micro-Batch Model Inference',
    amount: 320.00,
    currency: 'USD',
    milestoneStage: 'Completed',
    milestoneProgress: 100,
    riskScore: 10,
    slaHealth: 99.9,
    paypalReference: 'PO-BATCH-220194',
    agentStatus: 'ACTIVE',
    settlementRail: 'PayPal Payouts v1'
  }
];

// GET /api/telemetry/transactions
router.get('/transactions', (req, res) => {
  res.json({
    total: transactions.length,
    transactions
  });
});

// POST /api/telemetry/action (Agent freeze / override release)
router.post('/action', (req, res) => {
  const { transactionId, action, reason } = req.body;
  const txn = transactions.find(t => t.id === transactionId);
  
  if (!txn) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  if (action === 'FREEZE_AGENT') {
    txn.agentStatus = 'FROZEN';
    txn.riskScore = 95;
  } else if (action === 'OVERRIDE_RELEASE') {
    txn.milestoneStage = 'Completed';
    txn.milestoneProgress = 100;
    txn.riskScore = 15;
  } else if (action === 'ESCALATE_DISPUTE') {
    txn.milestoneStage = 'In Arbitration';
    txn.riskScore = 85;
  }

  res.json({
    success: true,
    action,
    transaction: txn,
    message: `Action ${action} executed successfully on ${transactionId}`
  });
});

// GET /api/telemetry/treasury
router.get('/treasury', (req, res) => {
  const totalLocked = transactions
    .filter(t => t.milestoneStage.includes('Locked') || t.milestoneStage.includes('Tranche') || t.milestoneStage.includes('Arbitration'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSettled = transactions
    .filter(t => t.milestoneStage === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const disputedAmount = transactions
    .filter(t => t.milestoneStage.includes('Arbitration') || t.milestoneStage.includes('Refunded'))
    .reduce((sum, t) => sum + t.amount, 0);

  const activeAgents = new Set(transactions.map(t => t.buyerAgent).concat(transactions.map(t => t.supplierAgent))).size;
  const anomaliesCount = transactions.filter(t => t.riskScore > 60).length;

  res.json({
    currency: 'USD',
    totalEscrowLocked: Number(totalLocked.toFixed(2)),
    totalSettledVolume: Number(totalSettled.toFixed(2)),
    disputedVolume: Number(disputedAmount.toFixed(2)),
    liquidVaultBalance: 84520.00,
    activeAgentsCount: activeAgents,
    anomaliesCount: anomaliesCount,
    arbitrationWinRate: '94.2%',
    averageSettlementLatency: '1.4s'
  });
});

export default router;
