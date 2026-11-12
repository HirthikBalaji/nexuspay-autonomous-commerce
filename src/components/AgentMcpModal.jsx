import React, { useState } from 'react';
import { 
  Bot, Terminal, Send, Sparkles, CheckCircle2, ArrowRight, X, 
  ExternalLink, ShieldCheck, DollarSign, Cpu, ShoppingBag, Tag, 
  Layers, ChevronRight, Check
} from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';

const QUICK_PROMPTS = [
  {
    label: '💻 Procure Laptop with High GPU (Best Price)',
    prompt: 'Procure a laptop with high GPU for the best price. Search multiple vendors, negotiate terms, place the payment, and complete the settlement.'
  },
  {
    label: '💰 Disburse $250 Milestone Payout',
    prompt: 'Deliverable verified by Argus-7 CAVE audit. Disburse a $250.00 USD milestone release to vendor-apex-hardware@compute.ai via PayPal Payouts.'
  },
  {
    label: '🔒 Lock $2,200 in Escrow (Orders v2)',
    prompt: 'Atlas and Hermes signed the H100 cluster contract. Initialize a $2,200.00 USD Smart Escrow order via PayPal Orders v2 API.'
  },
  {
    label: '⚖️ Trigger 45% Clawback Refund',
    prompt: 'Latency SLA breach detected (184ms vs 35ms ceiling). Themis ordered a 45% clawback. Execute an automated $990.00 USD refund via PayPal Refund API.'
  }
];

