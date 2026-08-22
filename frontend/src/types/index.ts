/**
 * ScrapeGuard AI - Core Type Definitions
 * Structured for Bright Data Scraper Studio & FastAPI Backend integration
 */

export type SeverityLevel = 'critical' | 'warning' | 'info' | 'healthy';
export type IncidentStatus = 'open' | 'investigating' | 'healing' | 'validating' | 'resolved';
export type ScraperStatus = 'healthy' | 'degraded' | 'healing' | 'failing';
export type HealingStage = 'detect' | 'diagnose' | 'heal' | 'validate' | 'recover';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  experience: string;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills: string[];
  description: string;
  source: string;
  sourceUrl: string;
  collectorId: string;
  lastSeen: string;
  scrapedAt: string;
  qualityScore: number; // 0 - 100
  fieldValidity: {
    job_title: boolean;
    company: boolean;
    location: boolean;
    experience: boolean;
    salary: boolean;
    skills: boolean;
    description: boolean;
  };
}

export interface FieldQuality {
  name: string;
  key: keyof Job['fieldValidity'];
  percentage: number;
  expectedType: string;
  nullCount: number;
  totalRecords: number;
  status: 'optimal' | 'warning' | 'critical';
}

export interface ScraperMetricPoint {
  timestamp: string;
  timeLabel: string;
  health: number; // 0 - 100
  latency: number; // seconds
  recordsExtracted: number;
  successRate: number; // 0 - 100
  isIncident?: boolean;
  isHealing?: boolean;
}

export interface SchemaFieldContract {
  field: string;
  type: string;
  required: boolean;
  expected: boolean;
  actual: boolean;
  sampleValue: string;
  matchRate: number;
}

export interface Scraper {
  id: string;
  name: string;
  targetDomain: string;
  collectorId: string;
  status: ScraperStatus;
  healthScore: number;
  lastRunTime: string;
  lastRunRecords: number;
  avgLatencySeconds: number;
  successRate: number;
  proxyNetwork: string;
  totalJobsExtracted: number;
  schemaVersion: string;
  fields: SchemaFieldContract[];
  metricsHistory: ScraperMetricPoint[];
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  title: string;
  description: string;
  stage?: HealingStage;
  status: 'done' | 'in_progress' | 'pending';
}

export interface Incident {
  id: string; // e.g. INC-0042
  title: string;
  source: string;
  collectorId: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  detectedAt: string;
  resolvedAt?: string;
  timeAgo: string;
  affectedFields: string[];
  healthBefore: number;
  healthDuring: number;
  healthAfter: number;
  recordsAffected: number;
  rootCause: string;
  repairSummary: string;
  recoveryStatus: string;
  timeline: IncidentTimelineEvent[];
  selectorDiff?: {
    field: string;
    oldSelector: string;
    newSelector: string;
    confidence: number;
  }[];
}

export interface HealingStageDetail {
  id: HealingStage;
  label: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'waiting' | 'failed';
  timestamp?: string;
  details?: Record<string, any>;
}

export interface HealingSession {
  id: string;
  incidentId: string;
  collectorId: string;
  source: string;
  startedAt: string;
  completedAt?: string;
  currentStage: HealingStage;
  stages: Record<HealingStage, HealingStageDetail>;
  healthDrop: {
    before: number;
    lowest: number;
    recovered: number;
  };
  diagnosedIssues: {
    field: string;
    issue: string;
    confidence: number;
    fixApplied: string;
  }[];
  validationResults: {
    totalRecordsTested: number;
    validCount: number;
    schemaConformancePct: number;
    passed: boolean;
  };
  logs: {
    timestamp: string;
    level: 'info' | 'warn' | 'success' | 'error';
    message: string;
  }[];
}

export interface DashboardStats {
  jobsTracked: number;
  jobsTrackedTrend: number;
  companiesCount: number;
  companiesTrend: number;
  pipelineHealth: number;
  pipelineHealthTrend: number;
  successfulRuns: number;
  successfulRunsToday: number;
  systemStatus: 'healthy' | 'degraded' | 'healing';
  openIncidentsCount: number;
  resolvedIncidentsToday: number;
  avgRecoveryTimeMinutes: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: 'completed' | 'degradation' | 'healing' | 'validation' | 'recovery';
  title: string;
  description: string;
  incidentId?: string;
  collectorId: string;
}

export interface JobFilterOptions {
  search: string;
  location: string;
  experience: string;
  skills: string[];
  source: string;
  minSalary?: number;
  maxSalary?: number;
  qualityThreshold?: number;
}

export interface SystemSettings {
  projectName: string;
  environment: 'demo' | 'staging' | 'production';
  dataSource: string;
  collectorId: string;
  autoHealingEnabled: boolean;
  healthMonitoringEnabled: boolean;
  notificationsEnabled: boolean;
  degradationThreshold: number; // e.g. 90%
  backendApiUrl: string;
  pollingIntervalSeconds: number;
}
