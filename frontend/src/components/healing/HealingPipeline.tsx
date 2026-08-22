import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HealingStage, HealingStageDetail } from '../../types';
import {
  AlertTriangle,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Code2,
  Terminal,
  Clock,
  Loader2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HealingPipelineProps {
  stages: Record<HealingStage, HealingStageDetail>;
  activeStage?: HealingStage;
  isSimulating?: boolean;
}

export const HealingPipeline: React.FC<HealingPipelineProps> = ({
  stages,
  activeStage = 'recover',
  isSimulating = false,
}) => {
  const pipelineOrder: HealingStage[] = ['detect', 'diagnose', 'heal', 'validate', 'recover'];

  const getStageMeta = (stageId: HealingStage, index: number) => {
    switch (stageId) {
      case 'detect':
        return {
          stepNum: '01',
          name: 'DETECT',
          tagline: 'Real-time Anomaly Trigger',
          icon: AlertTriangle,
          accentColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
          glowBorder: 'border-rose-500/60 ring-rose-500/30',
        };
      case 'diagnose':
        return {
          stepNum: '02',
          name: 'DIAGNOSE',
          tagline: 'DOM AST & Selector Diff',
          icon: Search,
          accentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
          glowBorder: 'border-amber-500/60 ring-amber-500/30',
        };
      case 'heal':
        return {
          stepNum: '03',
          name: 'HEAL',
          tagline: 'Bright Data Recipe Synthesis',
          icon: Sparkles,
          accentColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
          glowBorder: 'border-cyan-500/60 ring-cyan-500/30',
        };
      case 'validate':
        return {
          stepNum: '04',
          name: 'VALIDATE',
          tagline: 'Golden Set & Schema Contract',
          icon: ShieldCheck,
          accentColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
          glowBorder: 'border-indigo-500/60 ring-indigo-500/30',
        };
      case 'recover':
        return {
          stepNum: '05',
          name: 'RECOVER',
          tagline: 'Hot-Swap & Backfill Restored',
          icon: CheckCircle2,
          accentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
          glowBorder: 'border-emerald-500/60 ring-emerald-500/30',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold font-mono text-slate-200 uppercase tracking-wider">
            Autonomous Self-Healing Execution Pipeline
          </h3>
          <p className="text-xs text-slate-400">
            End-to-end telemetry coordination between ScrapeGuard AI and Bright Data Scraper Studio.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Stage 5/5 Validated</span>
        </div>
      </div>

      {/* 5-Stage Visual Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
        {pipelineOrder.map((stageKey, idx) => {
          const stage = stages[stageKey];
          const meta = getStageMeta(stageKey, idx);
          const Icon = meta.icon;
          const isCurrentActive = isSimulating && activeStage === stageKey;
          const isCompleted = !isSimulating || pipelineOrder.indexOf(activeStage as HealingStage) >= idx;

          return (
            <div key={stageKey} className="relative flex flex-col">
              {/* Connector line on desktop */}
              {idx < 4 && (
                <div className="hidden md:block absolute top-7 -right-2.5 z-20 text-slate-700 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-slate-600" />
                </div>
              )}

              {/* Stage Card */}
              <Card
                className={cn(
                  'flex-1 flex flex-col justify-between p-4 space-y-3 transition-all duration-300 relative',
                  isCurrentActive && 'ring-2 ring-cyan-400 bg-slate-900 shadow-xl shadow-cyan-950/40 scale-[1.02]',
                  isCompleted ? 'border-slate-800' : 'opacity-60 border-slate-900'
                )}
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      STAGE {meta.stepNum}
                    </span>
                    {isCurrentActive ? (
                      <Badge variant="info" size="sm" dot>
                        Active
                      </Badge>
                    ) : isCompleted ? (
                      <Badge variant="success" size="sm">
                        Done
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Waiting
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg border flex items-center justify-center shrink-0',
                        meta.accentColor
                      )}
                    >
                      {isCurrentActive ? (
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white">
                        {meta.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {meta.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage Description */}
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans min-h-[44px]">
                  {stage.description}
                </p>

                {/* Stage Specific Telemetry Box */}
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1 bg-slate-950/60 -mx-4 -mb-4 p-3 rounded-b-xl">
                  {stageKey === 'detect' && (
                    <div className="flex items-center justify-between text-rose-400">
                      <span>Health Drop:</span>
                      <span className="font-bold">98.7% → 42.1%</span>
                    </div>
                  )}
                  {stageKey === 'diagnose' && (
                    <div className="flex items-center justify-between text-amber-400">
                      <span>Diff Found:</span>
                      <span className="font-bold">.job-location-tag</span>
                    </div>
                  )}
                  {stageKey === 'heal' && (
                    <div className="flex items-center justify-between text-cyan-300">
                      <span>Patch Version:</span>
                      <span className="font-bold">Recipe v2.4.1</span>
                    </div>
                  )}
                  {stageKey === 'validate' && (
                    <div className="flex items-center justify-between text-indigo-300">
                      <span>Golden Tests:</span>
                      <span className="font-bold text-emerald-400">100/100 Valid</span>
                    </div>
                  )}
                  {stageKey === 'recover' && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Restored SLA:</span>
                      <span className="font-bold">97.8% Health</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
