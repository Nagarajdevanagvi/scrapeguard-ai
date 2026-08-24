import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading pipeline telemetry...',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-16 text-slate-400 gap-3',
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin" />
        <Loader2 className="w-4 h-4 text-cyan-400 absolute" />
      </div>
      <span className="text-xs font-mono tracking-wider text-slate-400">{label}</span>
    </div>
  );
};
