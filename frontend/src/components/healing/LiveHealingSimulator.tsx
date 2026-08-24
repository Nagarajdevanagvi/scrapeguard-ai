import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { HealingStage } from '../../types';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Search,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Code2,
  Check,
  Loader2,
} from 'lucide-react';

export interface LiveHealingSimulatorProps {
  onSimulationComplete?: () => void;
}

export const LiveHealingSimulator: React.FC<LiveHealingSimulatorProps> = ({
  onSimulationComplete,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(4); // default 4 = completed
  const [simulatedHealth, setSimulatedHealth] = useState(97.8);
  const [scenario, setScenario] = useState<'location' | 'company' | 'salary'>('location');
  const [simLogs, setSimLogs] = useState<string[]>([
    '[INIT] ScrapeGuard AI autonomous sentinel active.',
    '[MONITOR] 248 records extracted from cutshort.io. Quality optimal (98.7%).',
  ]);

  const steps: { stage: HealingStage; title: string; desc: string; health: number }[] = [
    {
      stage: 'detect',
      title: 'Detecting Anomaly...',
      desc: 'Null-rate spiked on location field after Cutshort DOM modification. Health dropped to 42.1%.',
      health: 42.1,
    },
    {
      stage: 'diagnose',
      title: 'Diagnosing DOM Shift...',
      desc: 'Bright Data Web Unlocker probe identified `.job-location-tag` selector changed to nested `.company-meta-badge[data-type="location"]`.',
      health: 42.1,
    },
    {
      stage: 'heal',
      title: 'Synthesizing Repair Recipe...',
      desc: 'Bright Data Scraper Studio generated fallback extraction recipe with DOM attribute selector.',
      health: 65.0,
    },
    {
      stage: 'validate',
      title: 'Validating in Sandbox...',
      desc: 'Running 100 golden test cases against live Cutshort URLs. Conformance check: 100/100 valid.',
      health: 89.4,
    },
    {
      stage: 'recover',
      title: 'Pipeline Recovered ✓',
      desc: 'Hot-swapped production collector recipe. Backfilled degraded records. Health restored to 97.8%.',
      health: 97.8,
    },
  ];

  const handleStartSimulation = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setSimulatedHealth(42.1);
    setSimLogs([
      `[${new Date().toLocaleTimeString()}] [DETECT] Anomaly detected in cutshort.io collector c_demo_cutshort`,
      `[${new Date().toLocaleTimeString()}] [DETECT] Location field null-rate surged to 57.9%. Pipeline health plunged to 42.1%!`,
    ]);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (currentStepIndex === 0) {
        // move to diagnose
        setCurrentStepIndex(1);
        setSimLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [DIAGNOSE] AST analyzer inspecting live HTML structure`,
          `[${new Date().toLocaleTimeString()}] [DIAGNOSE] Identified selector break: span.job-location-tag missing`,
          `[${new Date().toLocaleTimeString()}] [DIAGNOSE] Found new container: div.company-meta-badge[data-type="location"] (Confidence: 98%)`,
        ]);
      } else if (currentStepIndex === 1) {
        // move to heal
        setCurrentStepIndex(2);
        setSimulatedHealth(65.0);
        setSimLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [HEAL] Requesting recipe patch from Bright Data Scraper Studio`,
          `[${new Date().toLocaleTimeString()}] [HEAL] Generated patch v2.4.1 with multi-selector fallback and regex match`,
        ]);
      } else if (currentStepIndex === 2) {
        // move to validate
        setCurrentStepIndex(3);
        setSimulatedHealth(89.4);
        setSimLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [VALIDATE] Dispatched sandbox worker with 100 test URLs`,
          `[${new Date().toLocaleTimeString()}] [VALIDATE] Contract check: 100/100 records conformant to JSON Schema (0 errors)`,
        ]);
      } else if (currentStepIndex === 3) {
        // move to recover
        setCurrentStepIndex(4);
        setSimulatedHealth(97.8);
        setIsRunning(false);
        setSimLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] [RECOVER] Collector recipe hot-swapped in production`,
          `[${new Date().toLocaleTimeString()}] [RECOVER] Backfill completed for 134 records`,
          `[${new Date().toLocaleTimeString()}] [RECOVER] Pipeline health restored to 97.8%. System fully operational!`,
        ]);
        if (onSimulationComplete) onSimulationComplete();
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, onSimulationComplete]);

  return (
    <Card className="border-cyan-500/40 bg-slate-900/90 space-y-6">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive Self-Healing Simulator</span>
            </CardTitle>
            <Badge variant="purple" size="sm">
              Live Hackathon Demo Mode
            </Badge>
          </div>
          <CardDescription>
            Simulate a real-world DOM breakdown on Cutshort and watch ScrapeGuard AI trigger autonomous healing.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleStartSimulation}
            isLoading={isRunning}
            leftIcon={isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          >
            {isRunning ? 'Simulation Running...' : 'Execute Live Healing Demo'}
          </Button>
        </div>
      </CardHeader>

      {/* Progress & Live Health Dial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              {isRunning && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
              {steps[currentStepIndex].title}
            </span>
            <span className="text-cyan-400 font-bold">
              Step {currentStepIndex + 1} of 5
            </span>
          </div>

          <Progress
            value={((currentStepIndex + 1) / 5) * 100}
            variant="cyan"
            height="md"
          />

          <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
            {steps[currentStepIndex].desc}
          </p>
        </div>

        {/* Live Health Gauge */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Pipeline Health Gauge
          </span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono transition-colors duration-300 ${
                simulatedHealth >= 90
                  ? 'text-emerald-400'
                  : simulatedHealth >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {simulatedHealth.toFixed(1)}%
            </span>
            <span className="text-xs font-mono text-slate-400">SLA state</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-800 pt-1.5">
            <span>Target: Cutshort.io</span>
            <span className={simulatedHealth >= 90 ? 'text-emerald-400' : 'text-rose-400'}>
              {simulatedHealth >= 90 ? 'Optimal' : 'Degraded'}
            </span>
          </div>
        </div>
      </div>

      {/* Step Indicators Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
        {steps.map((step, idx) => {
          const isDone = currentStepIndex >= idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <div
              key={step.stage}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                isCurrent
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
                  : isDone
                  ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold">
                {isCurrent && isRunning ? (
                  <span className="flex items-center justify-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    {step.stage.toUpperCase()}
                  </span>
                ) : isDone && !isRunning ? (
                  <span className="flex items-center justify-center gap-1">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    {step.stage.toUpperCase()}
                  </span>
                ) : (
                  step.stage.toUpperCase()
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal log stream for the simulation */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Live Simulation Console Output
          </span>
          <span className="text-[10px]">Autoscrolling stream</span>
        </div>
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 max-h-40 overflow-y-auto">
          {simLogs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                log.includes('[DETECT]')
                  ? 'text-rose-400'
                  : log.includes('[DIAGNOSE]')
                  ? 'text-amber-300'
                  : log.includes('[HEAL]')
                  ? 'text-cyan-300'
                  : log.includes('[VALIDATE]')
                  ? 'text-indigo-300'
                  : log.includes('[RECOVER]')
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
