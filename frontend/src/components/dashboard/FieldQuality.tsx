import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { FieldQuality as FieldQualityType } from '../../types';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export interface FieldQualityProps {
  fields: FieldQualityType[];
}

export const FieldQuality: React.FC<FieldQualityProps> = ({ fields }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <div>
            <CardTitle>Field Extraction Quality</CardTitle>
            <CardDescription>
              Real-time null-rate and contract validation across extracted schema attributes.
            </CardDescription>
          </div>
          <Badge variant="success" size="sm">
            7/7 Monitored
          </Badge>
        </CardHeader>

        <div className="space-y-4 pt-1">
          {fields.map((field) => {
            const isOptimal = field.percentage >= 95;
            const isWarning = field.percentage >= 80 && field.percentage < 95;

            return (
              <div key={field.key} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {field.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {field.expectedType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOptimal && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Optimal
                      </span>
                    )}
                    {isWarning && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <AlertTriangle className="w-3 h-3" />
                        Minor Nulls
                      </span>
                    )}
                    {!isOptimal && !isWarning && (
                      <span className="flex items-center gap-1 text-[10px] text-rose-400">
                        <ShieldAlert className="w-3 h-3" />
                        Degraded
                      </span>
                    )}
                    <span className="font-bold text-white min-w-[36px] text-right">
                      {field.percentage}%
                    </span>
                  </div>
                </div>

                <Progress
                  value={field.percentage}
                  height="sm"
                  variant={isOptimal ? 'emerald' : isWarning ? 'amber' : 'rose'}
                />

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Null count: {field.nullCount} / {field.totalRecords}</span>
                  <span>Validated live</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-xl flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Autonomous Remediation Active
        </span>
        <span className="text-[11px] text-cyan-400">Auto-heals below 90%</span>
      </div>
    </Card>
  );
};
