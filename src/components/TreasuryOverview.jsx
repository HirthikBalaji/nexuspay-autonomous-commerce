import React from 'react';
import { DollarSign, Shield, Activity, TrendingUp, Scale } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function TreasuryOverview({ treasury }) {
  const stats = [
    {
      title: 'Active Escrow Locked',
      value: formatCurrency(treasury?.totalEscrowLocked || 4100),
      subtitle: 'Secured via PayPal Orders v2 Vault',
      icon: DollarSign,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      badge: '+18.4% 24h'
    },
    {
      title: 'Settled Payout Volume',
      value: formatCurrency(treasury?.totalSettledVolume || 18450),
      subtitle: 'Disbursed via PayPal Payouts v1',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: '0.25s Speed'
    },
    {
      title: 'Liquid Reserve Pool',
      value: formatCurrency(treasury?.liquidVaultBalance || 84520),
      subtitle: 'Autonomous Treasury Liquidity Pool',
      icon: Shield,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badge: '100% Solvent'
    },
    {
      title: 'Arbitration Win Rate',
      value: treasury?.arbitrationWinRate || '94.2%',
      subtitle: 'Enforced by Themis AI Arbiter',
      icon: Scale,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      badge: 'Zero Human Lag'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0D1424]/90 border border-white/[0.07] hover:border-white/15 transition-all duration-200 shadow-lg relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-white/[0.06]">
                {stat.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono tracking-tight text-white">
                {stat.value}
              </div>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 font-normal">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
