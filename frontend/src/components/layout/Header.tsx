import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return { title: 'Pipeline Dashboard', breadcrumb: 'Overview' };
      case '/jobs':
        return { title: 'Job Intelligence', breadcrumb: 'Data Layer' };
      case '/scrapers':
        return { title: 'Scraper Health', breadcrumb: 'Observability' };
      case '/incidents':
        return { title: 'Incidents & Triage', breadcrumb: 'Reliability' };
      case '/self-healing':
        return { title: 'Self-Healing Center', breadcrumb: 'Autonomous Core' };
      case '/settings':
        return { title: 'System Settings', breadcrumb: 'Configuration' };
      default:
        return { title: 'Dashboard', breadcrumb: 'Overview' };
    }
  };

  const { title, breadcrumb } = getPageTitle(location.pathname);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">{breadcrumb}</span>
          <span className="text-slate-500 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-100 font-sans text-sm tracking-tight">
            {title}
          </span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs, scrapers, incidents (e.g. INC-0042, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700/60 pointer-events-none">
            ↵
          </kbd>
        </form>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Hero link */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/self-healing')}
          className="hidden sm:inline-flex text-cyan-300 border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/20"
          leftIcon={<Zap className="w-3.5 h-3.5 text-cyan-400" />}
        >
          Self-Healing Demo
        </Button>

        {/* Collector Status Badge */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-slate-300 font-medium">Cutshort Collector</span>
          <Badge variant="success" size="sm">99.2%</Badge>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200 font-mono">Pipeline Alerts</span>
                <Badge variant="success" size="sm">All Resolved</Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pt-1">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Self-Healing Completed
                    </span>
                    <span className="text-[10px] text-slate-400">12m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    INC-0042 resolved. Location extraction quality restored from 42.1% → 97.8%.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Batch 248 Ingested</span>
                    <span className="text-[10px] text-slate-400">2m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Target cutshort.io extracted 248 jobs with 100% schema match.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/incidents');
                  }}
                  className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-mono py-1 flex items-center justify-center gap-1"
                >
                  <span>View incident history</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User / Team Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
            WMD
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">
              Scrape-Verse
            </div>
            <div className="text-[10px] text-slate-400 font-mono leading-tight">
              Bright Data Hackathon
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
