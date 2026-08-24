import React from 'react';
import { IncidentTimelineEvent } from '../../types';
import { CheckCircle2, AlertTriangle, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IncidentTimelineProps {
  events: IncidentTimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events }) => {
  const getIcon = (stage?: string) => {
    switch (stage) {
      case 'detect':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'diagnose':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'heal':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'validate':
        return <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />;
      case 'recover':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getBorderColor = (stage?: string) => {
    switch (stage) {
      case 'detect':
        return 'border-rose-500/40 bg-rose-500/10';
      case 'diagnose':
        return 'border-amber-500/40 bg-amber-500/10';
      case 'heal':
        return 'border-cyan-500/40 bg-cyan-500/10';
      case 'validate':
        return 'border-indigo-500/40 bg-indigo-500/10';
      case 'recover':
        return 'border-emerald-500/40 bg-emerald-500/10';
      default:
        return 'border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
      {events.map((event) => (
        <div key={event.id} className="relative group">
          {/* Node */}
          <div
            className={cn(
              'absolute -left-6 top-1 w-4 h-4 rounded-full border flex items-center justify-center',
              getBorderColor(event.stage)
            )}
          >
            {getIcon(event.stage)}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {event.title}
              </span>
              <span className="text-[10px] text-slate-400">
                {event.timeFormatted}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
