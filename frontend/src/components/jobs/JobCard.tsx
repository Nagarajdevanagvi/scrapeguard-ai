import React from 'react';
import { Job } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { MapPin, Briefcase, IndianRupee, Clock, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  return (
    <Card hoverEffect className="space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Title & Quality Badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs font-mono text-cyan-300 font-medium mt-0.5">
              {job.company}
            </p>
          </div>

          <Badge variant="success" size="sm" className="shrink-0 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {job.qualityScore}% Quality
          </Badge>
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {job.location} {job.isRemote && '(Remote)'}
          </span>
          <span className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
            <Briefcase className="w-3 h-3 text-sky-400" />
            {job.experience}
          </span>
          <span className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-800 text-emerald-400 font-semibold">
            <IndianRupee className="w-3 h-3 text-emerald-400" />
            {job.salary}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.lastSeen}
          </span>
          <span>•</span>
          <span className="text-slate-400">Source: {job.source}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelect(job)}
          rightIcon={<ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
        >
          Inspect Extracted JSON
        </Button>
      </div>
    </Card>
  );
};
