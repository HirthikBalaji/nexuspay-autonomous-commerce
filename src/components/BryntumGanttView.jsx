import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, DollarSign, Calendar, Layers, ShieldCheck, Zap, Check } from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';

export default function BryntumGanttView({ onTriggerMilestonePayout }) {
  const [schedule, setSchedule] = useState(null);
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
        setSelectedTask(res.data.tasks[0]);
      }
    } catch (err) {
      console.warn('Failed to load Bryntum schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const tasks = schedule?.tasks || [];

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
                  Bryntum Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Deterministic SLA milestone scheduling with automated PayPal escrow trigger points
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Critical Path: 32h SLA Horizon</span>
        </div>
      </div>

      {/* Gantt Interactive Table & Chart Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task List / Data Grid (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Milestone Dependencies & Payouts:
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
                    <span className="font-mono text-emerald-400 font-semibold">{task.progress}% done</span>
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
              <span>Day 1 (09:00 - 21:00)</span>
              <span>Day 2 (09:00 - 21:00)</span>
              <span>Final Signoff</span>
            </div>

            {/* Visual Gantt Bars */}
            <div className="mt-5 space-y-6">
              {tasks.map((task, idx) => {
                const isSelected = selectedTask?.id === task.id;
                let leftPercent = idx === 0 ? '5%' : idx === 1 ? '25%' : idx === 2 ? '65%' : '85%';
                let widthPercent = idx === 0 ? '20%' : idx === 1 ? '40%' : idx === 2 ? '20%' : '12%';

                return (
                  <div key={task.id} className="relative h-10 flex items-center">
                    <div className="absolute inset-0 bg-slate-900/40 rounded-xl border border-white/[0.04]"></div>

                    {/* Gantt Task Bar */}
                    <div
                      className={`absolute h-7 rounded-lg px-2.5 flex items-center justify-between transition-all font-mono text-[11px] font-semibold text-white shadow-lg cursor-pointer ${
                        task.status === 'COMPLETED'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-500 animate-pulse'
                          : 'bg-gradient-to-r from-slate-700 to-slate-600 opacity-70'
                      } ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
                      style={{ left: leftPercent, width: widthPercent }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <span className="truncate">{task.id}</span>
                      <span className="text-[10px] opacity-90">{task.durationHours}h</span>
                    </div>

                    {/* Dependency Connector Line */}
                    {idx < tasks.length - 1 && (
                      <div className="absolute -bottom-3 right-1/4 w-0.5 h-3 bg-emerald-500/40 z-10"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Task Details & PayPal Trigger */}
          {selectedTask && (
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-white/[0.04]">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{selectedTask.name}</span>
                  <span className="text-emerald-400 font-mono">{formatCurrency(selectedTask.paypalDisbursement)}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Assigned: {selectedTask.responsibleAgent} • Rail: {selectedTask.paypalRail}
                </div>
              </div>

              {selectedTask.status !== 'COMPLETED' && (
                <button
                  onClick={() => onTriggerMilestonePayout?.(selectedTask)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Release via PayPal</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
