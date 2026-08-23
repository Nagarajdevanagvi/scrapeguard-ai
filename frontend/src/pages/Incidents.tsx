import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Incident } from '../types';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { IncidentDetailsDrawer } from '../components/incidents/IncidentDetailsDrawer';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sparkles,
  Zap,
  Filter,
} from 'lucide-react';

export const Incidents: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedIncidentId = searchParams.get('id');

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await api.getIncidents();
        setIncidents(data);
        if (requestedIncidentId) {
          const match = data.find((i) => i.id === requestedIncidentId);
          if (match) setSelectedIncident(match);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, [requestedIncidentId]);

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity === 'all') return true;
    return inc.severity === filterSeverity;
  });

  if (loading) {
    return <LoadingState label="Loading incident records and triage logs..." />;
  }

  const openIncidents = incidents.filter((inc) => inc.status !== 'resolved');
  const resolvedIncidents = incidents.filter((inc) => inc.status === 'resolved');
  const today = new Date().toDateString();
  const resolvedToday = resolvedIncidents.filter(
    (inc) => inc.resolvedAt && new Date(inc.resolvedAt).toDateString() === today
  ).length;
  const criticalOpen = openIncidents.filter((inc) => inc.severity === 'critical').length;
  const recoveryMinutes = resolvedIncidents
    .filter((inc) => inc.resolvedAt)
    .map((inc) => (new Date(inc.resolvedAt as string).getTime() - new Date(inc.detectedAt).getTime()) / 60000);
  const avgRecoveryMinutes =
    recoveryMinutes.length > 0
      ? (recoveryMinutes.reduce((sum, value) => sum + value, 0) / recoveryMinutes.length).toFixed(1)
      : null;
  const autoRemediatedPct =
    incidents.length > 0 ? Math.round((resolvedIncidents.length / incidents.length) * 100) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              Incidents & Triage
            </h1>
            <Badge variant={openIncidents.length === 0 ? 'success' : 'danger'} dot size="md">
              {openIncidents.length} OPEN INCIDENT{openIncidents.length === 1 ? '' : 'S'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Detected data-quality and scraper reliability issues with automated root cause diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm" className="hidden sm:inline-flex">
            Auto-Remediated: {autoRemediatedPct !== null ? `${autoRemediatedPct}%` : 'N/A'}
          </Badge>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Open Incidents</span>
            <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${openIncidents.length === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {openIncidents.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {openIncidents.length === 0 ? 'All queues clear' : 'Needs attention'}
          </span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Resolved Today</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{resolvedToday}</div>
          <span className="text-[10px] text-slate-400 font-mono">Self-healed autonomously</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Critical Issues</span>
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{criticalOpen}</div>
          <span className="text-[10px] text-slate-400 font-mono">
            {criticalOpen === 0 ? 'Zero uncontained drops' : 'Awaiting healing'}
          </span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Avg. Recovery Time</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {avgRecoveryMinutes !== null ? `${avgRecoveryMinutes} min` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Detection to verified recovery</span>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-semibold">Filter Severity:</span>
          <div className="flex items-center gap-1.5">
            {['all', 'critical', 'warning'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-1 rounded-md text-[11px] uppercase transition-colors ${
                  filterSeverity === sev
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Showing {filteredIncidents.length} incidents
        </span>
      </div>

      {/* Incident Table */}
      <IncidentTable
        incidents={filteredIncidents}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
      />

      {/* Incident Detail Drawer */}
      <IncidentDetailsDrawer
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
};
