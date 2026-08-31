import React from 'react';
import { Target, CheckCircle2, Compass, Award, BarChart2 } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function CareerAnalysis({ career, careerAnalysis, careerGuidance }) {
  const analysis = career || careerAnalysis || {};
  const guidance = careerGuidance || {};

  const domainConfidence = typeof analysis.domainConfidence === 'number'
    ? Math.round(analysis.domainConfidence)
    : (typeof analysis.overall_career_fit === 'number'
        ? Math.round(analysis.overall_career_fit * (analysis.overall_career_fit <= 1 ? 100 : 1))
        : (typeof guidance.overall_fit === 'number'
            ? Math.round(guidance.overall_fit * (guidance.overall_fit <= 1 ? 100 : 1))
            : null));

  const recommendedDomain =
    analysis.primaryDomain ||
    analysis.recommended_domain ||
    analysis.primary_domain ||
    guidance.primary_domain ||
    '';

  const strongAreas = Array.isArray(analysis.strong_areas)
    ? analysis.strong_areas
    : (Array.isArray(guidance.strengths) ? guidance.strengths : []);

  const improvementAreas = Array.isArray(analysis.improvement_areas)
    ? analysis.improvement_areas
    : (Array.isArray(guidance.improvement_areas) ? guidance.improvement_areas : []);

  // Dynamic domain score breakdown from API
  const domainScores = analysis.domainScores || analysis.domain_scores || guidance.domain_analysis || analysis.domains || null;

  const radarData = domainScores && typeof domainScores === 'object'
    ? Object.entries(domainScores).map(([domain, val]) => ({
        subject: domain.replaceAll('_', ' '),
        score: typeof val === 'number'
          ? Math.round(val * (val <= 1 ? 100 : 1))
          : Math.round(Number(val?.confidence ?? val?.score ?? 0) * (Number(val?.confidence ?? val?.score ?? 0) <= 1 ? 100 : 1)),
        fullMark: 100,
      })).filter((item) => item.score > 0)
    : [];

  return (
    <div className="card p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Compass className="text-blue-600" size={22} /> Career Domain Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Multidimensional domain alignment and career fit evaluation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fit score & domain card */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest matching domain</span>
              <Award className="text-amber-400" size={20} />
            </div>
            <h3 className="text-2xl font-black mt-1 text-white">{recommendedDomain}</h3>
            <p className="mt-1 text-xs text-slate-300">This is a recommendation, not an automatically selected target.</p>
            
            {domainConfidence !== null && (
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                  <span>Domain confidence</span>
                  <span className="text-amber-300 font-extrabold text-sm">{domainConfidence}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-700/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-1000"
                    style={{ width: `${domainConfidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Strong Areas */}
          {strongAreas.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" /> Key Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {strongAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {typeof area === 'string' ? area : JSON.stringify(area)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Areas */}
          {improvementAreas.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Target size={14} className="text-amber-500" /> Improvement Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {improvementAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800"
                  >
                    <Target size={12} className="text-amber-600" />
                    {typeof area === 'string' ? area : JSON.stringify(area)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Domain Radar / Breakdown Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-center items-center min-h-[300px]">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 w-full text-left">
            All detected domain scores
          </h4>
          {radarData.length > 0 ? (
            <div className="w-full">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                  <Radar
                    name="Domain evidence score"
                    dataKey="score"
                    stroke="#4f46e5"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  />
                </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-2">
                {radarData.map((item) => (
                  <div key={item.subject}>
                    <div className="mb-1 flex justify-between gap-3 text-xs font-bold text-slate-600 capitalize">
                      <span>{item.subject}</span><span>{item.score}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <BarChart2 className="mx-auto text-slate-300" size={32} />
              <p className="text-xs font-bold">No additional domain scores were returned for this analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
