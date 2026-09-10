import React from 'react';
import { ClipboardList, PieChart, TrendingUp, ShieldCheck, AlertTriangle, Database, ExternalLink } from 'lucide-react';

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Icon className="text-indigo-600" size={20} /> {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function PipelineInsights({ actionPlan, skillCoverage, dispositions, statistics, validation, market, learningTargets }) {
  const hasAny = actionPlan || skillCoverage || (market?.length > 0) || validation || statistics || (learningTargets?.length > 0);
  if (!hasAny) {
    return (
      <div className="card p-6 text-center text-slate-500 text-sm">
        No pipeline transparency data returned for this analysis. See Raw Model JSON tab.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionPlan && (
        <Section icon={ClipboardList} title="Action Plan" subtitle={`Role: ${actionPlan.role || 'target role'} • ${actionPlan.roadmap_weeks ?? '?'} weeks • ${actionPlan.estimated_learning_hours ?? '?'} hrs`}>
          {(actionPlan.immediate_priority_skills?.length > 0) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Immediate priorities</p>
              <div className="flex flex-wrap gap-1.5">
                {actionPlan.immediate_priority_skills.map((s, i) => (
                  <span key={i} className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-800">{s}</span>
                ))}
              </div>
            </div>
          )}
          {Array.isArray(actionPlan.execution_order) && actionPlan.execution_order.length > 0 && (
            <div className="space-y-2">
              {actionPlan.execution_order.map((step, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                  <p className="font-bold text-slate-900">Phase {step.phase}: {step.name}</p>
                  {(step.skills?.length > 0) && <p className="text-slate-600 mt-1">Skills: {step.skills.join(', ')}</p>}
                  {(step.courses?.length > 0) && <p className="text-slate-600 mt-1">Courses: {step.courses.join(' • ')}</p>}
                  {(step.actions?.length > 0) && <p className="text-slate-600 mt-1">Actions: {step.actions.join(' • ')}</p>}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {skillCoverage && (
        <Section icon={PieChart} title="Skill Coverage Tiers" subtitle={`${skillCoverage.verified_course_count ?? 0} verified courses • ${skillCoverage.total_coverage_percentage ?? '?'}% total coverage`}>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(skillCoverage.tier_skills || {}).map(([tier, skills]) => (
              <div key={tier} className="rounded-xl border border-slate-100 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{tier.replaceAll('_', ' ')} ({(skills || []).length})</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(skills || []).map((s, i) => (
                    <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {dispositions?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-3">Skill</th>
                    <th className="py-2 pr-3">Disposition</th>
                    <th className="py-2">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {dispositions.map((d, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2 pr-3 font-bold text-slate-800">{d.skill}</td>
                      <td className="py-2 pr-3"><span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">{String(d.disposition).replaceAll('_', ' ')}</span></td>
                      <td className="py-2 text-slate-500">{d.resolution_details?.reason || d.resolution_details?.resource_title || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      {learningTargets?.length > 0 && (
        <Section icon={Database} title="Guidance-Only Learning Targets" subtitle="Missing skills with no verified catalog course">
          <div className="flex flex-wrap gap-1.5">
            {learningTargets.map((t, i) => (
              <span key={i} className="rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-1 text-xs font-bold text-amber-800">
                {t.skill || t.canonical_skill} ({t.priority || 'MEDIUM'})
              </span>
            ))}
          </div>
        </Section>
      )}

      {market?.length > 0 && (
        <Section icon={TrendingUp} title="Market Insights" subtitle="Live demand (Adzuna) per role • Bengaluru, IN">
          <div className="grid gap-3 md:grid-cols-2">
            {market.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="font-black text-slate-900 text-sm">{m.role}</p>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded-lg px-2 py-0.5 border border-blue-100">{m.candidate_fit_score ?? '?'}% fit</span>
                </div>
                <p className="text-xs text-slate-600">{m.market?.current_market?.job_count?.toLocaleString?.() ?? '?'} jobs • trend {m.market?.trend?.direction || '?'} ({m.market?.trend?.change_percentage ?? '?' }%)</p>
                <p className="text-[11px] text-slate-400">{m.recommendation?.category?.replaceAll('_', ' ')} — {m.recommendation?.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {validation && (
        <Section icon={ShieldCheck} title="Pipeline Validation" subtitle={`${validation.pipeline_status || ''} • readiness ${validation.production_readiness || ''}`}>
          {Array.isArray(validation.warnings) && validation.warnings.length > 0 && (
            <div className="space-y-2">
              {validation.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs text-slate-700">
                  <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
          {validation.checks && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(validation.checks).map(([k, v]) => (
                <span key={k} className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${v ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {v ? '✓' : '✗'} {k}
                </span>
              ))}
            </div>
          )}
          {statistics && (
            <p className="text-[11px] font-mono text-slate-400">
              {statistics.roles_available ?? '?'} roles • {statistics.roles_with_courses ?? '?'} with courses • {statistics.roles_with_roadmap ?? '?'} with roadmap • ranking consistent: {String(statistics.ranking_consistency)}
            </p>
          )}
        </Section>
      )}
    </div>
  );
}
