import React from 'react';
import { Incident } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getSeverityBadge, getStatusBadge } from '../../lib/utils';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export interface IncidentTableProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onSelectIncident,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] tracking-wider border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">Incident ID</th>
            <th className="py-3 px-4">Description & Root Cause</th>
            <th className="py-3 px-4">Target Source</th>
            <th className="py-3 px-4">Severity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Health Impact</th>
            <th className="py-3 px-4">Detected</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60 font-sans">
          {incidents.map((incident) => {
            const severityMeta = getSeverityBadge(incident.severity);
            const statusMeta = getStatusBadge(incident.status);

            return (
              <tr
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                {/* Incident ID */}
                <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                  {incident.id}
                </td>

                {/* Title and affected fields */}
                <td className="py-3 px-4 max-w-sm">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {incident.title}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-400">Affected:</span>
                      {incident.affectedFields.map((field) => (
                        <span
                          key={field}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>

                {/* Source */}
                <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                  <div>{incident.source}</div>
                  <div className="text-[10px] text-slate-400">{incident.collectorId}</div>
                </td>

                {/* Severity */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge
                    variant={
                      incident.severity === 'critical'
                        ? 'danger'
                        : incident.severity === 'warning'
                        ? 'warning'
                        : 'info'
                    }
                    size="sm"
                  >
                    {incident.severity.toUpperCase()}
                  </Badge>
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge variant="success" size="sm" dot>
                    {incident.status.toUpperCase()}
                  </Badge>
                </td>

                {/* Health Impact */}
                <td className="py-3 px-4 font-mono whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-rose-400 font-semibold">{incident.healthDuring}%</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400 font-semibold">{incident.healthAfter}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {incident.recordsAffected} records healed
                  </div>
                </td>

                {/* Detected time */}
                <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {incident.timeAgo}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIncident(incident);
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
