import React from 'react';
import { Job } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export interface JobTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

export const JobTable: React.FC<JobTableProps> = ({ jobs, onSelectJob }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] tracking-wider border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">Role & Company</th>
            <th className="py-3 px-4">Location</th>
            <th className="py-3 px-4">Experience</th>
            <th className="py-3 px-4">Compensation</th>
            <th className="py-3 px-4">Extracted Tech Stack</th>
            <th className="py-3 px-4">Extraction Quality</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800/60 font-sans">
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
            >
              {/* Job & Company */}
              <td className="py-3 px-4">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {job.title}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-mono">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{job.company}</span>
                  </div>
                </div>
              </td>

              {/* Location */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{job.location}</span>
                  {job.isRemote && (
                    <Badge variant="purple" size="sm" className="ml-1 text-[10px]">
                      Remote
                    </Badge>
                  )}
                </div>
              </td>

              {/* Experience */}
              <td className="py-3 px-4 font-mono text-slate-300">
                {job.experience}
              </td>

              {/* Salary */}
              <td className="py-3 px-4 font-mono font-semibold text-emerald-400">
                {job.salary}
              </td>

              {/* Skills */}
              <td className="py-3 px-4 max-w-xs">
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-850 text-slate-400">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
              </td>

              {/* Data Quality */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1.5 font-mono">
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {job.qualityScore}%
                  </Badge>
                  <span className="text-[10px] text-slate-400">7/7 fields</span>
                </div>
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectJob(job);
                  }}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                >
                  Audit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
