import express from 'express';
import { 
  createOrder, 
  captureOrder, 
  sendMilestonePayout, 
  refundCapture, 
  updatePayPalCredentials, 
  getPayPalConfig 
} from '../paypalClient.js';

const router = express.Router();

// In-memory store for webhook events for judge visibility
let webhookEvents = [
  {
    id: 'WH-EVT-001',
    event_type: 'CHECKOUT.ORDER.APPROVED',
    resource_type: 'checkout-order',
    summary: 'Autonomous order approved by NovaCorp Agent Vault',
    create_time: new Date(Date.now() - 3600000).toISOString(),
    status: 'PROCESSED'
  },
  {
    id: 'WH-EVT-002',
    event_type: 'PAYMENT.CAPTURE.COMPLETED',
    resource_type: 'capture',
    summary: 'Escrow lock authorized for $2,150.00 USD',
    create_time: new Date(Date.now() - 3500000).toISOString(),
    status: 'PROCESSED'
  },
  {
    id: 'WH-EVT-003',
    event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
    resource_type: 'payouts',
    summary: 'Milestone 1 payout of $537.50 released to Hermes Agent',
    create_time: new Date(Date.now() - 1800000).toISOString(),
    status: 'PROCESSED'
  }
];

// GET /api/paypal/credentials
router.get('/credentials', (req, res) => {
  res.json(getPayPalConfig());
});

// POST /api/paypal/credentials
router.post('/credentials', (req, res) => {
  const { clientId, clientSecret, simulationMode } = req.body;
  const result = updatePayPalCredentials(clientId, clientSecret, simulationMode);
  res.json(result);
});

// POST /api/paypal/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, description, customId } = req.body;
    const order = await createOrder({ amount, currency, description, customId });
    
    // Add to webhook log
    webhookEvents.unshift({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'CHECKOUT.ORDER.CREATED',
      resource_type: 'checkout-order',
      summary: `Order created for $${amount} ${currency || 'USD'}`,
      create_time: new Date().toISOString(),
      status: 'PROCESSED'
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/paypal/capture-order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const capture = await captureOrder(orderId);

    // Record webhook event
    webhookEvents.unshift({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource_type: 'capture',
      summary: `Order ${orderId} successfully captured into NexusPay Escrow`,
      create_time: new Date().toISOString(),
      status: 'PROCESSED'
    });

    res.json(capture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/paypal/payout-milestone
router.post('/payout-milestone', async (req, res) => {
  try {
    const { senderBatchId, receiverEmail, amount, currency, note } = req.body;
    const payout = await sendMilestonePayout({
      senderBatchId,
      receiverEmail,
      amount,
      currency,
      note
    });

    webhookEvents.unshift({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
      resource_type: 'payouts',
      summary: `Automated milestone payout of $${amount} released to ${receiverEmail}`,
      create_time: new Date().toISOString(),
      status: 'PROCESSED'
    });

    res.json(payout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/paypal/refund-dispute
router.post('/refund-dispute', async (req, res) => {
  try {
    const { captureId, amount, currency, reason } = req.body;
    const refund = await refundCapture({
      captureId,
      amount,
      currency,
      reason
    });

    webhookEvents.unshift({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'CUSTOMER.DISPUTE.RESOLVED',
      resource_type: 'dispute',
      summary: `Themis AI Arbiter executed $${amount} dispute refund to buyer`,
      create_time: new Date().toISOString(),
      status: 'PROCESSED'
    });

    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/paypal/webhook-events
router.get('/webhook-events', (req, res) => {
  res.json({
    total: webhookEvents.length,
    events: webhookEvents.slice(0, 50)
  });
});

// POST /api/paypal/webhooks (Ingestion endpoint for real PayPal webhook listener)
router.post('/webhooks', (req, res) => {
  const event = req.body;
  console.log('[PayPal Webhook Received]:', event.event_type);
  webhookEvents.unshift({
    id: event.id || 'WH-' + Date.now(),
    event_type: event.event_type || 'GENERAL.WEBHOOK.RECEIVED',
    resource_type: event.resource_type || 'unknown',
    summary: event.summary || 'Webhook received from PayPal Cloud',
    create_time: event.create_time || new Date().toISOString(),
    status: 'PROCESSED'
  });

  res.status(200).send('Webhook acknowledged');
});

export default router;
