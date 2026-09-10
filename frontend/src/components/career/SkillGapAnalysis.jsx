import React from 'react';
import { Target, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const PRIORITY_CONFIG = {
  HIGH: {
    label: 'High Priority',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800 border-red-200',
    icon: ShieldAlert,
    iconColor: 'text-red-600',
  },
  MEDIUM: {
    label: 'Medium Priority',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  LOW: {
    label: 'Low Priority',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
  },
};

export default function SkillGapAnalysis({ skillGaps, coverage, summary }) {
  const gaps = Array.isArray(skillGaps) ? skillGaps : [];

  const tiers = coverage ? [
    { key: 'required', label: 'Required', data: coverage.required, tone: 'bg-red-500' },
    { key: 'preferred', label: 'Preferred', data: coverage.preferred, tone: 'bg-amber-500' },
    { key: 'soft', label: 'Soft skills', data: coverage.soft, tone: 'bg-blue-500' },
  ].filter((t) => t.data) : [];

  // Group by priority from backend response
  const grouped = {
    HIGH: [],
    MEDIUM: [],
    LOW: [],
  };

  gaps.forEach((g) => {
    const prio = (g.priority || 'MEDIUM').toUpperCase();
    if (grouped[prio]) {
      grouped[prio].push(g);
    } else {
      grouped.MEDIUM.push(g);
    }
  });

  return (
    <div className="card p-6 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Target className="text-red-500" size={22} /> Skill Gap Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Identified missing competencies prioritized by market demand and job requirement frequency.
        </p>
      </div>

      {gaps.length === 0 ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center text-emerald-800 font-bold">
          ✓ Excellent! No critical skill gaps detected for your target domain.
        </div>
      ) : (
        <>
          {tiers.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {tiers.map((t) => {
                const cov = Math.round(Number(t.data.coverage_percentage ?? 0));
                const matched = (t.data.matched_skills || []).length;
                const total = Number(t.data.total ?? (matched + (t.data.missing_skills || []).length)) || 0;
                return (
                  <div key={t.key} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="uppercase tracking-wider">{t.label} coverage</span>
                      <span>{cov}% ({matched}/{total})</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                      <div className={`h-full rounded-full ${t.tone}`} style={{ width: `${cov}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {summary && (
            <p className="text-[11px] font-mono text-slate-400">
              {summary.skills_you_have_count ?? '?'} skills verified • {summary.skills_to_learn_count ?? '?'} to learn • {summary.required_missing_count ?? 0} required missing
            </p>
          )}
        <div className="grid gap-6 md:grid-cols-3">
          {['HIGH', 'MEDIUM', 'LOW'].map((prioKey) => {
            const config = PRIORITY_CONFIG[prioKey];
            const items = grouped[prioKey];
            const Icon = config.icon;

            return (
              <div
                key={prioKey}
                className={`rounded-2xl border ${config.border} ${config.bg} p-5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${config.badge}`}>
                      <Icon size={14} className={config.iconColor} />
                      {config.label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {items.length} Skill{items.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {items.length > 0 ? (
                    <div className="space-y-2.5">
                      {items.map((g, idx) => {
                        const skillName = typeof g === 'string' ? g : g.skill || g.name || JSON.stringify(g);
                        const reason = typeof g === 'object' && g.reason ? g.reason : null;

                        return (
                          <div key={idx} className="rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
                            <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                              {skillName}
                            </p>
                            {reason && (
                              <p className="text-xs text-slate-500 mt-1 pl-3.5 leading-relaxed">
                                {reason}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4 text-center">
                      No {prioKey.toLowerCase()} priority skill gaps.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
