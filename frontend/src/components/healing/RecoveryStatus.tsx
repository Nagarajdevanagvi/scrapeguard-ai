import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { HealingSession } from '../../types';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';

export interface RecoveryStatusProps {
  session: HealingSession;
  onTriggerDemo: () => void;
  isSimulating: boolean;
  currentSimStage?: string;
}

export const RecoveryStatus: React.FC<RecoveryStatusProps> = ({
  session,
  onTriggerDemo,
  isSimulating,
  currentSimStage,
}) => {
  return (
    <Card className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 backdrop-blur-md">
      {/* Background glow accent */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Status Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              RECOVERY ENGINE STATUS
            </span>
            <Badge variant="success" dot size="md" className="font-bold">
              {isSimulating ? `SIMULATION ACTIVE: ${currentSimStage?.toUpperCase()}` : 'SYSTEM RECOVERED & MONITORING'}
            </Badge>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Session #{session.incidentId}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
              <span>Autonomous Scraper Studio Recovery</span>
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Continuous contract sentinel detected HTML restructuring on <strong className="text-white">{session.source}</strong> ({session.collectorId}), synthesized a recipe repair, and restored pipeline health from <span className="text-rose-400 font-bold">{session.healthDrop.lowest}%</span> to <span className="text-emerald-400 font-bold">{session.healthDrop.recovered}%</span> in 4m 33s.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Health Restored:</span>
              <span className="font-bold text-emerald-400">+{Math.round(session.healthDrop.recovered - session.healthDrop.lowest)}%</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sandbox Tests:</span>
              <span className="font-bold text-cyan-400">100/100 Passed</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Collector:</span>
              <span className="text-slate-200">{session.collectorId}</span>
            </div>
          </div>
        </div>

        {/* Right Action: Demo Trigger */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onTriggerDemo}
            isLoading={isSimulating}
            leftIcon={isSimulating ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-md shadow-cyan-500/20"
          >
            {isSimulating ? 'Replay Live Recovery Demo' : 'Run Recovery Demo'}
          </Button>

          <span className="text-[10px] font-mono text-slate-400 text-center lg:text-right">
            Simulates end-to-end Detect → Diagnose → Heal → Validate → Recover
          </span>
        </div>
      </div>
    </Card>
  );
};
