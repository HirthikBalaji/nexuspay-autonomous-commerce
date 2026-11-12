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
import { callOpenRouterChat, extractJsonFromLlm } from '../llmClient.js';

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

// POST /api/paypal/agent-tools/chat (Natural Language -> MCP Tool Selection -> Live PayPal Execution)
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Valid instruction message required' });
  }

  const prompt = `You are an Autonomous Treasury Agent equipped with the PayPal Model Context Protocol (MCP).
User instruction: "${message}"

Available MCP Tools:
- paypal_send_payout: { receiverEmail: string, amount: number, currency: string, note: string }
- paypal_create_order: { amount: number, currency: string, description: string }
- paypal_refund_capture: { captureId: string, amount: number, reason: string }

Select the appropriate tool and respond with raw valid JSON only matching:
{
  "tool": "paypal_send_payout",
  "arguments": {
    "receiverEmail": "sb-47udt4751600779@business.example.com",
    "amount": 250.00,
    "currency": "USD",
    "note": "..."
  },
  "agentThought": "1 sentence explaining why this tool was chosen"
}`;

  try {
    const startTime = Date.now();
    const llmRes = await callOpenRouterChat({
      messages: [
        { role: 'system', content: 'You are an autonomous PayPal MCP Agent. Always respond with raw JSON tool invocations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      maxTokens: 600
    });

    const parsed = extractJsonFromLlm(llmRes.content);
    if (!parsed || !parsed.tool) {
      return res.status(422).json({
        error: 'LLM failed to output valid MCP tool invocation',
        rawContent: llmRes.content
      });
    }

    let executionResult = null;
    if (parsed.tool === 'paypal_send_payout') {
      executionResult = await sendMilestonePayout({
        senderBatchId: 'MCP_CHAT_' + Date.now(),
        receiverEmail: parsed.arguments.receiverEmail || 'sb-47udt4751600779@business.example.com',
        amount: parsed.arguments.amount || 100,
        currency: parsed.arguments.currency || 'USD',
        note: parsed.arguments.note || 'Autonomous MCP Milestone Payout'
      });
    } else if (parsed.tool === 'paypal_create_order') {
      executionResult = await createOrder({
        amount: parsed.arguments.amount || 500,
        currency: parsed.arguments.currency || 'USD',
        description: parsed.arguments.description || 'Autonomous Agent Escrow Order'
      });
    } else if (parsed.tool === 'paypal_refund_capture') {
      executionResult = await refundCapture({
        captureId: parsed.arguments.captureId || 'CAP-AUTO-' + Date.now(),
        amount: parsed.arguments.amount || 150,
        currency: parsed.arguments.currency || 'USD',
        reason: parsed.arguments.reason || 'Autonomous Dispute Clawback'
      });
    } else {
      return res.status(400).json({ error: `Unsupported tool: ${parsed.tool}` });
    }

    return res.json({
      success: true,
      llmTelemetry: {
        model: llmRes.model,
        latencyMs: Date.now() - startTime,
        tokens: llmRes.tokens
      },
      mcpToolCall: parsed,
      executionResult
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
