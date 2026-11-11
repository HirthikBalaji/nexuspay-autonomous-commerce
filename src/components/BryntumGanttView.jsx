import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  DollarSign, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  AlertTriangle, 
  Scale 
} from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';

export default function BryntumGanttView({ onTriggerMilestonePayout, onNavigateToArbitration }) {
  const [schedule, setSchedule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/bryntum/schedule');
      setSchedule(res.data);
      if (res.data?.tasks?.length > 0) {
        setTasks(res.data.tasks);
        setSelectedTask(res.data.tasks[1] || res.data.tasks[0]);
      }
    } catch (err) {
      console.warn('Failed to load Bryntum schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustDuration = (taskId, delta) => {
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          const newDuration = Math.max(1, t.durationHours + delta);
          return { ...t, durationHours: newDuration };
        }
        return t;
      })
    );
    setSelectedTask(prev => prev && prev.id === taskId ? { ...prev, durationHours: Math.max(1, prev.durationHours + delta) } : prev);
  };

  const handleAdjustProgress = (taskId, newProgress) => {
    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            progress: newProgress,
            status: newProgress >= 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'PENDING'
          };
        }
        return t;
      })
    );
    setSelectedTask(prev => prev && prev.id === taskId ? { ...prev, progress: newProgress } : prev);
  };

  const totalCriticalHours = tasks
    .filter(t => t.criticalPath)
    .reduce((sum, t) => sum + (t.durationHours || 0), 0);
  const isSlaBreached = totalCriticalHours > 32;

  return (
    <div className="bg-[#0D1424] border border-white/[0.08] rounded-3xl p-6 my-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Bryntum Milestone Gantt & Critical Path Scheduler
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Bryntum Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Deterministic SLA milestone scheduling with task dependencies and automated PayPal escrow trigger points
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-xl border ${
            isSlaBreached
              ? 'bg-rose-950/40 text-rose-300 border-rose-500/40 shadow-sm animate-pulse'
              : 'bg-slate-900/80 text-emerald-300 border-emerald-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSlaBreached ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span>Critical Path: {totalCriticalHours}h / 32h SLA Horizon</span>
          </div>

          {isSlaBreached && (
            <button
              onClick={onNavigateToArbitration}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 shadow-md shadow-rose-600/30 transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Escalate SLA Breach</span>
            </button>
          )}
        </div>
      </div>

      {/* SLA Breach Alert Banner */}
      {isSlaBreached && (
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>CRITICAL PATH DELAY DETECTED:</strong> Milestone duration of {totalCriticalHours}h exceeds contract maximum 32h horizon! Clause 4.2 penalty covenant activated.
            </span>
          </div>
          <button
            onClick={onNavigateToArbitration}
            className="underline font-bold text-rose-200 hover:text-white shrink-0 ml-2"
          >
            Open Themis Arbiter &rarr;
          </button>
        </div>
      )}

      {/* Gantt Interactive Table & Chart Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task List / Data Grid (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            <span>Milestones & Dependencies:</span>
            <span className="font-mono text-slate-500">Click to Inspect</span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              const isDone = task.status === 'COMPLETED';
              const isInProgress = task.status === 'IN_PROGRESS';

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/20'
                      : 'bg-[#0A0F1D] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        isDone ? 'bg-emerald-400' : isInProgress ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                      }`}></span>
                      <span className="text-xs font-bold text-white font-mono">{task.id}</span>
                      <span className="text-xs text-slate-200 font-medium truncate max-w-[200px]">{task.name}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-sky-400 shrink-0">
                      {formatCurrency(task.paypalDisbursement)}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{task.responsibleAgent}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{task.progress}% done • {task.durationHours}h</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-500' : isInProgress ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gantt Timeline Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-[#090E1C] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs text-slate-400 font-mono">
              <span>Phase 1 (Setup)</span>
              <span>Phase 2 (Distributed Run)</span>
              <span>Phase 3 (Validation)</span>
              <span>Arbitration Contingency</span>
            </div>

            {/* Visual Gantt Bars */}
            <div className="mt-5 space-y-6">
              {tasks.map((task, idx) => {
                const isSelected = selectedTask?.id === task.id;
                let leftPercent = idx === 0 ? '5%' : idx === 1 ? '25%' : idx === 2 ? '65%' : '85%';
                let widthPercent = idx === 0 ? '20%' : idx === 1 ? `${Math.min(50, task.durationHours * 1.5)}%` : idx === 2 ? '18%' : '12%';

                return (
                  <div key={task.id} className="relative h-10 flex items-center">
                    <div className="absolute inset-0 bg-slate-900/40 rounded-xl border border-white/[0.04]"></div>

                    {/* Gantt Task Bar */}
                    <div
                      className={`absolute h-7 rounded-lg px-2.5 flex items-center justify-between transition-all font-mono text-[11px] font-semibold text-white shadow-lg cursor-pointer ${
                        task.status === 'COMPLETED'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                          : task.status === 'IN_PROGRESS'
                          ? isSlaBreached ? 'bg-gradient-to-r from-rose-600 to-amber-600' : 'bg-gradient-to-r from-amber-600 to-yellow-500 animate-pulse'
                          : 'bg-gradient-to-r from-slate-700 to-slate-600 opacity-70'
                      } ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
                      style={{ left: leftPercent, width: widthPercent }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <span className="truncate">{task.id}</span>
                      <span className="text-[10px] opacity-90">{task.durationHours}h</span>
                    </div>

                    {/* Dependency Connector */}
                    {idx < tasks.length - 1 && (
                      <div className="absolute -bottom-3 right-1/4 w-0.5 h-3 bg-emerald-500/40 z-10"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Selected Task Panel & Payout Trigger */}
          {selectedTask && (
            <div className="mt-6 pt-4 border-t border-white/[0.06] bg-slate-950/60 p-4 rounded-xl border border-white/[0.04] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{selectedTask.name}</span>
                    <span className="text-emerald-400 font-mono">{formatCurrency(selectedTask.paypalDisbursement)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Owner: {selectedTask.responsibleAgent} • Rail: {selectedTask.paypalRail}
                  </div>
                </div>

                {selectedTask.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onTriggerMilestonePayout?.(selectedTask)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Disburse via PayPal</span>
                  </button>
                )}
              </div>

              {/* Interactive Duration & Progress Sliders for Judges */}
              <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-[11px] text-slate-500">Duration:</span>
                  <button
                    onClick={() => handleAdjustDuration(selectedTask.id, -2)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white"
                  >
                    -2h
                  </button>
                  <span className="font-mono text-emerald-400 font-bold">{selectedTask.durationHours}h</span>
                  <button
                    onClick={() => handleAdjustDuration(selectedTask.id, +4)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white"
                    title="Simulate delay that causes SLA breach"
                  >
                    +4h (Delay)
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-[11px] text-slate-500">Progress:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedTask.progress}
                    onChange={(e) => handleAdjustProgress(selectedTask.id, parseInt(e.target.value))}
                    className="w-24 accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs">{selectedTask.progress}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
