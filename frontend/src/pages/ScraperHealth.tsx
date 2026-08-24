import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Scraper } from '../types';
import { ScraperCard } from '../components/scraper/ScraperCard';
import { SchemaHealth } from '../components/scraper/SchemaHealth';
import { ScraperTestModal } from '../components/scraper/ScraperTestModal';
import { HealthChart } from '../components/dashboard/HealthChart';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { Activity, ShieldCheck, Play, Radio, Cpu, RefreshCw } from 'lucide-react';

export const ScraperHealth: React.FC = () => {
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [loading, setLoading] = useState(true);
  const [testModalScraper, setTestModalScraper] = useState<Scraper | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchScrapers = async () => {
    try {
      const data = await api.getScrapers();
      setScrapers(data);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScrapers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchScrapers();
  };

  if (loading || scrapers.length === 0) {
    return <LoadingState label="Loading scraper observability metrics..." />;
  }

  const primaryScraper = scrapers[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              Scraper Health & Observability
            </h1>
            <Badge variant="success" dot size="md">
              HEALTHY • 98.7% SLA
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Telemetry, latency curves, schema contracts, and Bright Data proxy performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Telemetry
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setTestModalScraper(primaryScraper)}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            Run Diagnostic Probe
          </Button>
        </div>
      </div>

      {/* Observability KPIs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overall Health</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">98.7%</div>
          <span className="text-[10px] text-slate-400 font-mono">Above 90% SLA threshold</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Active Collectors</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">2 Online</div>
          <span className="text-[10px] text-slate-400 font-mono">c_demo_cutshort + startups</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Success Rate</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">99.8%</div>
          <span className="text-[10px] text-emerald-400 font-mono">Fast HTTP 200 responses</span>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Avg Response Latency</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">18.4s</div>
          <span className="text-[10px] text-slate-400 font-mono">Web Unlocker + JS Render</span>
        </Card>
      </div>

      {/* Collector Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Registered Scraper Collectors
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {scrapers.map((sc) => (
            <ScraperCard
              key={sc.id}
              scraper={sc}
              onRunTest={(sc) => setTestModalScraper(sc)}
            />
          ))}
        </div>
      </div>

      {/* Health Trend Chart Card */}
      <Card className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle>Continuous Health & Degradation Recovery Timeline</CardTitle>
            <CardDescription>
              Time-series health measurements across 24h scraper runs. Shows degradation spike and rapid self-healing recovery.
            </CardDescription>
          </div>
          <Badge variant="info" size="sm">
            24h History
          </Badge>
        </CardHeader>
        <HealthChart data={primaryScraper.metricsHistory} height={260} />
      </Card>

      {/* Schema Health Section */}
      <SchemaHealth
        fields={primaryScraper.fields}
        schemaVersion={primaryScraper.schemaVersion}
      />

      {/* Test Modal */}
      <ScraperTestModal
        scraper={testModalScraper}
        isOpen={Boolean(testModalScraper)}
        onClose={() => setTestModalScraper(null)}
      />
    </div>
  );
};
