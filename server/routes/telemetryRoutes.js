import express from 'express';
import crypto from 'crypto';
import { 
  getDbTransactions, 
  addDbTransaction,
  updateDbTransaction, 
  getDbTreasury, 
  updateDbTreasury 
} from '../db.js';

const router = express.Router();

// GET /api/telemetry/transactions
router.get('/transactions', (req, res) => {
  const txns = getDbTransactions();
  res.json({
    total: txns.length,
    transactions: txns
  });
});

// POST /api/telemetry/simulate-tick (Inject real-time transaction for live AG Grid streaming)
router.post('/simulate-tick', (req, res) => {
  const buyers = ['Atlas-01 (NovaCorp)', 'Vector-02 (DataOps)', 'Krypton-07 (Treasury)', 'Hyperion-03 (Quant)'];
  const suppliers = ['Hermes-09 (Aetheria)', 'Specter-04 (RedTeam)', 'Chronos-12 (Oracle Feed)', 'DeepCode-02 (DataOps)'];
  const categories = ['GPU Cluster Compute', 'Autonomous Red-Teaming', 'Real-time Oracle Latency', 'Multimodal Deduplication', 'Edge Route Cache'];
  const stages = ['Escrow Locked', 'Tranche 1 Released', 'Tranche 2 Released', 'Completed', 'In Arbitration'];
  const rails = ['PayPal Orders v2', 'PayPal Payouts v1', 'Themis AI Arbiter'];

  const buyer = buyers[Math.floor(Math.random() * buyers.length)];
  const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const stage = stages[Math.floor(Math.random() * stages.length)];
  const rail = stage.includes('Arbitration') ? 'Themis AI Arbiter' : stage === 'Completed' ? 'PayPal Payouts v1' : 'PayPal Orders v2';
  
  const isAnomaly = Math.random() < 0.15;
  const riskScore = isAnomaly ? Math.floor(Math.random() * 35) + 65 : Math.floor(Math.random() * 20) + 5;
  const slaHealth = isAnomaly ? Number((80 + Math.random() * 10).toFixed(1)) : Number((99.2 + Math.random() * 0.79).toFixed(2));
  const amount = Number((150 + Math.random() * 2350).toFixed(2));

  const newTxn = {
    id: 'TXN-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-PP',
    timestamp: new Date().toISOString(),
    buyerAgent: buyer,
    supplierAgent: supplier,
    category,
    amount,
    currency: 'USD',
    milestoneStage: stage,
    milestoneProgress: stage === 'Completed' ? 100 : stage.includes('Tranche 2') ? 66 : stage.includes('Tranche 1') ? 33 : 0,
    riskScore,
    slaHealth,
    paypalReference: 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
    agentStatus: isAnomaly ? 'FLAGGED' : 'ACTIVE',
    settlementRail: rail
  };

  addDbTransaction(newTxn);

  res.json({
    success: true,
    transaction: newTxn
  });
});

// POST /api/telemetry/action (Agent freeze / override release)
router.post('/action', (req, res) => {
  const { transactionId, action, reason } = req.body;
  
  const updates = {};
  if (action === 'FREEZE_AGENT') {
    updates.agentStatus = 'FROZEN';
    updates.riskScore = 95;
  } else if (action === 'UNFREEZE') {
    updates.agentStatus = 'ACTIVE';
    updates.riskScore = 15;
  } else if (action === 'OVERRIDE_RELEASE') {
    updates.milestoneStage = 'Completed';
    updates.milestoneProgress = 100;
    updates.riskScore = 10;
  } else if (action === 'ESCALATE_DISPUTE') {
    updates.milestoneStage = 'In Arbitration';
    updates.riskScore = 85;
  }

  const updatedTxn = updateDbTransaction(transactionId, updates);
  if (!updatedTxn) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json({
    success: true,
    action,
    transaction: updatedTxn,
    message: `Action ${action} executed successfully on ${transactionId}`
  });
});

// GET /api/telemetry/treasury
router.get('/treasury', (req, res) => {
  const transactions = getDbTransactions();
  const treasury = getDbTreasury();

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

  const currentTreasury = updateDbTreasury({
    totalEscrowLocked: Number(totalLocked.toFixed(2)),
    totalSettledVolume: Number(totalSettled.toFixed(2)),
    disputedVolume: Number(disputedAmount.toFixed(2)),
    activeAgentsCount: activeAgents,
    anomaliesCount: anomaliesCount
  });

  res.json(currentTreasury);
});

export default router;
