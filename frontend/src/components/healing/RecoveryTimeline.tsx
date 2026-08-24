import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HealingSession } from '../../types';
import { Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Code2 } from 'lucide-react';

export interface RecoveryTimelineProps {
  session: HealingSession;
}

export const RecoveryTimeline: React.FC<RecoveryTimelineProps> = ({ session }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Session Investigation & Selector Diff */}
      <div className="lg:col-span-2 space-y-6">
        {/* Session Meta Card */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Recovery Session #{session.id}</CardTitle>
              <CardDescription>
                Target source: {session.source} • Collector: {session.collectorId}
              </CardDescription>
            </div>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified Recovered
            </Badge>
          </CardHeader>

          {/* Root Cause & Recipe Patch Code */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Bright Data Scraper Studio Synthesized Recipe Patch
              </h4>
              <p className="text-xs text-slate-400">
                Self-healing synthesized JavaScript extractor injected into collector recipe:
              </p>
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`// Bright Data Scraper Studio - Autonomous Recipe v2.4.1
export function extractJobLocation($) {
  // Primary selector: New nested badge layout
  const primary = $('.company-meta-badge[data-type="location"] .badge-text').text().trim();
  if (primary) return primary;

  // Fallback selector: Modern pill tag
  const fallbackPill = $('span.location-pill, div.job-meta-location').text().trim();
  if (fallbackPill) return fallbackPill;

  // Adaptive Regex DOM fallback:
  const rawBody = $('div.job-card-wrapper').text();
  const match = rawBody.match(/(Bangalore|Remote|Hyderabad|Pune|Gurgaon|Mumbai)/i);
  return match ? match[0] : null;
}`}
              </pre>
            </div>

            {/* Validation Outcome stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Test Ingestion</span>
                <div className="text-base font-bold text-slate-200">
                  {session.validationResults.totalRecordsTested} URLs
                </div>
                <span className="text-[10px] text-emerald-400">Isolated sandbox</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Schema Conformance</span>
                <div className="text-base font-bold text-emerald-400">
                  {session.validationResults.schemaConformancePct}%
                </div>
                <span className="text-[10px] text-slate-400">0 schema errors</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px]">Hot-Swap Downtime</span>
                <div className="text-base font-bold text-cyan-400">
                  0 ms
                </div>
                <span className="text-[10px] text-slate-400">Zero data dropped</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right 1 Col: Live Engine Telemetry Logs */}
      <div className="space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Engine Telemetry Logs</span>
              </CardTitle>
              <CardDescription>Streaming logs from Scraper Studio</CardDescription>
            </div>
          </CardHeader>

          <div className="flex-1 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-[11px] font-mono max-h-[380px] overflow-y-auto">
            {session.logs.map((log, idx) => {
              let color = 'text-slate-300';
              if (log.level === 'warn') color = 'text-amber-400';
              if (log.level === 'success') color = 'text-emerald-400 font-semibold';
              if (log.level === 'error') color = 'text-rose-400';

              return (
                <div key={idx} className="space-y-0.5 border-b border-slate-900 pb-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{log.timestamp}</span>
                    <span className="uppercase text-[9px]">{log.level}</span>
                  </div>
                  <p className={color}>{log.message}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
