import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemSettings } from '../types';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import {
  Settings as SettingsIcon,
  Server,
  ShieldCheck,
  Bell,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Database,
  ExternalLink,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [backendCheck, setBackendCheck] = useState<{ status: 'mock' | 'connected'; url: string } | null>(null);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestBackend = async () => {
    setIsCheckingBackend(true);
    try {
      const res = await api.checkBackendHealth();
      setBackendCheck(res);
    } finally {
      setIsCheckingBackend(false);
    }
  };

  if (loading || !settings) {
    return <LoadingState label="Loading pipeline configuration..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              <span>System Settings</span>
            </h1>
            <Badge variant="default" size="sm">
              Configuration v2.4
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Pipeline parameters, autonomous remediation triggers, and FastAPI backend connectors.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={saveSuccess ? <Check className="w-3.5 h-3.5" /> : undefined}
        >
          {saveSuccess ? 'Changes Saved' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Project Section */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Project & Environment</span>
              </CardTitle>
              <CardDescription>
                Core project identification and active data collector source.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-300">Project Name</label>
              <input
                type="text"
                value={settings.projectName}
                onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">Environment</label>
              <select
                value={settings.environment}
                onChange={(e) => setSettings({ ...settings, environment: e.target.value as any })}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="demo">Demo (WeMakeDevs Hackathon)</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-300">Data Source & Collector</label>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="text-white font-semibold">{settings.dataSource}</span>
                <Badge variant="success" size="sm">
                  Collector ID: {settings.collectorId}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Autonomous Remediation System */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Autonomous Healing & Sentinel Rules</span>
              </CardTitle>
              <CardDescription>
                Configure automatic triggers, thresholds, and Scraper Studio synthesis dispatch.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 text-xs font-mono">
            {/* Auto-Healing Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-white font-semibold block">Auto-Healing Engine</span>
                <span className="text-slate-400 text-[11px]">
                  Automatically synthesize recipe repair when schema degradation is detected.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoHealingEnabled}
                onChange={(e) => setSettings({ ...settings, autoHealingEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Health Monitoring Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-white font-semibold block">Continuous Health Sentinel</span>
                <span className="text-slate-400 text-[11px]">
                  Audit field completeness and null rates on every batch run.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.healthMonitoringEnabled}
                onChange={(e) => setSettings({ ...settings, healthMonitoringEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-white font-semibold block">Pipeline Alert Notifications</span>
                <span className="text-slate-400 text-[11px]">
                  Dispatch incident logs to Webhooks and Slack channels.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Threshold Slider */}
            <div className="space-y-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Degradation Alert Threshold</span>
                <span className="text-cyan-400 font-bold">{settings.degradationThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={settings.degradationThreshold}
                onChange={(e) => setSettings({ ...settings, degradationThreshold: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="text-[10px] text-slate-400 block">
                If overall field extraction quality drops below {settings.degradationThreshold}%, an INCIDENT is created immediately.
              </span>
            </div>
          </div>
        </Card>

        {/* Backend & API Connector */}
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Backend API & Scraper Studio Integration</span>
              </CardTitle>
              <CardDescription>
                Configure the FastAPI service base URL for future live integration.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-300">FastAPI Backend Service Base URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.backendApiUrl}
                  onChange={(e) => setSettings({ ...settings, backendApiUrl: e.target.value })}
                  placeholder="http://localhost:8000"
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleTestBackend}
                  isLoading={isCheckingBackend}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Test Connection
                </Button>
              </div>
            </div>

            {backendCheck && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Connection Mode:</span>
                  {backendCheck.status === 'connected' ? (
                    <Badge variant="success" size="sm">Connected to Live FastAPI</Badge>
                  ) : (
                    <Badge variant="info" size="sm">Demo Mock Data Mode Active</Badge>
                  )}
                </div>
                <p className="text-slate-400">
                  {backendCheck.status === 'connected'
                    ? `Live API responding at ${backendCheck.url}`
                    : `No live service at ${backendCheck.url}. ScrapeGuard AI is operating with full fidelity mock datasets.`}
                </p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Architecture Contract:</div>
              <p>
                Frontend communicates via <code className="text-cyan-300">src/services/api.ts</code> with clean REST endpoints (<code className="text-slate-300">GET /api/dashboard</code>, <code className="text-slate-300">GET /api/jobs</code>, <code className="text-slate-300">GET /api/scrapers</code>, <code className="text-slate-300">GET /api/incidents</code>, <code className="text-slate-300">GET /api/healing/:id</code>).
              </p>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
