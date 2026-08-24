import React from 'react';
import { Scraper } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Activity,
  CheckCircle2,
  Clock,
  Database,
  Gauge,
  Shield,
  Play,
} from 'lucide-react';

export interface ScraperCardProps {
  scraper: Scraper;
  onRunTest: (scraper: Scraper) => void;
}

export const ScraperCard: React.FC<ScraperCardProps> = ({
  scraper,
  onRunTest,
}) => {
  return (
    <Card hoverEffect className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-mono text-white">
              {scraper.name}
            </h3>
            <Badge variant="success" dot size="sm">
              {scraper.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Collector ID: <span className="text-cyan-400">{scraper.collectorId}</span> • Schema: <span className="text-slate-300">{scraper.schemaVersion}</span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onRunTest(scraper)}
          leftIcon={<Play className="w-3.5 h-3.5 text-cyan-400" />}
          className="shrink-0"
        >
          Run Scraper Test
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Health Score
          </span>
          <div className="text-xl font-bold text-emerald-400">
            {scraper.healthScore}%
          </div>
          <span className="text-[10px] text-slate-400">99.8% SLA Target</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-400" />
            Last Run
          </span>
          <div className="text-lg font-bold text-slate-200">
            {scraper.lastRunTime}
          </div>
          <span className="text-[10px] text-slate-400">{scraper.lastRunRecords} records</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            Avg Latency
          </span>
          <div className="text-lg font-bold text-slate-200">
            {scraper.avgLatencySeconds}s
          </div>
          <span className="text-[10px] text-emerald-400">Fast HTTP 200</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-400" />
            Total Jobs
          </span>
          <div className="text-lg font-bold text-cyan-400">
            {scraper.totalJobsExtracted.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Indexed into DB</span>
        </div>
      </div>

      {/* Network & Routing */}
      <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Proxy Routing: <strong className="text-slate-300 font-medium">{scraper.proxyNetwork}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Self-Healing Trigger: Auto-Active</span>
        </div>
      </div>
    </Card>
  );
};
