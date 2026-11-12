import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || 'liquid/lfm-2.5-2.6b:free';

const FALLBACK_MODELS = (process.env.OPENROUTER_FALLBACK_MODELS || 'openrouter/auto,liquid/lfm-3-1.7b:free,nvidia/nemotron-3.5-lightning:free')
  .split(',')
  .map(m => m.trim())
  .filter(Boolean);

export const ALL_CANDIDATE_MODELS = Array.from(new Set([PRIMARY_MODEL, ...FALLBACK_MODELS]));

/**
 * Cleanly extract JSON from model output that might include markdown code fences
 */
export function extractJsonFromLlm(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  let text = rawText.trim();

  // Strip code fences: ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '').trim();
  }

  // Look for the outermost JSON object { ... }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      // Continue to next heuristic
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Execute raw completion against OpenRouter free models with cascading fallback
 */
export async function callOpenRouterChat({
  messages,
  temperature = 0.3,
  maxTokens = 1200,
  timeoutMs = 10000
}) {
  const apiKey = process.env.OPENROUTER_API_KEY || API_KEY;
  if (!apiKey || apiKey.startsWith('your_')) {
    return { success: false, error: 'OpenRouter API key not configured' };
  }

  for (const model of ALL_CANDIDATE_MODELS) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://nexuspay.network',
          'X-Title': 'NexusPay Autonomous Agentic Commerce'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens
        })
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[OpenRouter] Model ${model} returned ${response.status}: ${errorText.slice(0, 150)}... Trying next candidate.`);
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        console.warn(`[OpenRouter] Model ${model} returned empty choice content. Trying next candidate.`);
        continue;
      }

      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        content: content.trim(),
        model: data.model || model,
        latencyMs,
        tokens: data.usage?.total_tokens || null
      };
    } catch (err) {
      console.warn(`[OpenRouter] Model ${model} failed (${err.name}: ${err.message}). Trying fallback model.`);
    }
  }

  return { success: false, error: 'All OpenRouter free candidate models exhausted or timed out.' };
}

/**
 * Get LLM provider status and verify live connectivity
 */
export async function checkLlmHealth() {
  const apiKey = process.env.OPENROUTER_API_KEY || API_KEY;
  const isConfigured = Boolean(apiKey && !apiKey.startsWith('your_'));
  
  if (!isConfigured) {
    return {
      provider: 'OpenRouter Free AI Rails',
      isConfigured: false,
      status: 'UNCONFIGURED',
      primaryModel: PRIMARY_MODEL,
      fallbackModels: FALLBACK_MODELS
    };
  }

  const startTime = Date.now();
  try {
    const testRes = await callOpenRouterChat({
      messages: [{ role: 'user', content: 'Say "ACTIVE" in one word.' }],
      maxTokens: 10,
      timeoutMs: 4000
    });

    return {
      provider: 'OpenRouter Free AI Rails',
      isConfigured: true,
      status: testRes.success ? 'CONNECTED_HEALTHY' : 'DEGRADED',
      activeModel: testRes.model || PRIMARY_MODEL,
      latencyMs: testRes.latencyMs || (Date.now() - startTime),
      candidateModels: ALL_CANDIDATE_MODELS,
      error: testRes.error || null
    };
  } catch (err) {
    return {
      provider: 'OpenRouter Free AI Rails',
      isConfigured: true,
      status: 'ERROR',
      error: err.message,
      candidateModels: ALL_CANDIDATE_MODELS
    };
  }
}

/**
 * Generate Real Multi-Agent Negotiation Rounds via OpenRouter LLM
 */
export async function generateLlmNegotiation({
  taskTitle,
  targetBudget,
  customSla,
  buyer,
  supplier,
  isCustom,
  scenario
}) {
  const rfqOffer = Number((targetBudget * 0.85).toFixed(2));
  const supplierCounter = Number((targetBudget * 0.96).toFixed(2));
  const agreedAmount = Number((targetBudget * 0.92).toFixed(2));

  const prompt = `You are an Autonomous AI Agent Commerce Simulator.
