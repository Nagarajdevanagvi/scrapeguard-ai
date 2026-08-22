import React, { useState } from 'react';
import { Job } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Code2,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';

export interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'json'>('structured');
  const [isCopied, setIsCopied] = useState(false);

  if (!job) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(job, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>{job.title}</span>
          <Badge variant="success" size="sm">
            {job.qualityScore}% Valid
          </Badge>
        </div>
      }
      subtitle={`Target: ${job.source} • Collector: ${job.collectorId} • Extracted: ${job.lastSeen}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Tab Switcher & Quick Copy */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'structured' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('structured')}
              leftIcon={<TableIcon className="w-3.5 h-3.5" />}
            >
              Schema Audit View
            </Button>
            <Button
              variant={activeTab === 'json' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('json')}
              leftIcon={<Code2 className="w-3.5 h-3.5" />}
            >
              Raw Extracted JSON
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            leftIcon={isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {isCopied ? 'Copied JSON' : 'Copy JSON'}
          </Button>
        </div>

        {/* Tab Content 1: Structured Schema Audit */}
        {activeTab === 'structured' && (
          <div className="space-y-4">
            {/* Field Validation Grid */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                Field-Level Extraction Validation (JSON Schema v2.4)
              </h4>
              <div className="divide-y divide-slate-800/80 text-xs font-mono">
                {Object.entries(job.fieldValidity).map(([fieldKey, isValid]) => {
                  let value = (job as any)[fieldKey];
                  if (Array.isArray(value)) value = value.join(', ');
                  else if (typeof value === 'boolean') value = value ? 'true' : 'false';

                  return (
                    <div
                      key={fieldKey}
                      className="py-2.5 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-0.5 max-w-[200px]">
                        <span className="text-slate-300 font-semibold">{fieldKey}</span>
                        <div className="text-[10px] text-slate-400">
                          {isValid ? 'Matched expected contract' : 'Missing/Null in raw DOM'}
                        </div>
                      </div>

                      <div className="flex-1 text-right text-slate-300 font-sans truncate">
                        {String(value || '<null>')}
                      </div>

                      <div className="shrink-0">
                        {isValid ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Valid
                          </Badge>
                        ) : (
                          <Badge variant="danger" size="sm">
                            Degraded
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Text Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">
                Full Extracted Job Description:
              </label>
              <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                {job.description}
              </div>
            </div>

            {/* Pipeline Provenance */}
            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Self-Healing Guaranteed Pipeline (Bright Data Scraper Studio)</span>
              </div>
              <span className="text-[11px] text-slate-400">Schema ID: c_demo_cutshort#v2.4.1</span>
            </div>
          </div>
        )}

        {/* Tab Content 2: Raw JSON View */}
        {activeTab === 'json' && (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono overflow-x-auto max-h-[420px] leading-relaxed">
              {JSON.stringify(job, null, 2)}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Internal ID: <span className="text-slate-300">{job.id}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </Modal>
  );
};
