import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Job, JobFilterOptions } from '../types';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobCard } from '../components/jobs/JobCard';
import { JobTable } from '../components/jobs/JobTable';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Briefcase,
  LayoutGrid,
  List,
  Download,
  SearchX,
  FileSpreadsheet,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filters
  const [search, setSearch] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getJobs({
        search,
        location: selectedLocation,
        experience: selectedExperience,
        skills: selectedSkill !== 'all' ? [selectedSkill] : [],
        source: selectedSource,
      });
      setJobs(res.jobs);
      setLocations(res.locations);
      setAllSkills(res.allSkills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, selectedLocation, selectedExperience, selectedSkill, selectedSource]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocation('all');
    setSelectedExperience('all');
    setSelectedSkill('all');
    setSelectedSource('all');
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Company', 'Location', 'Experience', 'Salary', 'Skills', 'Quality', 'Source'];
    const rows = jobs.map((j) => [
      `"${j.title}"`,
      `"${j.company}"`,
      `"${j.location}"`,
      `"${j.experience}"`,
      `"${j.salary}"`,
      `"${j.skills.join('; ')}"`,
      `"${j.qualityScore}%"`,
      `"${j.source}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scrapeguard_cutshort_jobs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-white">
              Job Intelligence
            </h1>
            <Badge variant="purple" size="sm">
              Schema v2.4.1
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Structured job data collected from public web sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-mono flex items-center gap-1 transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-mono flex items-center gap-1 transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Data Source Indicator Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Target Source: <strong className="text-slate-200 font-semibold">Cutshort (Public Web)</strong> • Collector ID: <span className="text-cyan-400">c_demo_cutshort</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Ingested & Validated: 12,482 records total</span>
        </div>
      </div>

      {/* Filters Container */}
      <JobFilters
        search={search}
        onSearchChange={setSearch}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedExperience={selectedExperience}
        onExperienceChange={setSelectedExperience}
        selectedSkill={selectedSkill}
        onSkillChange={setSelectedSkill}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        locations={locations}
        skills={allSkills}
        onReset={handleResetFilters}
        totalFiltered={jobs.length}
      />

      {/* Main Jobs Listing Content */}
      {loading ? (
        <LoadingState label="Filtering and structuring extracted records..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No Matching Records Extracted"
          description="Try broadening your search keywords or clearing filter criteria."
          action={
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        <JobTable jobs={jobs} onSelectJob={(job) => setSelectedJob(job)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={(job) => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {/* Modal for Raw Extracted JSON Inspection */}
      <JobDetailModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};