export default function AgentMcpModal({ isOpen, onClose }) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'system',
      text: 'NexusPay Autonomous Agent Terminal initialized. Connected to PayPal Model Context Protocol (MCP) server & OpenRouter Free AI Rails. Ready to execute real multi-vendor procurement and settlements on live US PayPal Sandbox rails ($100,000 liquid balance).'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userEntry = { role: 'user', text };
    setMessages((prev) => [...prev, userEntry]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/paypal/agent-tools/chat', { message: text });
      const data = res.data;

      if (data.isProcurementPipeline && data.pipeline) {
        const pipelineEntry = {
          role: 'pipeline',
          pipeline: data.pipeline,
          telemetry: data.llmTelemetry
        };
        setMessages((prev) => [...prev, pipelineEntry]);
      } else {
        const agentEntry = {
          role: 'agent',
          telemetry: data.llmTelemetry,
          mcpToolCall: data.mcpToolCall,
          executionResult: data.executionResult
        };
        setMessages((prev) => [...prev, agentEntry]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          text: err.response?.data?.error || err.message || 'Error processing MCP tool execution.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#0c0a17] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">NexusPay Autonomous Agent Terminal</h3>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PayPal MCP Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Natural Language Multi-Vendor Procurement &rarr; OpenRouter Negotiation &rarr; Settled PayPal Rails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Prompts */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-white/[0.04] flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Actions:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              disabled={isLoading}
              className={`text-[11px] font-mono px-3 py-1 rounded-lg border transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                idx === 0 
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-200 border-cyan-400/50 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/30'
              }`}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Stream History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-mono text-xs">
          {messages.map((m, idx) => {
            if (m.role === 'system') {
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06] text-slate-400 text-[11px] leading-relaxed flex items-start gap-2.5">
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{m.text}</span>
                </div>
              );
            }

            if (m.role === 'user') {
              return (
                <div key={idx} className="flex justify-end">
                  <div className="max-w-[85%] p-3.5 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-100 text-xs shadow-lg">
                    <div className="text-[9px] uppercase tracking-wider text-cyan-400/80 font-bold mb-1">
                      User Prompt / Agent Mandate
                    </div>
                    {m.text}
                  </div>
                </div>
              );
            }

            if (m.role === 'error') {
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs">
                  ❌ {m.text}
                </div>
              );
            }

            // Role: Pipeline (Full Multi-Vendor Autonomous Procurement)
            if (m.role === 'pipeline') {
              const p = m.pipeline;
              return (
                <div key={idx} className="space-y-4 animate-fade-in">
                  {/* Top Banner: Success & Savings */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-emerald-950/40 border border-cyan-500/40 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Autonomous Multi-Vendor Procurement Complete
                          </h4>
                          <p className="text-[11px] text-emerald-300 font-sans mt-0.5">
                            {p.summary}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          STATUS: COMPLETED
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Negotiated Price:</span>
                        <span className="text-emerald-400 font-bold text-sm">
                          ${p.agreedAmount?.toLocaleString()} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Savings:</span>
                        <span className="text-cyan-400 font-bold text-sm">
                          +${p.totalSavings?.toLocaleString()} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Payment State:</span>
                        <span className="text-emerald-300 font-bold text-xs uppercase flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          COMPLETED
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">OpenRouter LLM:</span>
                        <span className="text-purple-300 font-bold text-xs">
                          {m.telemetry?.model || 'liquid/lfm-2.5b'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sequential Steps Breakdown */}
                  <div className="space-y-3">
                    {p.steps?.map((step) => (
                      <div
                        key={step.stepIndex}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] hover:border-cyan-500/30 transition-all shadow-md"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                              {step.stepIndex}
                            </span>
                            <span className="text-xs font-bold text-white">{step.title}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-400" />
                            {step.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 mt-2 font-sans leading-relaxed">
                          {step.summary}
                        </p>

                        {/* Step 1: Vendor Comparison Cards */}
                        {step.vendorComparison && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {step.vendorComparison.map((v, vIdx) => (
                              <div
                                key={vIdx}
                                className={`p-2.5 rounded-xl border text-[10px] ${
                                  v.vendor === step.selectedVendor
                                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm'
                                    : 'bg-black/40 border-white/[0.04] opacity-75'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span className="text-white">{v.model}</span>
                                  <span className="text-cyan-400">${v.initialPrice?.toLocaleString()}</span>
                                </div>
                                <div className="text-slate-400 mt-0.5">
                                  {v.vendor} • {v.gpu}
                                </div>
                                {v.vendor === step.selectedVendor && (
                                  <div className="mt-1 text-emerald-400 font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Selected Winner: Highest GPU Density
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 2: Negotiation Rounds */}
                        {step.rounds && (
                          <div className="mt-3 space-y-1.5 p-2.5 rounded-xl bg-black/50 border border-white/[0.04]">
                            {step.rounds.map((r, rIdx) => (
                              <div key={rIdx} className="text-[10px] flex items-start gap-2">
                                <span className="text-cyan-400 shrink-0 font-bold">R{r.round}:</span>
                                <div>
                                  <span className="text-amber-300 font-semibold">{r.sender}:</span>{' '}
                                  <span className="text-slate-300">"{r.message}"</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 3: PayPal Order Info */}
                        {step.paypalOrderId && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                            <div>
                              <span className="text-slate-400">Order ID:</span>{' '}
                              <span className="text-cyan-300 font-bold">{step.paypalOrderId}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Capture ID:</span>{' '}
                              <span className="text-cyan-300 font-bold">{step.captureId}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                              Status: COMPLETED
                            </span>
                          </div>
                        )}

                        {/* Step 4: Hardware Attestation */}
                        {step.attestation && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[10px] space-y-1">
                            <div>
                              <span className="text-slate-400">Verified Serial:</span>{' '}
                              <span className="text-purple-300 font-bold">{step.attestation.serialNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Carrier AirWayBill:</span>{' '}
                              <span className="text-slate-300">{step.attestation.carrierTracking}</span>
                            </div>
                            <div className="truncate">
                              <span className="text-slate-400">Merkle Root:</span>{' '}
                              <span className="text-emerald-300 font-mono">{step.attestation.merkleRoot}</span>
                            </div>
                          </div>
                        )}

                        {/* Step 5: Final Settlement Info */}
                        {step.payoutBatchId && (
                          <div className="mt-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Settlement Payout Batch ID:</span>
                              <span className="text-emerald-300 font-bold text-xs">{step.payoutBatchId}</span>
                              <span className="text-slate-400 block text-[10px] mt-0.5">
                                Disbursed to: {step.receiverEmail}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs">
                                STATUS: COMPLETED
                              </span>
                              {step.paypalResourceUrl && (
                                <a
                                  href={step.paypalResourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 underline underline-offset-2"
                                >
                                  <span>View Receipt</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Standard Agent MCP Tool Response
            return (
              <div key={idx} className="space-y-2.5 animate-fade-in">
                {/* Agent Thought & Telemetry */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[10px]">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Autonomous LLM Reasoning Trace</span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-2">
                      <span className="text-emerald-400">{m.telemetry?.model}</span>
                      <span>({m.telemetry?.latencyMs}ms)</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs mt-2 italic">
                    "{m.mcpToolCall?.agentThought}"
                  </p>

                  {/* Tool Call Invocation JSON */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-black/60 border border-white/[0.04]">
                    <div className="text-[9px] uppercase tracking-wider text-amber-400 font-bold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> MCP Tool Invocation &rarr; {m.mcpToolCall?.tool}
                    </div>
                    <pre className="text-[10px] text-amber-200/90 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(m.mcpToolCall?.arguments, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* PayPal Execution Receipt */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PayPal Rails Settlement Executed</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      STATUS: COMPLETED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">PayPal Batch / Order ID:</span>
                      <span className="text-emerald-300 font-bold text-xs">
                        {m.executionResult?.batch_header?.payout_batch_id || m.executionResult?.id || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Settled Amount:</span>
                      <span className="text-white font-bold text-xs">
                        ${m.mcpToolCall?.arguments?.amount} {m.mcpToolCall?.arguments?.currency || 'USD'}
                      </span>
                    </div>
                  </div>

                  {m.executionResult?.links?.[0]?.href && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Auditable PayPal Sandbox Resource:</span>
                      <a
                        href={m.executionResult.links[0].href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>View Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center gap-3 text-cyan-400 animate-pulse">
              <Bot className="w-4 h-4 animate-spin" />
              <span className="text-xs">
                Autonomous Procurement Pipeline active: Searching multiple vendors, negotiating price via OpenRouter LLM, and executing PayPal settlement...
              </span>
            </div>
          )}
        </div>

        {/* Prompt Input Form */}
        <div className="p-4 bg-slate-900/90 border-t border-white/[0.08]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g. Procure a laptop with high GPU for the best price..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-black/60 border border-white/[0.1] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
