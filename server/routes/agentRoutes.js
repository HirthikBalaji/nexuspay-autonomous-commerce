import express from 'express';
import { 
  DEMO_SCENARIOS, 
  runAgentNegotiation, 
  verifyAndReleaseMilestone, 
  runThemisArbitration 
} from '../agentOrchestrator.js';

const router = express.Router();

// GET /api/agent/scenarios
router.get('/scenarios', (req, res) => {
  res.json({
    scenarios: Object.values(DEMO_SCENARIOS)
  });
});

// POST /api/agent/negotiate
router.post('/negotiate', async (req, res) => {
  try {
    const { scenarioId, customTask } = req.body;
    const contract = await runAgentNegotiation({ scenarioId, customTask });
    res.json(contract);
  } catch (error) {
    console.error('[Agent Routes] Negotiate Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/verify-milestone
router.post('/verify-milestone', async (req, res) => {
  try {
    const { contractId, milestoneIndex, deliverable, supplierWallet, amount, simulateFailure } = req.body;
    const result = await verifyAndReleaseMilestone({
      contractId,
      milestoneIndex,
      deliverable,
      supplierWallet,
      amount,
      simulateFailure
    });
    res.json(result);
  } catch (error) {
    console.error('[Agent Routes] Verify Milestone Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/arbitrate
router.post('/arbitrate', async (req, res) => {
  try {
    const { contractId, disputeReason, agreedAmount, totalEscrowRemaining, captureId, breachEvidence } = req.body;
    const ruling = await runThemisArbitration({
      contractId,
      disputeReason,
      agreedAmount,
      totalEscrowRemaining,
      captureId,
      breachEvidence
    });
    res.json(ruling);
  } catch (error) {
    console.error('[Agent Routes] Arbitrate Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
