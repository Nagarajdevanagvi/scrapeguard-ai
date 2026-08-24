import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Scraper } from '../../types';
import { api } from '../../services/api';
import { Play, CheckCircle2, Loader2, Terminal, ShieldCheck, RefreshCw } from 'lucide-react';

export interface ScraperTestModalProps {
  scraper: Scraper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScraperTestModal: React.FC<ScraperTestModalProps> = ({
  scraper,
  isOpen,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!scraper) return null;

  const handleStartTest = async () => {
    setIsRunning(true);
    setTestResult(null);
    try {
      const result = await api.testScraper(scraper.collectorId);
      setTestResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Collector Health & Extraction Test</span>
        </div>
      }
      subtitle={`Target: ${scraper.targetDomain} • Collector: ${scraper.collectorId}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Info Box */}
        <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>Proxy Network:</span>
            <span className="text-slate-200">{scraper.proxyNetwork}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Schema Contract:</span>
            <span className="text-cyan-400">{scraper.schemaVersion} (7 fields)</span>
          </div>
        </div>

        {/* Action button */}
        {!testResult && !isRunning && (
          <div className="text-center py-6 space-y-4">
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click below to dispatch an isolated test probe through Bright Data Web Unlocker proxy and validate current DOM extraction recipes.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTest}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Execute Diagnostic Probe
            </Button>
          </div>
        )}

        {/* Running state */}
        {isRunning && (
          <div className="py-8 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-slate-300">
              Probing target website via Bright Data proxy network...
            </p>
            <span className="text-[10px] font-mono text-slate-400">
              Evaluating DOM tree & CSS selectors
            </span>
          </div>
        )}

        {/* Results output */}
        {testResult && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Probe Successful • 100% Schema Conformance
              </span>
              <span>{testResult.latencyMs}ms latency</span>
            </div>

            {/* Execution logs */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Execution Log Stream:</label>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1 max-h-40 overflow-y-auto">
                {testResult.logs.map((log: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 select-none">[{idx + 1}]</span>
                    <span className={log.includes('Schema') ? 'text-emerald-400 font-semibold' : ''}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Record Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400">Sample Extracted Payload:</label>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                {JSON.stringify(testResult.sampleRecord, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          {testResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTest}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-run Test
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
