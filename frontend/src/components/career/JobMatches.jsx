import React, { useState } from 'react';
import { Briefcase, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles, Building2 } from 'lucide-react';

export default function JobMatches({ jobMatches }) {
  const matches = Array.isArray(jobMatches) ? jobMatches : [];
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (matches.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        <Briefcase className="mx-auto mb-2 text-slate-300" size={32} />
        <p className="font-bold">No Job Matches Found</p>
        <p className="text-sm text-slate-400 mt-1">Upload a resume to generate semantic job matches.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={22} /> Semantic Job Matches
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ranked job matches computed via Hugging Face AI Vector Embeddings.
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
          {matches.length} Roles Analyzed
        </span>
      </div>

      <div className="grid gap-4">
        {matches.map((job, idx) => {
          const rank = job.rank ?? (idx + 1);
          const title = job.jobTitle || job.job_title || job.title || 'Role Recommendation';
          const company = job.company || '';
          const domain = job.domain || '';
          const matchScore = job.matchScore ?? Math.round((job.match_score ?? 0) * (job.match_score <= 1 ? 100 : 1));
          const matchedSkills = Array.isArray(job.matchedSkills) ? job.matchedSkills : (Array.isArray(job.matched_skills) ? job.matched_skills : []);
          const missingSkills = Array.isArray(job.missingSkills) ? job.missingSkills : (Array.isArray(job.missing_skills) ? job.missing_skills : []);
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 ${
                rank === 1
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 shadow-md'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                      rank === 1
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{rank}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                      {title}
                      {rank === 1 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          <Sparkles size={10} /> Top Match
                        </span>
                      )}
                    </h3>
                    {(company || domain) && (
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 mt-0.5">
                        {company && <span className="flex items-center gap-1"><Building2 size={12} /> {company}</span>}
                        {company && domain && <span>•</span>}
                        {domain && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">{domain}</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Match Score</span>
                    <span className="text-2xl font-black text-blue-600">{matchScore}%</span>
                  </div>
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition"
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-5 pb-2">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
                  />
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="p-5 pt-3 border-t border-slate-100 grid gap-4 md:grid-cols-2 bg-slate-50/50 rounded-b-2xl">
                  {/* Matched skills */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <h4 className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2">
                      <CheckCircle2 size={14} className="text-emerald-600" /> Matched Skills ({matchedSkills.length})
                    </h4>
                    {matchedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.map((sk, i) => (
                          <span key={i} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No direct matches recorded.</p>
                    )}
                  </div>

                  {/* Missing skills */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                    <h4 className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider mb-2">
                      <AlertCircle size={14} className="text-amber-600" /> Missing Skills ({missingSkills.length})
                    </h4>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((sk, i) => (
                          <span key={i} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                            • {sk}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-700 font-semibold">No missing skills detected for this role!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
