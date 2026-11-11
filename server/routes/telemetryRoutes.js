import express from 'express';
import { 
  getDbTransactions, 
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
