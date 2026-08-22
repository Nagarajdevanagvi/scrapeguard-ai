import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { HealingSession } from '../types';
import { RecoveryStatus } from '../components/healing/RecoveryStatus';
import { HealingPipeline } from '../components/healing/HealingPipeline';
import { RecoveryTimeline } from '../components/healing/RecoveryTimeline';
import { LiveHealingSimulator } from '../components/healing/LiveHealingSimulator';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';

export const SelfHealing: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<HealingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSimulator, setShowSimulator] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await api.getHealingStatus('heal-0042');
        setSession(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading || !session) {
    return <LoadingState label="Initializing autonomous self-healing telemetry..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <span>Self-Healing Center</span>
            </h1>
            <Badge variant="purple" size="md">
              HERO CORE
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            ScrapeGuard automatically detects scraper failures and coordinates recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/incidents?id=INC-0042')}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            View Incident INC-0042
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/scrapers')}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            View Scraper
          </Button>
        </div>
      </div>

      {/* Top Recovery Status Banner */}
      <RecoveryStatus
        session={session}
        onTriggerDemo={() => {
          setShowSimulator(true);
          const el = document.getElementById('live-simulator-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        isSimulating={false}
      />

      {/* Live Interactive Simulator Section */}
      <div id="live-simulator-section">
        <LiveHealingSimulator />
      </div>

      {/* Visual 5-Stage Pipeline */}
      <div className="space-y-4">
        <HealingPipeline
          stages={session.stages}
          activeStage="recover"
          isSimulating={false}
        />
      </div>

      {/* Session Investigation & Recipe Patch Code */}
      <RecoveryTimeline session={session} />
    </div>
  );
};
