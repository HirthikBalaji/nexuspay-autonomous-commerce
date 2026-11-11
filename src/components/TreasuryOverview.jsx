import React from 'react';
import { DollarSign, Shield, Activity, TrendingUp, Users, Scale, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function TreasuryOverview({ treasury }) {
  const stats = [
    {
      title: 'Active Escrow Locked',
      value: formatCurrency(treasury?.totalEscrowLocked || 4100),
      subtitle: 'Secured via PayPal Orders v2 Vault',
      icon: DollarSign,
      color: 'from-paypal-cyan to-blue-500',
      badge: '+18.4% 24h'
    },
    {
      title: 'Settled Payout Volume',
      value: formatCurrency(treasury?.totalSettledVolume || 18450),
      subtitle: 'Released via PayPal Payouts v1',
      icon: TrendingUp,
      color: 'from-emerald-400 to-teal-500',
      badge: 'Instant 0.25s'
    },
    {
      title: 'Liquid Reserve Vault',
      value: formatCurrency(treasury?.liquidVaultBalance || 84520),
      subtitle: 'Autonomous Treasury Liquidity Pool',
      icon: Shield,
      color: 'from-paypal-light to-indigo-500',
      badge: 'Solvent'
    },
    {
      title: 'Arbitration Win Rate',
      value: treasury?.arbitrationWinRate || '94.2%',
      subtitle: 'Enforced by Themis AI Arbiter',
      icon: Scale,
      color: 'from-purple-400 to-pink-500',
      badge: 'Zero Human Lag'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0D1424] border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-lg hover:shadow-paypal-light/10 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-paypal-cyan border border-slate-700">
                {stat.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black font-mono tracking-tight text-white">
                {stat.value}
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 text-white shadow-md`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              {stat.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
