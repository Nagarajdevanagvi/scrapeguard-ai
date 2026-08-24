import type { DashboardStats, FieldQuality, HealingSession, Incident, Job, Scraper, SystemSettings, TimelineEvent } from '../types';

const timestamp = new Date().toISOString();

export const mockJobs: Job[] = [
  {
    id: 'job-demo-001', title: 'Senior Backend Engineer', company: 'Example Systems', location: 'Bengaluru, India', isRemote: true,
    experience: '4–7 years', experienceMinYears: 4, experienceMaxYears: 7, salary: '₹24–32 LPA', skills: ['Python', 'FastAPI', 'PostgreSQL'],
    description: 'Demo record. Real records replace this when a collector run is ingested.', source: 'Demo source', sourceUrl: 'https://example.com/jobs/1', collectorId: 'c_demo_pending', lastSeen: timestamp, scrapedAt: timestamp, qualityScore: 100,
    fieldValidity: { job_title: true, company: true, location: true, experience: true, salary: true, skills: true, description: true },
  },
];

export const mockFieldQualities: FieldQuality[] = [
  { name: 'Job title', key: 'job_title', percentage: 100, expectedType: 'string', nullCount: 0, totalRecords: 1, status: 'optimal' },
  { name: 'Company', key: 'company', percentage: 100, expectedType: 'string', nullCount: 0, totalRecords: 1, status: 'optimal' },
  { name: 'Location', key: 'location', percentage: 100, expectedType: 'string', nullCount: 0, totalRecords: 1, status: 'optimal' },
  { name: 'Skills', key: 'skills', percentage: 100, expectedType: 'array', nullCount: 0, totalRecords: 1, status: 'optimal' },
];

export const mockScrapers: Scraper[] = [{
  id: 'source-demo', name: 'Public Jobs Data Contract', targetDomain: 'pending-collector', collectorId: 'c_demo_pending', status: 'healthy', healthScore: 100,
  lastRunTime: timestamp, lastRunRecords: 1, avgLatencySeconds: 0, successRate: 100, proxyNetwork: 'Bright Data (pending live connection)', totalJobsExtracted: 1, schemaVersion: 'v1',
  fields: mockFieldQualities.map((item) => ({ field: item.name, type: item.expectedType, required: true, expected: true, actual: true, sampleValue: 'Available', matchRate: item.percentage })),
  metricsHistory: [{ timestamp, timeLabel: 'Now', health: 100, latency: 0, recordsExtracted: 1, successRate: 100 }],
}];

export const mockDashboardStats: DashboardStats = {
  jobsTracked: 1, jobsTrackedTrend: 0, companiesCount: 1, companiesTrend: 0, pipelineHealth: 100, pipelineHealthTrend: 0,
  successfulRuns: 0, successfulRunsToday: 0, systemStatus: 'healthy', openIncidentsCount: 0, resolvedIncidentsToday: 0, avgRecoveryTimeMinutes: 0,
};

export const mockRecentEvents: TimelineEvent[] = [{
  id: 'evt-demo', timestamp, timeFormatted: 'Awaiting first live run', type: 'completed', title: 'Source contract ready',
  description: 'Connect a Bright Data collector to replace the clearly labelled demo data.', collectorId: 'c_demo_pending',
}];

export const mockIncidents: Incident[] = [];

export const mockSettings: SystemSettings = {
  projectName: 'ScrapeGuard AI', environment: 'demo', dataSource: 'Public jobs collector', collectorId: 'c_demo_pending', autoHealingEnabled: true,
  healthMonitoringEnabled: true, notificationsEnabled: false, degradationThreshold: 80, backendApiUrl: 'http://localhost:8000', pollingIntervalSeconds: 300,
};

export const mockHealingSession: HealingSession = {
  id: 'heal-demo', incidentId: 'pending-live-incident', collectorId: 'c_demo_pending', source: 'Public jobs collector', startedAt: timestamp,
  currentStage: 'detect', healthDrop: { before: 100, lowest: 100, recovered: 100 }, diagnosedIssues: [],
  stages: {
    detect: { id: 'detect', label: 'Detect', title: 'Monitor source contract', description: 'Waiting for a real collector run.', status: 'active' },
    diagnose: { id: 'diagnose', label: 'Diagnose', title: 'Explain validation failure', description: 'Starts after a contract violation.', status: 'waiting' },
    heal: { id: 'heal', label: 'Heal', title: 'Request Scraper Studio repair', description: 'Runs bdata scraper heal.', status: 'waiting' },
    validate: { id: 'validate', label: 'Validate', title: 'Re-run and verify contract', description: 'Validates recovered records.', status: 'waiting' },
    recover: { id: 'recover', label: 'Recover', title: 'Resolve incident', description: 'Closes only after validation passes.', status: 'waiting' },
  },
  validationResults: { totalRecordsTested: 0, validCount: 0, schemaConformancePct: 0, passed: false },
  logs: [{ timestamp, level: 'info', message: 'Demo fallback active until a live Bright Data run is connected.' }],
};
