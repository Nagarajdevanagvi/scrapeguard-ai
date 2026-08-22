import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Scraper } from '../../types';
import { HealthChart } from './HealthChart';
import { Radio, RefreshCw, ExternalLink, Clock, Database, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HealthOverviewProps {
  scraper: Scraper;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({
  scraper,
  onRefresh,
  isRefreshing,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold font-mono text-white tracking-tight">
              {scraper.name}
            </h2>
            <Badge variant="success" dot size="sm">
              {scraper.status.toUpperCase()}
            </Badge>
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
              Collector: {scraper.collectorId}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Target Domain: <span className="text-slate-300 font-medium">{scraper.targetDomain}</span> • Proxy Network: <span className="text-slate-300">{scraper.proxyNetwork}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/scrapers')}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Scraper Observability
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            Extraction Health
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {scraper.healthScore}%
          </div>
          <div className="text-[10px] text-slate-400">Optimal SLA threshold</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-sky-400" />
            Last Run
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {scraper.lastRunTime}
          </div>
          <div className="text-[10px] text-slate-400">Automated cron cycle</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Database className="w-3 h-3 text-indigo-400" />
            Batch Records
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {scraper.lastRunRecords}
          </div>
          <div className="text-[10px] text-slate-400">100% schema matched</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-amber-400" />
            Avg Latency
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {scraper.avgLatencySeconds}s
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">99.8% Success Rate</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <span>24-Hour Extraction Quality & Recovery Telemetry</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Showing self-healing recovery at 11:02
          </span>
        </div>
        <HealthChart data={scraper.metricsHistory} height={220} />
      </div>
    </Card>
  );
};
