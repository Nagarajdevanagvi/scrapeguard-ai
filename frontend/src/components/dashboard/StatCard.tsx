import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  supportingText?: string;
  icon: LucideIcon;
  iconColor?: string;
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendLabel = 'vs last run',
  supportingText,
  icon: Icon,
  iconColor = 'text-cyan-400',
  isPositive = true,
}) => {
  return (
    <Card hoverEffect className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-mono font-medium tracking-wide text-slate-400 uppercase">
            {label}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </h2>
        </div>

        <div
          className={cn(
            'p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm transition-transform duration-200 group-hover:scale-105',
            iconColor
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold text-[11px] px-1.5 py-0.5 rounded',
                isPositive
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-[11px] text-slate-400">{trendLabel}</span>
          </div>
        ) : (
          <div />
        )}

        {supportingText && (
          <span className="text-[11px] text-slate-400 font-mono truncate">
            {supportingText}
          </span>
        )}
      </div>
    </Card>
  );
};
