import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Database, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  Filter, 
  Zap,
  Sparkles,
  Info,
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { formatRelativeTime } from '../utils/formatters';

export default function ElasticSearchConsole() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('all');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [elasticStatus, setElasticStatus] = useState(null);
  const [showDslDrawer, setShowDslDrawer] = useState(false);

  useEffect(() => {
    fetchElasticStatus();
    executeSearch();
  }, [selectedIndex]);

  const fetchElasticStatus = async () => {
    try {
      const res = await axios.get('/api/elastic/status');
      setElasticStatus(res.data);
    } catch (err) {
      console.warn('Failed to fetch Elastic status:', err);
    }
  };

  const executeSearch = async (searchTerm = query) => {
    setIsSearching(true);
    try {
      const res = await axios.post('/api/elastic/search', {
        query: searchTerm,
        index: selectedIndex
      });
      setResults(res.data);
    } catch (err) {
      console.warn('Elastic search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Elasticsearch Telemetry & Dense Vector Anomaly Intelligence
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>@elastic/elasticsearch v9.5.1</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Dense vector kNN search (1,536-dimensional embeddings) & exact Cosine Similarity anomaly detection across agent telemetry
              </p>
            </div>
          </div>
        </div>

        {results && (
          <div className="flex items-center gap-3 text-xs font-mono text-cyan-300 bg-cyan-950/20 px-3 py-1.5 rounded-xl border border-cyan-800/40">
            <span>Query: {results.tookMs}ms</span>
            <span className="text-slate-600">|</span>
            <span>Hits: {results.hits?.total?.value || 0}</span>
            <span className="text-slate-600">|</span>
            <span>Dim: {results.vectorDimensions || 1536}</span>
          </div>
        )}
      </div>

      {/* Transparent Integration Disclaimer Banner */}
      <div className="my-3 p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Integration Notice:</strong> {results?.statusNote || 'Simulated sandbox fallback when live credentials are not present.'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-cyan-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Metric: Cosine Similarity (kNN)</span>
        </div>
      </div>

      {/* Search Input Bar & Index Selector */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
            placeholder="Search Elastic logs, e.g. 'sla-breach', 'latency', 'H100'..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="w-full sm:w-auto px-3 py-2.5 bg-slate-900/90 border border-white/[0.08] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
        >
          <option value="all">Index: All Shards</option>
          <option value="nexus-agent-contracts">nexus-agent-contracts</option>
          <option value="nexus-sla-telemetry">nexus-sla-telemetry</option>
          <option value="nexus-paypal-payouts">nexus-paypal-payouts</option>
        </select>

        <button
          onClick={() => executeSearch()}
          disabled={isSearching}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-md shadow-cyan-600/20"
        >
          {isSearching ? 'Embedding...' : 'Vector Search'}
        </button>
      </div>

      {/* Quick Search Chips & DSL Toggle */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-2 overflow-x-auto text-slate-400">
          <span className="text-slate-500 shrink-0">Quick Queries:</span>
          {['sla-breach', 'H100 NVLink', 'paypal-v1', 'themis-arbitration', 'fuzzing'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickSearch(tag)}
              className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0 border border-white/[0.04]"
            >
              "{tag}"
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowDslDrawer(!showDslDrawer)}
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showDslDrawer ? 'Hide Query DSL' : 'View Elasticsearch DSL'}</span>
          {showDslDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dense Vector Preview Pill */}
      {results?.queryVectorPreview && (
        <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-2">
          <span className="text-cyan-400 font-bold">Query Dense Vector (1,536-dim):</span>
          <span className="text-slate-300 truncate max-w-xl">
            [{results.queryVectorPreview.map(v => v.toFixed(4)).join(', ')}, ...]
          </span>
        </div>
      )}

      {/* Expandable Elasticsearch Query DSL Drawer */}
      {showDslDrawer && results?.dsl && (
        <div className="mt-3 p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-xs font-mono text-cyan-200">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Elasticsearch Query DSL Payload (POST /nexus-*/_search)</span>
          </div>
          <pre className="overflow-x-auto text-[11px] text-slate-300 p-2 rounded bg-slate-950 border border-white/[0.04]">
            {JSON.stringify(results.dsl, null, 2)}
          </pre>
        </div>
      )}

      {/* Elastic Results List */}
      <div className="mt-5 space-y-3">
        {results?.hits?.hits?.map((hit) => {
          const doc = hit._source;
          const isHighAnomaly = doc.anomalyScore > 0.6;

          return (
            <div
              key={hit._id}
              className={`p-4 rounded-2xl border transition-all ${
                isHighAnomaly
                  ? 'bg-rose-950/15 border-rose-500/30 shadow-sm'
                  : 'bg-[#0A0F1D] border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{doc.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 border border-white/[0.04]">
                    {hit._index}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  {typeof hit.cosineSimilarity === 'number' && (
                    <>
                      <span className="text-cyan-400 font-semibold">
                        Cosine Sim: {(hit.cosineSimilarity * 100).toFixed(1)}%
                      </span>
                      <span className="text-slate-600">|</span>
                    </>
                  )}
                  <span className="text-slate-400">Score: {hit._score}</span>
                  <span className="text-slate-600">|</span>
                  <span className={`font-bold ${isHighAnomaly ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    Anomaly: {(doc.anomalyScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-normal">
                {doc.content}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.04]">
                <div className="flex gap-1.5 flex-wrap">
                  {doc.tags.map((t) => (
                    <span key={t} className="text-slate-500">#{t}</span>
                  ))}
                </div>
                <span>{formatRelativeTime(doc.timestamp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
