import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  glow = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-slate-100 p-5 transition-all duration-200',
        hoverEffect && 'hover:border-slate-700/80 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-black/40',
        glow && 'ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-950/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center justify-between gap-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn('text-sm font-semibold tracking-wide text-slate-200 uppercase font-mono', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-slate-400', className)} {...props}>
      {children}
    </p>
  );
};