Simulate a 4-step autonomous negotiation between Buyer AI "${buyer.name}" and Supplier AI "${supplier.name}".

Task: "${taskTitle}"
Budget Ceiling: $${targetBudget.toFixed(2)} USD
SLA Requirement: "${customSla}"

Provide realistic agent thought reasoning and public messages for each round.
Output JSON ONLY matching this format (under 30 words per field):
{
  "r1_thought": "Atlas internal reasoning assessing spend limits and milestone escrow requirements",
  "r1_message": "Atlas RFQ message proposing initial tranche offer around $${rfqOffer}",
  "r2_thought": "Hermes margin calculation and capacity commitment",
  "r2_message": "Hermes counter proposal around $${supplierCounter} with SLA commitment",
  "r3_thought": "Atlas convergence rationale invoking Themis AI Arbiter dispute covenants",
  "r3_message": "Atlas final agreement at $${agreedAmount} with binding PayPal escrow terms",
  "r4_thought": "Hermes cryptographic acceptance and PayPal Orders v2 creation trigger",
  "r4_message": "Hermes signing confirmation committing capacity"
}`;

  console.log(`[OpenRouter] Requesting real multi-agent negotiation from LLM for "${taskTitle}"...`);
  const llmRes = await callOpenRouterChat({
    messages: [
      { role: 'system', content: 'You are an autonomous AI agent commerce engine. Respond ONLY with valid JSON. Never output markdown comments or extra text.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.35,
    maxTokens: 1200
  });

  if (llmRes.success) {
    const parsed = extractJsonFromLlm(llmRes.content);
    if (parsed && parsed.r1_message && parsed.r2_message && parsed.r3_message && parsed.r4_message) {
      console.log(`[OpenRouter] Real LLM negotiation generated via ${llmRes.model} in ${llmRes.latencyMs}ms (${llmRes.tokens || 'N/A'} tokens)`);
      return {
        success: true,
        llmPowered: true,
        modelUsed: llmRes.model,
        latencyMs: llmRes.latencyMs,
        tokens: llmRes.tokens,
        rounds: [
          {
            round: 1,
            sender: buyer.name,
            senderRole: 'BUYER_AGENT',
            action: 'BROADCAST_RFQ',
            thought: parsed.r1_thought || `Analyzing corporate covenants for "${taskTitle}". Initiating first-pass tranche offer at $${rfqOffer}.`,
            message: parsed.r1_message || `Issuing Request For Quote for "${taskTitle}". Initial tranche offer: $${rfqOffer.toFixed(2)}. Mandatory requirement: 3-phase PayPal Smart Escrow.`,
            proposal: {
              budget: rfqOffer,
              milestones: 3,
              sla: customSla,
              escrowHold: '100% Locked in PayPal Vault'
            },
            timestamp: new Date(Date.now() - 4000).toISOString()
          },
          {
            round: 2,
            sender: supplier.name,
            senderRole: 'SUPPLIER_AGENT',
            action: 'COUNTER_PROPOSAL',
            thought: parsed.r2_thought || `Capacity verified for "${taskTitle}". Countering at $${supplierCounter} to preserve operational margin.`,
            message: parsed.r2_message || `Autonomous capacity reserved for "${taskTitle}". Counter offer: $${supplierCounter.toFixed(2)} with 3-phase delivery guarantees.`,
            proposal: {
              budget: supplierCounter,
              milestones: 3,
              sla: '99.85% guaranteed with automated telemetry',
              escrowHold: 'Standard Milestone Release'
            },
            timestamp: new Date(Date.now() - 3000).toISOString()
          },
          {
            round: 3,
            sender: buyer.name,
            senderRole: 'BUYER_AGENT',
            action: 'POLICY_CONVERGENCE',
            thought: parsed.r3_thought || `Convergence reached. Enforcing Themis AI Arbiter dispute covenants on PayPal escrow.`,
            message: parsed.r3_message || `Accepting with binding Themis AI Arbiter escrow dispute clause. Final agreed price: $${agreedAmount.toFixed(2)}.`,
            proposal: {
              budget: agreedAmount,
              milestones: 3,
              arbitrationClause: 'Themis AI Arbiter Binding Escrow Enforcement',
              penaltyRate: '15% tranche deduction per 0.1% SLA breach'
            },
            timestamp: new Date(Date.now() - 2000).toISOString()
          },
          {
            round: 4,
            sender: supplier.name,
            senderRole: 'SUPPLIER_AGENT',
            action: 'ACCEPT_CONTRACT',
            thought: parsed.r4_thought || `Final terms accepted. Generating cryptographic hash and locking PayPal vault.`,
            message: parsed.r4_message || `Agreement sealed. Hermes agent committing 100% capacity to this contract. Locking escrow on PayPal.`,
            proposal: {
              budget: agreedAmount,
              status: 'SIGNED_BY_BOTH_PARTIES'
            },
            timestamp: new Date(Date.now() - 1000).toISOString()
          }
        ]
      };
    }
  }

  console.warn(`[OpenRouter] LLM call unavailable or format mismatch. Falling back to mathematical negotiation engine.`);
  return {
    success: false,
    llmPowered: false,
    reason: llmRes.error || 'Fallback to deterministic engine'
  };
}

/**
 * Generate Real Judicial Ruling via OpenRouter LLM for Themis AI Arbiter
 */
export async function generateLlmThemisRuling({
  contractId,
  taskTitle,
  agreedAmount,
  observedLatency,
  ceilingLatency,
  latencyDeviation,
  escrowPool
}) {
  const prompt = `You are Themis-v3.0, the Autonomous Supreme Judicial AI Arbiter for decentralized commerce and PayPal escrow covenants.
