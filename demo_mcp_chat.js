import dotenv from 'dotenv';
dotenv.config();
import { callOpenRouterChat, extractJsonFromLlm } from './server/llmClient.js';
import { sendMilestonePayout, createOrder, refundCapture } from './server/paypalClient.js';

async function runMcpDemo(userInstruction) {
  console.log('\n======================================================');
  console.log('🤖 [NexusPay MCP Agent] User Command:');
  console.log(`"${userInstruction}"`);
  console.log('======================================================\n');

  const prompt = `You are an Autonomous Treasury Agent equipped with the PayPal Model Context Protocol (MCP).
User instruction: "${userInstruction}"

Available MCP Tools:
- paypal_send_payout: { receiverEmail: string, amount: number, currency: string, note: string }
- paypal_create_order: { amount: number, currency: string, description: string }
- paypal_refund_capture: { captureId: string, amount: number, reason: string }

Select the appropriate tool and respond with raw valid JSON only matching:
{
  "tool": "paypal_send_payout",
  "arguments": {
    "receiverEmail": "...",
    "amount": 250.00,
    "currency": "USD",
    "note": "..."
  },
  "agentThought": "1 sentence explaining why this tool was chosen"
}`;

  console.log('⚡ Sending natural language instruction to OpenRouter LLM...');
  const startTime = Date.now();
  const llmRes = await callOpenRouterChat({
    messages: [
      { role: 'system', content: 'You are an autonomous PayPal MCP Agent. Always respond with raw JSON tool invocations.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    maxTokens: 500
  });

  console.log(`🧠 [LLM Decision via ${llmRes.model} in ${Date.now() - startTime}ms]:`);
  const parsed = extractJsonFromLlm(llmRes.content);
  console.log(JSON.stringify(parsed, null, 2));

  if (!parsed || !parsed.tool) {
    console.error('❌ Failed to parse MCP tool call from LLM response.');
    return;
  }

  console.log(`\n💳 Executing [${parsed.tool}] on live PayPal Sandbox rails...`);
  if (parsed.tool === 'paypal_send_payout') {
    const payout = await sendMilestonePayout({
      senderBatchId: 'MCP_CLI_' + Date.now(),
      receiverEmail: parsed.arguments.receiverEmail || 'sb-47udt4751600779@business.example.com',
      amount: parsed.arguments.amount,
      currency: parsed.arguments.currency || 'USD',
      note: parsed.arguments.note || 'Autonomous MCP Milestone Payout'
    });

    console.log('\n✅ [PAYPAL PAYOUT SUCCESS]');
    console.log(`• Batch ID: ${payout.batch_header?.payout_batch_id}`);
    console.log(`• Status:   ${payout.batch_header?.batch_status}`);
    console.log(`• Amount:   $${parsed.arguments.amount} ${parsed.arguments.currency || 'USD'}`);
    console.log(`• Receiver: ${parsed.arguments.receiverEmail || 'sb-47udt4751600779@business.example.com'}`);
    console.log(`• PayPal Resource Link: https://api.sandbox.paypal.com/v1/payments/payouts/${payout.batch_header?.payout_batch_id}`);
  }
}

// Test with a natural language command:
runMcpDemo('Milestone 1 for the 16x H100 cluster is cryptographically verified by Argus-7. Disburse a $250.00 USD milestone release to sb-47udt4751600779@business.example.com via PayPal Payouts.');
