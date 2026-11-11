import React, { useState, useEffect } from 'react';
import { ShoppingCart, Cpu, Shield, Database, Radio, ArrowRight, Zap, CheckCircle2, DollarSign } from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';

export default function Channel3Catalog({ onDispatchRfq }) {
  const [catalog, setCatalog] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/channel3/catalog');
      if (res.data?.items) {
        setCatalog(res.data.items);
        setSelectedItem(res.data.items[0]);
      }
    } catch (err) {
      console.warn('Failed to load Channel3 catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    if (category.includes('Infrastructure') || category.includes('GPU')) return Cpu;
    if (category.includes('Security')) return Shield;
    if (category.includes('Financial')) return Radio;
    return Database;
  };

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Channel3 AI Agent Commerce & Compute Catalog
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Channel3 Feed
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Real-time inventory discovery for autonomous procurement agents with instant PayPal escrow dispatch
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/20 px-3 py-1.5 rounded-xl border border-purple-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span>4 Verified Compute Suppliers</span>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {catalog.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const isSelected = selectedItem?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/15 border-purple-500/50 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/20'
                  : 'bg-[#0A0F1D] border-white/[0.06] hover:border-white/15'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 border border-purple-500/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.vendor} • <span className="text-purple-400">{item.category}</span></p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                    ${item.spotPricePerHour}/hr
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 font-normal line-clamp-2">
                  SLA: <span className="font-mono text-slate-400">{item.slaGuarantee}</span>
                </p>

                {/* Specs Pill List */}
                <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                  {Object.entries(item.specs).map(([k, v]) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/[0.04]">
                      {k}: <span className="text-slate-200">{v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Trust:</span>
                  <span className="text-emerald-400 font-bold">{item.trustScore}/100</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">Est. Escrow:</span>
                  <span className="text-sky-400 font-bold">{formatCurrency(item.estimatedContractBudget)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDispatchRfq(item);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Zap className="w-3 h-3" />
                  <span>Dispatch RFQ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
