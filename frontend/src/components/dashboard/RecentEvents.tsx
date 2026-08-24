import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { TimelineEvent } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RecentEventsProps {
  events: TimelineEvent[];
}

export const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  const navigate = useNavigate();

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'degradation':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'healing':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'validation':
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'recovery':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventBorderColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'degradation':
        return 'border-amber-500/40 bg-amber-500/10';
      case 'healing':
        return 'border-cyan-500/40 bg-cyan-500/10';
      case 'recovery':
        return 'border-emerald-500/40 bg-emerald-500/10';
      default:
        return 'border-slate-800 bg-slate-900/60';
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <div>
            <CardTitle>Recent Pipeline Events</CardTitle>
            <CardDescription>
              Chronological log of collector runs, anomaly detections, and self-healing cycles.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/incidents')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            All Events
          </Button>
        </CardHeader>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800 pt-1">
          {events.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${getEventBorderColor(
                  event.type
                )}`}
              >
                {getEventIcon(event.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-semibold font-mono text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {event.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {event.timeFormatted}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {event.description}
                </p>

                {event.incidentId && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/incidents?id=${event.incidentId}`)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                    >
                      <span>View Incident {event.incidentId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Collector: {event.collectorId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 -mx-5 -mb-5 p-4 bg-slate-950/50 rounded-b-xl flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          Last anomaly resolved 12m ago
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/self-healing')}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          View Self-Healing Hub
        </Button>
      </div>
    </Card>
  );
};
