import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Activity,
  AlertTriangle,
  Sparkles,
  Settings,
  ShieldCheck,
  Radio,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Job Intelligence', path: '/jobs', icon: Briefcase, badge: '12.4k' },
      ],
    },
    {
      label: 'SCRAPER',
      items: [
        { name: 'Scraper Health', path: '/scrapers', icon: Activity },
        { name: 'Incidents', path: '/incidents', icon: AlertTriangle, badge: '0 active' },
        { name: 'Self-Healing', path: '/self-healing', icon: Sparkles, highlight: true },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-850 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top brand header */}
        <div className="p-5 border-b border-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-sm shadow-cyan-950/50">
              <ShieldCheck className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white font-mono text-sm">
                  SCRAPEGUARD
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight truncate">
                Self-healing web intelligence
              </p>
            </div>
          </div>

          <div className="mt-3.5 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Bright Data Studio
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              c_demo_cutshort
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-slate-300 tracking-wider font-mono">
                {section.label}
              </div>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                          isActive
                            ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent',
                          item.highlight && !isActive && 'text-cyan-400 hover:text-cyan-300'
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'w-4 h-4 transition-colors',
                            item.highlight ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                          {item.badge}
                        </span>
                      )}

                      {item.highlight && (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          <Zap className="w-2.5 h-2.5" />
                          HERO
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom system status card */}
        <div className="p-4 border-t border-slate-850/80 bg-slate-950">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                System Status
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                HEALTHY
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="font-medium text-[11px]">All systems operational</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Pipeline SLA</span>
              <span className="text-emerald-400 font-semibold">98.7%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
