import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'auto';
  height?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  variant = 'auto',
  height = 'md',
  className,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  let barColor = 'bg-cyan-500';
  if (variant === 'auto') {
    if (clampedValue >= 95) barColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    else if (clampedValue >= 80) barColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    else barColor = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
  } else {
    const map = {
      cyan: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]',
      emerald: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
      amber: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
      rose: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]',
    };
    barColor = map[variant];
  }

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div
      className={cn(
        'w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 p-0.5',
        heightStyles[height],
        className
      )}
      {...props}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
