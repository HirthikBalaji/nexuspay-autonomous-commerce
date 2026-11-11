import express from 'express';
import { 
  DEMO_SCENARIOS, 
  runAgentNegotiation, 
  verifyAndReleaseMilestone, 
  runThemisArbitration 
} from '../agentOrchestrator.js';
import { getDbContracts, getDbContractById } from '../db.js';

const router = express.Router();

// GET /api/agent/scenarios
router.get('/scenarios', (req, res) => {
  res.json({
    scenarios: Object.values(DEMO_SCENARIOS)
  });
});

// GET /api/agent/contracts
router.get('/contracts', (req, res) => {
  res.json({
    contracts: getDbContracts()
  });
});

// GET /api/agent/contracts/:id
router.get('/contracts/:id', (req, res) => {
  const contract = getDbContractById(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json(contract);
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

// GET /api/agent/negotiate/stream (Server-Sent Events for real-time live negotiation)
router.get('/negotiate/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { scenarioId = 'gpu_procurement', customTitle, customBudget, customSla } = req.query;
  const customTask = customTitle ? {
    title: customTitle,
    budget: Number(customBudget || 2000),
    slaRequirement: customSla || '99.9% uptime, <15ms latency'
  } : null;

  try {
    const contract = await runAgentNegotiation({ scenarioId, customTask });
    
    // Stream rounds progressively
    for (let i = 0; i < contract.rounds.length; i++) {
      const round = contract.rounds[i];
      res.write(`event: round\ndata: ${JSON.stringify(round)}\n\n`);
      // Brief pause between rounds for realistic agent deliberation
      await new Promise(r => setTimeout(r, 650));
    }

    // Stream final contract agreement & PayPal order
    res.write(`event: complete\ndata: ${JSON.stringify(contract)}\n\n`);
    res.end();
  } catch (error) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
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
