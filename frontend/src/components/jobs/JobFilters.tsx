import React from 'react';
import { Search, MapPin, Award, Layers, X, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

export interface JobFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedLocation: string;
  onLocationChange: (val: string) => void;
  selectedExperience: string;
  onExperienceChange: (val: string) => void;
  selectedSkill: string;
  onSkillChange: (val: string) => void;
  selectedSource: string;
  onSourceChange: (val: string) => void;
  locations: string[];
  skills: string[];
  onReset: () => void;
  totalFiltered: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  search,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  selectedExperience,
  onExperienceChange,
  selectedSkill,
  onSkillChange,
  selectedSource,
  onSourceChange,
  locations,
  skills,
  onReset,
  totalFiltered,
}) => {
  const hasActiveFilters =
    search ||
    selectedLocation !== 'all' ||
    selectedExperience !== 'all' ||
    selectedSkill !== 'all' ||
    selectedSource !== 'all';

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
      {/* Top Search Row */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, company, technology (e.g. Senior Full Stack, Go, Bangalore)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<X className="w-3.5 h-3.5" />}
            className="text-slate-400 hover:text-slate-200 shrink-0"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Select Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
        {/* Location */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-sky-400" />
            Experience
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => onExperienceChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Experience</option>
            <option value="1–3">1–3 years</option>
            <option value="2–5">2–5 years</option>
            <option value="3–6">3–6 years</option>
            <option value="4–8">4–8 years</option>
            <option value="5–8">5–8+ years</option>
          </select>
        </div>

        {/* Skills */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            Primary Skill
          </label>
          <select
            value={selectedSkill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Skills</option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Data Source */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            Source Platform
          </label>
          <select
            value={selectedSource}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Sources (Cutshort)</option>
            <option value="Cutshort">Cutshort.io (Public)</option>
          </select>
        </div>
      </div>

      {/* Filter Stats Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          Showing <span className="text-white font-semibold">{totalFiltered}</span> records matching criteria
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-slate-400">Schema Validation: Strict</span>
        </div>
      </div>
    </div>
  );
};
