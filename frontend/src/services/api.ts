/**
 * ScrapeGuard AI - API Service Abstraction
 * 
 * Cleanly abstracts data access so that mock data can be seamlessly replaced
 * by a FastAPI backend (e.g. GET /api/dashboard, GET /api/jobs, etc.)
 */

import {
  DashboardStats,
  FieldQuality,
  Incident,
  Job,
  Scraper,
  SystemSettings,
  HealingSession,
  JobFilterOptions,
} from '../types';
import {
  mockDashboardStats,
  mockFieldQualities,
  mockIncidents,
  mockJobs,
  mockScrapers,
  mockSettings,
  mockHealingSession,
} from '../data/mockData';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

// In-memory state store to support interactive client-side demo simulations
let currentSettings = { ...mockSettings };
let currentIncidents = [...mockIncidents];
let currentJobs = [...mockJobs];
let activeHealingSession = { ...mockHealingSession };

async function getLive<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  /**
   * Get overall dashboard metrics & pipeline status
   * Corresponds to: GET /api/dashboard
   */
  async getDashboardStats(): Promise<{
    stats: DashboardStats;
    fieldQualities: FieldQuality[];
    primaryScraper: Scraper;
  }> {
    try {
      const live = await getLive<{ stats: DashboardStats; fieldQualities: FieldQuality[]; primaryScraper: Scraper | null }>('/api/dashboard');
      if (live.primaryScraper) return { stats: live.stats, fieldQualities: live.fieldQualities, primaryScraper: live.primaryScraper };
    } catch {
      // The fallback is intentionally limited to a local/offline first-run experience.
    }
    return { stats: mockDashboardStats, fieldQualities: mockFieldQualities, primaryScraper: mockScrapers[0] };
  },

  /**
   * Get list of jobs with filtering, search, and pagination
   * Corresponds to: GET /api/jobs
   */
  async getJobs(options?: Partial<JobFilterOptions>): Promise<{
    jobs: Job[];
    total: number;
    locations: string[];
    allSkills: string[];
  }> {
    try {
      const live = await getLive<Job[]>('/api/jobs');
      currentJobs = live.length ? live : mockJobs;
    } catch {
      currentJobs = mockJobs;
    }
    let filtered = [...currentJobs];

    if (options?.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (options?.location && options.location !== 'all') {
      filtered = filtered.filter((j) =>
        options.location === 'Remote' ? j.isRemote : j.location.toLowerCase().includes(options.location.toLowerCase())
      );
    }

    if (options?.experience && options.experience !== 'all') {
      filtered = filtered.filter((j) => j.experience.includes(options.experience));
    }

    if (options?.skills && options.skills.length > 0) {
      filtered = filtered.filter((j) =>
        options.skills!.some((s) => j.skills.includes(s))
      );
    }

    if (options?.source && options.source !== 'all') {
      filtered = filtered.filter((j) => j.source.toLowerCase() === options.source?.toLowerCase());
    }

    const locations = Array.from(new Set(currentJobs.map((j) => j.isRemote ? 'Remote' : j.location))).sort();
    const allSkills = Array.from(new Set(currentJobs.flatMap((j) => j.skills))).sort();

    return {
      jobs: filtered,
      total: filtered.length,
      locations,
      allSkills,
    };
  },

  /**
   * Get single job detail by ID
   * Corresponds to: GET /api/jobs/:id
   */
  async getJob(id: string): Promise<Job | null> {
    await new Promise((r) => setTimeout(r, 80));
    return currentJobs.find((j) => j.id === id) || null;
  },

  /**
   * Get all registered collectors and their health status
   * Corresponds to: GET /api/scrapers
   */
  async getScrapers(): Promise<Scraper[]> {
    try {
      const live = await getLive<Scraper[]>('/api/scrapers');
      return live.length ? live : mockScrapers;
    } catch {
      return mockScrapers;
    }
  },

  /**
   * Get single scraper health & schema details
   * Corresponds to: GET /api/scrapers/:id
   */
  async getScraper(id: string): Promise<Scraper | null> {
    const scrapers = await this.getScrapers();
    return scrapers.find((s) => s.id === id || s.collectorId === id) || scrapers[0] || null;
  },

  /**
   * Get list of incidents
   * Corresponds to: GET /api/incidents
   */
  async getIncidents(): Promise<Incident[]> {
    try {
      const live = await getLive<Incident[]>('/api/incidents');
      currentIncidents = live.length ? live : mockIncidents;
    } catch {
      currentIncidents = mockIncidents;
    }
    return currentIncidents;
  },

  /**
   * Get single incident details with full timeline and selector diff
   * Corresponds to: GET /api/incidents/:id
   */
  async getIncident(id: string): Promise<Incident | null> {
    await new Promise((r) => setTimeout(r, 80));
    return currentIncidents.find((i) => i.id === id) || currentIncidents[0] || null;
  },

  /**
   * Get active or historic self-healing session
   * Corresponds to: GET /api/healing/:id
   */
  async getHealingStatus(sessionId: string = 'heal-0042'): Promise<HealingSession> {
    await new Promise((r) => setTimeout(r, 100));
    return activeHealingSession;
  },

  /**
   * Run interactive demo simulation for self-healing workflow
   * Corresponds to: POST /api/healing/demo
   */
  async runRecoverySimulation(scenario: string = 'location_degradation'): Promise<{
    session: HealingSession;
    message: string;
  }> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      session: activeHealingSession,
      message: 'Recovery demo session initialized successfully.',
    };
  },

  /**
   * Simulate a collector live probe test
   * Corresponds to: POST /api/scrapers/:id/test
   */
  async testScraper(collectorId: string): Promise<{
    success: boolean;
    latencyMs: number;
    recordsExtracted: number;
    schemaConformancePct: number;
    sampleRecord: Partial<Job>;
    logs: string[];
  }> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      latencyMs: 1420,
      recordsExtracted: 248,
      schemaConformancePct: 99.4,
      sampleRecord: {
        title: 'Lead Software Architect',
        company: 'CloudPulse Analytics',
        location: 'Bangalore (Hybrid)',
        experience: '4–7 years',
        salary: '₹28–36 LPA',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      },
      logs: [
        'Connecting to Bright Data Web Unlocker proxy...',
        'Dispatching browser worker to target domain (cutshort.io)...',
        'HTTP 200 OK received in 420ms',
        'Executing recipe v2.4.1 selector rules...',
        'Extracting fields: title, company, location, experience, salary, skills, description',
        'Schema contract check: 7/7 fields valid. Conformance rate: 99.4%',
      ],
    };
  },

  /**
   * Get system configuration settings
   * Corresponds to: GET /api/settings
   */
  async getSettings(): Promise<SystemSettings> {
    await new Promise((r) => setTimeout(r, 80));
    return currentSettings;
  },

  /**
   * Update system configuration settings
   * Corresponds to: PUT /api/settings
   */
  async updateSettings(newSettings: Partial<SystemSettings>): Promise<SystemSettings> {
    await new Promise((r) => setTimeout(r, 150));
    currentSettings = { ...currentSettings, ...newSettings };
    return currentSettings;
  },

  /**
   * Health check utility to test backend connectivity if configured
   * Corresponds to: GET /api/health
   */
  async checkBackendHealth(): Promise<{ status: 'mock' | 'connected'; url: string; latency?: number }> {
    try {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}/api/health`, { method: 'GET', signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        return { status: 'connected', url: BASE_URL, latency: Date.now() - start };
      }
    } catch {
      // Expected in demo/offline mode
    }
    return { status: 'mock', url: BASE_URL };
  },
};
