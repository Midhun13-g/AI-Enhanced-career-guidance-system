import React from 'react';
import { Award, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

export default function CareerGuidance({ careerGuidance }) {
  const guidance = careerGuidance ?? {};
  const recommendedRoles = Array.isArray(guidance.recommended_roles)
    ? guidance.recommended_roles
    : (Array.isArray(guidance.recommendedRoles) ? guidance.recommendedRoles : []);

  if (recommendedRoles.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-500">
        <Award className="mx-auto mb-2 text-slate-300" size={32} />
        <p className="font-bold">No Career Role Recommendations Found</p>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="text-blue-600" size={22} /> Recommended Career Paths
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Target role trajectory ranked by readiness, skill coverage, and domain fit.
          </p>
        </div>
        <span className="rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 border border-blue-100">
          {recommendedRoles.length} Targeted Paths
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendedRoles.map((role, idx) => {
          const rank = role.rank ?? (idx + 1);
          const roleName = role.role_name || role.role || role.title || `Career Role #${rank}`;
          const careerFit = Math.round((role.career_fit ?? role.fit_score ?? 85) * (role.career_fit <= 1 ? 100 : 1));
          const readiness = Math.round((role.readiness ?? role.readiness_score ?? 75) * (role.readiness <= 1 ? 100 : 1));
          const domainScore = Math.round((role.domain_score ?? 80) * (role.domain_score <= 1 ? 100 : 1));

          const strengths = Array.isArray(role.strengths) ? role.strengths : [];
          const missingSkills = Array.isArray(role.missing_skills) ? role.missing_skills : [];

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                rank === 1
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 shadow-md'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-black text-xs ${
                      rank === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{rank}
                  </span>
                  {rank === 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Sparkles size={10} /> Optimal Path
                    </span>
                  )}
                </div>

                <h3 className="font-black text-slate-900 text-lg leading-snug">{roleName}</h3>

                {/* Scores */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-blue-50 p-2.5 border border-blue-100">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Career Fit</span>
                    <span className="text-lg font-black text-blue-900">{careerFit}%</span>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-2.5 border border-indigo-100">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Readiness</span>
                    <span className="text-lg font-black text-indigo-900">{readiness}%</span>
                  </div>
                </div>

                {/* Key Strengths */}
                {strengths.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Strengths</span>
                    {strengths.slice(0, 3).map((st, i) => (
                      <p key={i} className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" /> {st}
                      </p>
                    ))}
                  </div>
                )}

                {/* Missing Skills */}
                {missingSkills.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Skills to Acquire</span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.slice(0, 4).map((sk, i) => (
                        <span key={i} className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Domain Match</span>
                <span className="font-bold text-slate-800">{domainScore}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
