import express from 'express';
import { 
  createOrder, 
  captureOrder, 
  sendMilestonePayout, 
  refundCapture, 
  updatePayPalCredentials, 
  getPayPalConfig,
  testPayPalConnection
} from '../paypalClient.js';
import { getDbWebhooks, addDbWebhook } from '../db.js';

const router = express.Router();

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

// GET /api/paypal/test-connection
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testPayPalConnection();
    res.json(result);
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// POST /api/paypal/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, description, customId } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const order = await createOrder({ amount, currency, description, customId });
    
    // Add to webhook log
    addDbWebhook({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'CHECKOUT.ORDER.CREATED',
      resource_type: 'checkout-order',
      summary: `Order ${order.id} created for $${Number(amount).toFixed(2)} ${currency || 'USD'}`,
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

    addDbWebhook({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource_type: 'capture',
      summary: `Order ${orderId} successfully captured into NexusPay Escrow Vault`,
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
    if (!amount || !receiverEmail) {
      return res.status(400).json({ error: 'amount and receiverEmail are required' });
    }

    const payout = await sendMilestonePayout({
      senderBatchId,
      receiverEmail,
      amount,
      currency,
      note
    });

    addDbWebhook({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'PAYMENT.PAYOUTSBATCH.SUCCESS',
      resource_type: 'payouts',
      summary: `Automated milestone payout of $${Number(amount).toFixed(2)} released to ${receiverEmail}`,
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

    addDbWebhook({
      id: 'WH-EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      event_type: 'CUSTOMER.DISPUTE.RESOLVED',
      resource_type: 'dispute',
      summary: `Themis AI Arbiter executed $${Number(amount).toFixed(2)} dispute refund to buyer`,
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
  const events = getDbWebhooks();
  res.json({
    total: events.length,
    events: events.slice(0, 50)
  });
});

// POST /api/paypal/webhooks (Ingestion endpoint for real PayPal webhook listener)
router.post('/webhooks', (req, res) => {
  const event = req.body;
  console.log('[PayPal Webhook Ingested]:', event.event_type || 'PAYMENT.CAPTURE.COMPLETED');
  
  addDbWebhook({
    id: event.id || 'WH-' + Date.now(),
    event_type: event.event_type || 'PAYMENT.CAPTURE.COMPLETED',
    resource_type: event.resource_type || 'capture',
    summary: event.summary || 'Real-time Webhook received from PayPal Cloud',
    create_time: event.create_time || new Date().toISOString(),
    status: 'PROCESSED'
  });

  res.status(200).json({ status: 'ACKNOWLEDGED' });
});

export default router;
