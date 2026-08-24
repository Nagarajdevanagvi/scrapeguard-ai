import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardStats, FieldQuality as FieldQualityType, Scraper, TimelineEvent } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { HealthOverview } from '../components/dashboard/HealthOverview';
import { FieldQuality } from '../components/dashboard/FieldQuality';
import { RecentEvents } from '../components/dashboard/RecentEvents';
import { LoadingState } from '../components/ui/LoadingState';
import { mockRecentEvents } from '../data/mockData';
import {
  Briefcase,
  Building2,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fieldQualities, setFieldQualities] = useState<FieldQualityType[]>([]);
  const [scraper, setScraper] = useState<Scraper | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>(mockRecentEvents);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data.stats);
      setFieldQualities(data.fieldQualities);
      setScraper(data.primaryScraper);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  if (loading || !stats || !scraper) {
    return <LoadingState label="Loading pipeline health and ingestion metrics..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
              ScrapeGuard AI
            </h1>
            <Badge variant="success" dot size="md" className="font-bold">
              SYSTEM HEALTHY
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Self-healing web intelligence. Continuous contract monitoring on public web data pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/jobs')}
            leftIcon={<Briefcase className="w-3.5 h-3.5" />}
          >
            Browse Structured Jobs
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/self-healing')}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Self-Healing Center
          </Button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Jobs Tracked"
          value={stats.jobsTracked}
          trend={stats.jobsTrackedTrend}
          trendLabel="vs last week"
          supportingText="+248 added today"
          icon={Briefcase}
          iconColor="text-cyan-400"
        />

        <StatCard
          label="Companies"
          value={stats.companiesCount}
          trend={stats.companiesTrend}
          trendLabel="verified employers"
          supportingText="Across 6 tech hubs"
          icon={Building2}
          iconColor="text-sky-400"
        />

        <StatCard
          label="Pipeline Health"
          value={`${stats.pipelineHealth}%`}
          trend={stats.pipelineHealthTrend}
          trendLabel="SLA compliance"
          supportingText="Optimal extraction"
          icon={Activity}
          iconColor="text-emerald-400"
        />

        <StatCard
          label="Successful Runs"
          value={stats.successfulRuns}
          supportingText="100% completion rate"
          icon={CheckCircle2}
          iconColor="text-indigo-400"
        />
      </div>

      {/* Main Scraper Health Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>PRIMARY COLLECTOR HEALTH & INGESTION TELEMETRY</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Powered by Bright Data Scraper Studio
          </span>
        </div>

        <HealthOverview
          scraper={scraper}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Two Column Grid: Field Extraction Quality + Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FieldQuality fields={fieldQualities} />
        <RecentEvents events={events} />
      </div>
    </div>
  );
};
