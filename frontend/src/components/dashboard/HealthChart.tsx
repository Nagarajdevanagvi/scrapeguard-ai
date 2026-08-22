import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ScraperMetricPoint } from '../../types';

export interface HealthChartProps {
  data: ScraperMetricPoint[];
  height?: number;
}

export const HealthChart: React.FC<HealthChartProps> = ({
  data,
  height = 260,
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="timeLabel"
            stroke="#64748b"
            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />

          <YAxis
            domain={[30, 100]}
            stroke="#64748b"
            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ScraperMetricPoint;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl font-mono text-xs space-y-1">
                    <p className="font-semibold text-slate-200">{item.timeLabel}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-cyan-400">Pipeline Health:</span>
                      <span className="font-bold text-white">{item.health}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-emerald-400">Success Rate:</span>
                      <span className="text-slate-200">{item.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Latency:</span>
                      <span className="text-slate-300">{item.latency}s</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400">Extracted:</span>
                      <span className="text-slate-300">{item.recordsExtracted} jobs</span>
                    </div>
                    {item.isIncident && (
                      <div className="mt-1 pt-1 border-t border-slate-800 text-rose-400 font-sans font-medium text-[11px]">
                        ⚠ Location Degradation Incident Flagged
                      </div>
                    )}
                    {item.isHealing && (
                      <div className="mt-1 pt-1 border-t border-slate-800 text-cyan-400 font-sans font-medium text-[11px]">
                        ⚡ Self-Healing Routine Executed
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Reference line for 90% SLA threshold */}
          <ReferenceLine
            y={90}
            stroke="#e11d48"
            strokeDasharray="4 4"
            label={{
              value: 'SLA Threshold (90%)',
              fill: '#f43f5e',
              fontSize: 10,
              position: 'insideBottomRight',
              fontFamily: 'JetBrains Mono',
            }}
          />

          <Area
            type="monotone"
            dataKey="health"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#healthGradient)"
            name="Pipeline Health"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
