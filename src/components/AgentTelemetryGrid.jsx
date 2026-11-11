import React, { useMemo, useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Search, Download, PauseCircle, PlayCircle, Zap, Shield, Sparkles } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Custom AG Grid Cell Renderer: Risk Gauge
 */
function RiskScoreRenderer(params) {
  const score = params.value || 0;
  let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let dotColor = 'bg-emerald-400';

  if (score > 60) {
    colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
    dotColor = 'bg-rose-400';
  } else if (score > 20) {
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    dotColor = 'bg-amber-400';
  }

  return (
    <div className="flex items-center gap-1.5 h-full">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        {score}/100
      </span>
    </div>
  );
}

/**
 * Custom AG Grid Cell Renderer: Milestone / Stage
 */
function MilestoneStageRenderer(params) {
  const stage = params.value || 'Pending';
  const isCompleted = stage === 'Completed';
  const isArbitrated = stage.includes('Arbitration') || stage.includes('Refunded');

  let badgeColor = 'bg-slate-800/80 text-slate-300 border-white/[0.06]';
  if (isCompleted) badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  else if (isArbitrated) badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  else if (stage.includes('Locked')) badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';

  return (
    <div className="flex items-center h-full">
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeColor}`}>
        {stage}
      </span>
    </div>
  );
}

/**
 * Custom AG Grid Cell Renderer: Actions (Freeze, Release)
 */
function ActionCellRenderer(params) {
  const { data, context } = params;
  if (!data) return null;

  const isFrozen = data.agentStatus === 'FROZEN' || data.agentStatus === 'PAUSED';

  return (
    <div className="flex items-center gap-1.5 h-full">
      <button
        onClick={() => context.onRowAction(data.id, isFrozen ? 'UNFREEZE' : 'FREEZE_AGENT')}
        title={isFrozen ? 'Unfreeze Agent' : 'Emergency Freeze Agent'}
        className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
          isFrozen 
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
            : 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
        }`}
      >
        {isFrozen ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={() => context.onRowAction(data.id, 'OVERRIDE_RELEASE')}
        title="Manual PayPal Release Override"
        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
      >
        <Zap className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function AgentTelemetryGrid({ transactions, onRowAction }) {
  const gridRef = useRef(null);
  const [quickFilterText, setQuickFilterText] = useState('');

  // Column definitions
  const columnDefs = useMemo(() => [
    {
      field: 'id',
      headerName: 'Txn Hash',
      width: 140,
      pinned: 'left',
      cellRenderer: (params) => (
        <span className="font-mono text-xs font-semibold text-slate-300">
          {params.value}
        </span>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 110,
      valueFormatter: (params) => formatRelativeTime(params.value),
      cellStyle: { color: '#94a3b8', fontSize: '12px' }
    },
    {
      field: 'buyerAgent',
      headerName: 'Buyer Agent',
      width: 180,
      cellRenderer: (params) => (
        <span className="font-medium text-xs text-white">
          {params.value}
        </span>
      ),
    },
    {
      field: 'supplierAgent',
      headerName: 'Supplier Agent',
      width: 180,
      cellRenderer: (params) => (
        <span className="font-medium text-xs text-indigo-300">
          {params.value}
        </span>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 170,
      cellStyle: { color: '#cbd5e1', fontSize: '12px' }
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value),
      cellClass: 'font-mono font-bold text-emerald-400',
    },
    {
      field: 'milestoneStage',
      headerName: 'Escrow Status',
      width: 160,
      cellRenderer: MilestoneStageRenderer,
    },
    {
      field: 'riskScore',
      headerName: 'Risk Gauge',
      width: 130,
      cellRenderer: RiskScoreRenderer,
    },
    {
      field: 'slaHealth',
      headerName: 'SLA Telemetry',
      width: 120,
      cellRenderer: (params) => (
        <span className="font-mono text-xs text-slate-300">
          {params.value}%
        </span>
      ),
    },
    {
      field: 'paypalReference',
      headerName: 'PayPal Ref',
      width: 160,
      cellRenderer: (params) => (
        <span className="font-mono text-xs text-sky-400 underline decoration-dotted cursor-pointer">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Actions',
      width: 100,
      pinned: 'right',
      cellRenderer: ActionCellRenderer,
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const handleExportCsv = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `NexusPay_Agentic_Telemetry_${Date.now()}.csv`
      });
    }
  }, []);

  return (
    <div id="telemetry-grid-section" className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Grid Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h3 className="text-base font-bold text-white">Autonomous Agent Fleet Telemetry</h3>
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              AG Grid v36
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-normal">
            Real-time streaming ledger of autonomous transactions, risk telemetry, and circuit breaker controls
          </p>
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Filter Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter agents, hash, status..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900/90 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-44 sm:w-56 transition-all"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            title="Export Grid Data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="mt-4 w-full h-[460px]">
        <div className="ag-theme-quartz-dark w-full h-full rounded-2xl overflow-hidden shadow-2xl">
          <AgGridReact
            ref={gridRef}
            rowData={transactions}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilterText}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            context={{ onRowAction }}
            rowHeight={46}
            headerHeight={42}
          />
        </div>
      </div>
    </div>
  );
}
