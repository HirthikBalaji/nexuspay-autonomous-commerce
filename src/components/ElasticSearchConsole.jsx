import React, { useState, useEffect } from 'react';
import { Search, Database, AlertTriangle, FileText, CheckCircle2, Terminal, Filter, Zap } from 'lucide-react';
import axios from 'axios';
import { formatRelativeTime } from '../utils/formatters';

export default function ElasticSearchConsole() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('all');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    executeSearch();
  }, [selectedIndex]);

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
    <div className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 my-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Elastic Telemetry & Anomaly Intelligence
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Elasticsearch DSL
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-text, vector search & anomaly scoring across agent negotiation contracts and SLA telemetry
              </p>
            </div>
          </div>
        </div>

        {results && (
          <div className="flex items-center gap-3 text-xs font-mono text-cyan-300 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/50">
            <span>Query Took: {results.tookMs}ms</span>
            <span className="text-slate-600">|</span>
            <span>Hits: {results.hits?.total?.value || 0}</span>
            <span className="text-slate-600">|</span>
            <span>Shards: {results._shards?.successful}/{results._shards?.total}</span>
          </div>
        )}
      </div>

      {/* Search Input Bar & Index Selector */}
      <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
            placeholder="Search Elastic logs, e.g. 'sla-breach', 'latency', 'H100'..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(e.target.value)}
          className="w-full sm:w-auto px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
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
          {isSearching ? 'Searching...' : 'Elastic Query'}
        </button>
      </div>

      {/* Quick Search Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 font-mono">
        <span className="text-slate-500 shrink-0">Quick Queries:</span>
        {['sla-breach', 'H100 NVLink', 'paypal-v1', 'themis-arbitration', 'fuzzing'].map((tag) => (
          <button
            key={tag}
            onClick={() => handleQuickSearch(tag)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 border border-slate-700"
          >
            "{tag}"
          </button>
        ))}
      </div>

      {/* Elastic Results List */}
      <div className="mt-5 space-y-3">
        {results?.hits?.hits?.map((hit) => {
          const doc = hit._source;
          const isHighAnomaly = doc.anomalyScore > 0.6;

          return (
            <div
              key={hit._id}
              className={`p-4 rounded-xl border transition-all ${
                isHighAnomaly
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                  : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{doc.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    index: {hit._index}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-slate-400">Score: {hit._score}</span>
                  <span className="text-slate-600">|</span>
                  <span className={`font-bold ${isHighAnomaly ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    Anomaly: {(doc.anomalyScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {doc.content}
              </p>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
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
