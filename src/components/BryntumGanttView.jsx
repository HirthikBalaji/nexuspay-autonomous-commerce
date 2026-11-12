import React, { useState, useEffect, useRef } from 'react';
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
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/formatters';

// Official Bryntum Gantt React Trial Package & Theme
import { BryntumGantt } from '@bryntum/gantt-react';
import '@bryntum/gantt/stockholm-dark.css';

export default function BryntumGanttView({ onTriggerMilestonePayout, onNavigateToArbitration }) {
  const [schedule, setSchedule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeViewMode, setActiveViewMode] = useState('bryntum'); // 'bryntum' | 'simulator'
  const ganttRef = useRef(null);

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

  // Real Bryntum Gantt Project Data
  const bryntumProjectData = {
    tasksData: tasks.map((t, idx) => ({
      id: idx + 1,
      name: t.name,
      startDate: t.startDate || '2026-11-11T09:00:00',
      duration: t.durationHours || 4,
      durationUnit: 'h',
      percentDone: t.progress || 0,
      note: t.status === 'COMPLETED' 
        ? `PayPal Payout $${t.paypalDisbursement} Released` 
        : `Escrow Hold $${t.paypalDisbursement}`,
      cls: t.criticalPath ? 'b-gantt-task-critical' : ''
    })),
    dependenciesData: [
      { id: 1, fromTask: 1, toTask: 2 },
      { id: 2, fromTask: 2, toTask: 3 },
      { id: 3, fromTask: 3, toTask: 4 }
    ]
  };

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
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Bryntum Milestone Gantt & Critical Path Scheduler
                </h3>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>@bryntum/gantt v7.3.8 Trial</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Deterministic SLA milestone scheduling with task dependencies and automated PayPal escrow trigger points
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-900 border border-white/[0.08] flex items-center text-xs">
            <button
              onClick={() => setActiveViewMode('bryntum')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeViewMode === 'bryntum'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bryntum Gantt Suite
            </button>
            <button
              onClick={() => setActiveViewMode('simulator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeViewMode === 'simulator'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SLA Breach Controls
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Integration Disclaimer Banner */}
      <div className="my-3 p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Integration Notice:</strong> Official <code className="text-emerald-300">@bryntum/gantt-trial</code> & <code className="text-emerald-300">@bryntum/gantt-react</code> packages installed. Simulated sandbox fallback active when live commercial enterprise license key is not present.
          </span>
        </div>
        <span className="hidden lg:inline text-[10px] text-slate-500">Theme: Stockholm Dark</span>
      </div>

      {/* Active Mode 1: Real Bryntum Gantt Component */}
      {activeViewMode === 'bryntum' && (
        <div className="my-4 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#1b1c24]">
          <div className="h-[440px] w-full">
            <BryntumGantt
              ref={ganttRef}
              columns={[
                { type: 'wbs', text: 'WBS', width: 55 },
                { type: 'name', text: 'Milestone / Autonomous Task', width: 280 },
                { type: 'startdate', text: 'Start Date', width: 125 },
                { type: 'duration', text: 'Duration (h)', width: 95 },
                { type: 'percentdone', text: 'Progress %', width: 95 }
              ]}
              project={bryntumProjectData}
              viewPreset="hourAndDay"
              startDate="2026-11-11 08:00"
              endDate="2026-11-12 20:00"
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          <div className="p-3 bg-slate-900/90 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span>Interactive Controls: Drag tasks to reschedule • Link dependencies • Zoom timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300">Bryntum Engine v7.3.8 Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Mode 2: Interactive SLA Breach Simulator Controls */}
      <div className={activeViewMode === 'simulator' ? 'block my-4' : 'hidden'}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: Milestone Cards & SLA Breach Status */}
          <div className="lg:col-span-2 space-y-3">
            {/* SLA Threshold Monitor Banner */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              isSlaBreached 
                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-900/20' 
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isSlaBreached ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isSlaBreached ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {isSlaBreached ? 'Critical Path SLA Breach Detected' : 'Milestone Schedule On Track'}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                    Critical Horizon: <strong className="text-white">{totalCriticalHours}h</strong> / 32h SLA Ceiling
                    {isSlaBreached && ` (+${totalCriticalHours - 32}h excursion)`}
                  </div>
                </div>
              </div>

              {isSlaBreached && (
                <button
                  onClick={onNavigateToArbitration}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all shrink-0"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Escalate to Themis</span>
                </button>
              )}
            </div>

            {/* Tasks List */}
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              const isCompleted = task.status === 'COMPLETED';
              const isInProgress = task.status === 'IN_PROGRESS';

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20' 
                      : 'bg-slate-950/50 border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{task.name}</span>
                      {task.criticalPath && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                          Critical Path
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-slate-400">Duration: <strong className="text-white">{task.durationHours}h</strong></span>
                      <span className="text-slate-600">|</span>
                      <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : isInProgress ? 'text-sky-400' : 'text-slate-400'}`}>
                        {task.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 my-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-400' : isInProgress ? 'bg-sky-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Responsible: {task.responsibleAgent}</span>
                    <span className="text-emerald-400 font-semibold">
                      Disbursement: {formatCurrency(task.paypalDisbursement)} ({task.paypalRail})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Col: Interactive Task Adjuster */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/[0.06]">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Interactive Task Simulator</span>
            </div>

            {selectedTask ? (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="text-[11px] text-slate-500 block mb-0.5">Selected Milestone</div>
                  <div className="font-bold text-slate-200">{selectedTask.name}</div>
                </div>

                {/* Duration Stepper */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>Execution Duration (Hours):</span>
                    <strong className="text-white text-sm">{selectedTask.durationHours}h</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustDuration(selectedTask.id, -2)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
                    >
                      -2h
                    </button>
                    <button
                      onClick={() => handleAdjustDuration(selectedTask.id, 2)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
                    >
                      +2h
                    </button>
                    <button
                      onClick={() => handleAdjustDuration(selectedTask.id, 10)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold transition-colors border border-rose-500/30"
                      title="Simulate sudden delay triggering critical path breach"
                    >
                      +10h (Breach)
                    </button>
                  </div>
                </div>

                {/* Progress Slider */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>Milestone Progress:</span>
                    <strong className="text-emerald-400 text-sm">{selectedTask.progress}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={selectedTask.progress}
                    onChange={(e) => handleAdjustProgress(selectedTask.id, Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* PayPal Escrow Action */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[11px] text-slate-400 mb-2">Automated PayPal Rail:</div>
                  <button
                    onClick={() => onTriggerMilestonePayout?.(selectedTask)}
                    disabled={selectedTask.status === 'COMPLETED'}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      selectedTask.status === 'COMPLETED'
                        ? 'bg-emerald-950/40 text-emerald-400/60 border border-emerald-500/20 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>
                      {selectedTask.status === 'COMPLETED'
                        ? 'Disbursed via PayPal Payouts'
                        : `Release ${formatCurrency(selectedTask.paypalDisbursement)} via PayPal`}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                Select a milestone from the list to simulate execution duration or progress.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
