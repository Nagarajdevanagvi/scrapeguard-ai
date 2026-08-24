import React from 'react';
import { Incident } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IncidentTimeline } from './IncidentTimeline';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Code2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface IncidentDetailsDrawerProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentDetailsDrawer: React.FC<IncidentDetailsDrawerProps> = ({
  incident,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!incident) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      drawer={true}
      title={
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-bold">{incident.id}</span>
          <Badge
            variant={incident.severity === 'critical' ? 'danger' : 'warning'}
            size="sm"
          >
            {incident.severity.toUpperCase()}
          </Badge>
          <Badge variant="success" size="sm" dot>
            {incident.status.toUpperCase()}
          </Badge>
        </div>
      }
      subtitle={`Source: ${incident.source} (${incident.collectorId}) • Detected ${incident.timeAgo}`}
    >
      <div className="space-y-6">
        {/* Incident Summary Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">
            {incident.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {incident.rootCause}
          </p>

          {/* Health recovery trajectory pill */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 font-mono text-xs">
            <span className="text-slate-400">Health Impact:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">{incident.healthBefore}%</span>
              <span className="text-rose-400 font-bold">↓ {incident.healthDuring}%</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-bold">↑ {incident.healthAfter}%</span>
            </div>
          </div>
        </div>

        {/* Key Incident Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400">Affected Fields</span>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {incident.affectedFields.map((f) => (
                <span
                  key={f}
                  className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400">Records Restored</span>
            <div className="text-base font-bold text-cyan-400">
              {incident.recordsAffected}
            </div>
            <span className="text-[10px] text-slate-400">Backfilled cleanly</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400">Recovery Mode</span>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Auto Healed
            </div>
            <span className="text-[10px] text-slate-400">Bright Data Studio</span>
          </div>
        </div>

        {/* Selector Diff Box */}
        {incident.selectorDiff && incident.selectorDiff.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" />
              CSS Selector AST Diff & Repair
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              {incident.selectorDiff.map((diff, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-400 font-semibold">Field: {diff.field}</span>
                    <Badge variant="success" size="sm">
                      {Math.round(diff.confidence * 100)}% Match Confidence
                    </Badge>
                  </div>

                  <div className="p-2 rounded bg-rose-950/20 border border-rose-800/40 text-rose-300 space-y-0.5">
                    <span className="text-[10px] text-rose-400 block uppercase font-bold">
                      - Broken Selector (Deprecated):
                    </span>
                    <code className="text-xs">{diff.oldSelector}</code>
                  </div>

                  <div className="p-2 rounded bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 space-y-0.5">
                    <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                      + Repaired Recipe Selector (Synthesized):
                    </span>
                    <code className="text-xs">{diff.newSelector}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repair Summary */}
        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-200 space-y-1">
          <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Autonomous Remediation Summary:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {incident.repairSummary}
          </p>
        </div>

        {/* Incident Resolution Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Resolution & Verification Log
          </h4>
          <IncidentTimeline events={incident.timeline} />
        </div>

        {/* Action Button to Hero Self Healing page */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/self-healing');
            }}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Launch Interactive Recovery Engine
          </Button>
        </div>
      </div>
    </Modal>
  );
};
