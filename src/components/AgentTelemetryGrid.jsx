import React, { useMemo, useState, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Search, Download, ShieldAlert, CheckCircle, PauseCircle, PlayCircle, Zap, RefreshCw } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * Custom AG Grid Cell Renderer: Risk Gauge
 */
function RiskScoreRenderer(params) {
  const score = params.value || 0;
  let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';

  if (score > 60) {
    colorClass = 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse';
    dotColor = 'bg-red-400';
  } else if (score > 20) {
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400';
  }

  return (
    <div className="flex items-center gap-1.5 h-full">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold border ${colorClass}`}>
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

  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  if (isCompleted) badgeColor = 'bg-emerald-950/40 text-emerald-400 border-emerald-800';
  else if (isArbitrated) badgeColor = 'bg-red-950/40 text-red-400 border-red-800';
  else if (stage.includes('Locked')) badgeColor = 'bg-paypal-light/20 text-paypal-cyan border-paypal-light/30';

  return (
    <div className="flex items-center h-full">
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColor}`}>
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
        className={`p-1 rounded text-xs font-semibold transition-colors ${
          isFrozen 
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
        }`}
      >
        {isFrozen ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
      </button>

      <button
        onClick={() => context.onRowAction(data.id, 'OVERRIDE_RELEASE')}
        title="Manual PayPal Release Override"
        className="p-1 rounded bg-paypal-cyan/10 text-paypal-cyan hover:bg-paypal-cyan/20 transition-colors"
      >
        <Zap className="w-4 h-4" />
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
      cellClass: 'font-mono font-semibold text-emerald-400',
    },
    {
      field: 'milestoneStage',
      headerName: 'Escrow Status',
      width: 160,
      cellRenderer: MilestoneStageRenderer,
    },
    {
      field: 'riskScore',
      headerName: 'AI Risk Gauge',
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
        <span className="font-mono text-xs text-paypal-cyan underline decoration-dotted cursor-pointer">
          {params.value}
        </span>
      ),
    },
    {
      headerName: 'Actions',
      width: 110,
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
    <div id="telemetry-grid-section" className="bg-[#0D1424] border border-slate-800 rounded-2xl p-6 my-6 shadow-xl">
      {/* Grid Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <h3 className="text-lg font-bold text-white">Autonomous Agent Fleet Telemetry</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AG Grid v36 Enterprise Grade
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time streaming ledger of autonomous transactions, risk telemetry, and circuit breaker controls
          </p>
        </div>

        {/* Search & Export Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Filter Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agents, hash, status..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-paypal-cyan w-48 sm:w-64 transition-all"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            title="Export Grid Data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Component */}
      <div className="mt-5 w-full h-[460px]">
        <div className="ag-theme-quartz-dark w-full h-full rounded-xl overflow-hidden shadow-2xl">
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
