import express from 'express';
import { 
  createOrder, 
  captureOrder, 
  sendMilestonePayout, 
  refundCapture, 
  verifyWebhookSignature, 
  listCustomerDisputes,
  getPayPalConfig 
} from '../paypalClient.js';

const router = express.Router();

/**
 * PayPal Model Context Protocol (MCP) & Agent Tools Manifest
 * Conforming to PayPal AI Agent Toolkit specification: https://docs.paypal.ai
 */
const PAYPAL_MCP_TOOLS = [
  {
    name: 'paypal_create_order',
    description: 'Initialize a smart escrow hold order on PayPal Orders v2 API for autonomous agent settlement',
    parameters: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Total agreed contract escrow amount' },
        currency: { type: 'string', default: 'USD', description: 'ISO 4217 3-letter currency code' },
        description: { type: 'string', description: 'Contract title or procurement mandate description' },
        customId: { type: 'string', description: 'Unique agent contract identifier (e.g. NP-CTR-XXXX)' }
      },
      required: ['amount']
    }
  },
  {
    name: 'paypal_capture_order',
    description: 'Capture authorized escrow funds into the NexusPay smart vault once buyer approves terms',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'The PayPal Order ID returned by create_order' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'paypal_send_payout',
    description: 'Execute automated conditional milestone release to supplier agent via PayPal Payouts v1 API',
    parameters: {
      type: 'object',
      properties: {
        senderBatchId: { type: 'string', description: 'Unique payout batch identifier' },
        receiverEmail: { type: 'string', description: 'PayPal wallet email address of beneficiary agent' },
        amount: { type: 'number', description: 'Tranche release amount' },
        currency: { type: 'string', default: 'USD' },
        note: { type: 'string', description: 'Milestone deliverable reference note' }
      },
      required: ['receiverEmail', 'amount']
    }
  },
  {
    name: 'paypal_refund_capture',
    description: 'Execute proportional clawback refund to buyer agent via PayPal Refund API upon SLA breach',
    parameters: {
      type: 'object',
      properties: {
        captureId: { type: 'string', description: 'PayPal Capture ID from initial escrow hold' },
        amount: { type: 'number', description: 'Clawback refund amount computed by Themis Arbiter' },
        currency: { type: 'string', default: 'USD' },
        reason: { type: 'string', description: 'Judicial arbitration citation and breach details' }
      },
      required: ['captureId', 'amount', 'reason']
    }
  },
  {
    name: 'paypal_list_disputes',
    description: 'Query active dispute cases and evidence from PayPal Customer Disputes API v1',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'paypal_verify_webhook',
    description: 'Verify the cryptographic HMAC/RSA signature of real PayPal webhook transmissions',
    parameters: {
      type: 'object',
      properties: {
        authAlgo: { type: 'string' },
        certUrl: { type: 'string' },
        transmissionId: { type: 'string' },
        transmissionSig: { type: 'string' },
        transmissionTime: { type: 'string' },
        webhookId: { type: 'string' },
        webhookEvent: { type: 'object' }
      },
      required: ['transmissionId', 'transmissionSig']
    }
  }
];

// GET /api/paypal/agent-tools (MCP Tool Registry)
router.get('/', (req, res) => {
  const config = getPayPalConfig();
  res.json({
    protocol: 'PayPal Model Context Protocol (MCP) Server',
    specVersion: '2026-11-12',
    provider: 'NexusPay Autonomous Clearinghouse',
    documentationUrl: 'https://docs.paypal.ai/developer/tools/ai/agent-tools-ref',
    gatewayMode: config.simulationMode ? 'INTERACTIVE_SANDBOX_SIMULATION' : 'LIVE_PAYPAL_SANDBOX',
    toolsCount: PAYPAL_MCP_TOOLS.length,
    tools: PAYPAL_MCP_TOOLS
  });
});

// POST /api/paypal/agent-tools/execute (Agent Tool Invocation Endpoint)
router.post('/execute', async (req, res) => {
  const { tool, arguments: args } = req.body;

  try {
    switch (tool) {
      case 'paypal_create_order': {
        const order = await createOrder({
          amount: args.amount,
          currency: args.currency || 'USD',
          description: args.description || 'NexusPay Autonomous Escrow',
          customId: args.customId || 'MANDATE_AGENT_001'
        });
        return res.json({ success: true, tool, result: order });
      }

      case 'paypal_capture_order': {
        const capture = await captureOrder(args.orderId);
        return res.json({ success: true, tool, result: capture });
      }

      case 'paypal_send_payout': {
        const payout = await sendMilestonePayout({
          senderBatchId: args.senderBatchId,
          receiverEmail: args.receiverEmail,
          amount: args.amount,
          currency: args.currency || 'USD',
          note: args.note || 'Milestone settlement release'
        });
        return res.json({ success: true, tool, result: payout });
      }

      case 'paypal_refund_capture': {
        const refund = await refundCapture({
          captureId: args.captureId,
          amount: args.amount,
          currency: args.currency || 'USD',
          reason: args.reason
        });
        return res.json({ success: true, tool, result: refund });
      }

      case 'paypal_list_disputes': {
        const disputes = await listCustomerDisputes();
        return res.json({ success: true, tool, result: disputes });
      }

      case 'paypal_verify_webhook': {
        const verification = await verifyWebhookSignature(args);
        return res.json({ success: true, tool, result: verification });
      }

      default:
        return res.status(400).json({ error: `Unknown tool: ${tool}` });
    }
  } catch (error) {
    console.error(`[PayPal MCP] Execution error for ${tool}:`, error);
    res.status(500).json({ error: error.message, tool });
  }
});

export default router;