Analyze the following contractual breach evidence and deliver a judicial ruling:

- Contract ID: ${contractId}
- Subject: ${taskTitle}
- Agreed Contract Amount: $${agreedAmount.toFixed(2)} USD
- Escrow Remaining in Vault: $${escrowPool.toFixed(2)} USD
- Contractual Ceiling Latency: <${ceilingLatency}ms
- Discovered Actual Telemetry Latency: ${observedLatency}ms (+${latencyDeviation}% breach)
- Dropped Batches: 4 dropped micro-batches during M2 stress-test

Requirements:
- Calculate an equitable clawback percentage between 35% and 55% based on breach severity.
- Produce an authoritative legal summary citing contractual covenants and automated PayPal refund actions.
- Output MUST be valid JSON only matching this schema:
{
  "clawbackPercentage": 0.45,
  "confidenceScore": 0.988,
  "verdict": "PARTIAL_BREACH_ENFORCEMENT",
  "summary": "Authoritative judicial summary detailing telemetry evidence, covenant clauses, and exact PayPal refund instructions.",
  "buyerContention": "Atlas mandated multi-region fallback redundancy in Section 3.1",
  "supplierContention": "Hermes claimed upstream cloud network routing disruption beyond agent control"
}`;

  console.log(`[OpenRouter] Requesting Themis AI Arbiter judicial ruling from LLM for contract ${contractId}...`);
  const llmRes = await callOpenRouterChat({
    messages: [
      { role: 'system', content: 'You are Themis, an autonomous AI legal arbiter. Always respond with raw valid JSON only without commentary.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.25,
    maxTokens: 800
  });

  if (llmRes.success) {
    const parsed = extractJsonFromLlm(llmRes.content);
    if (parsed && typeof parsed.clawbackPercentage === 'number' && parsed.summary) {
      console.log(`[OpenRouter] Real Themis judicial ruling generated via ${llmRes.model} in ${llmRes.latencyMs}ms`);
      return {
        success: true,
        llmPowered: true,
        modelUsed: llmRes.model,
        latencyMs: llmRes.latencyMs,
        tokens: llmRes.tokens,
        ...parsed
      };
    }
  }

  return {
    success: false,
    llmPowered: false,
    reason: llmRes.error || 'Fallback to formula'
  };
}
