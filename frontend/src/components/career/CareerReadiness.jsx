import React from 'react';
import { BriefcaseBusiness, Gauge, Target, Trophy } from 'lucide-react';

function Metric({ label, value, icon: Icon, tone }) {
  if (!Number.isFinite(value)) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${tone}`}><Icon size={13} />{label}</div>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}%</p>
    </div>
  );
}

export default function CareerReadiness({ selectedRole, skillGaps }) {
  if (!selectedRole?.title) return null;
  const blockers = (Array.isArray(skillGaps) ? skillGaps : [])
    .filter((g) => (g.priority || '').toUpperCase() === 'HIGH')
    .slice(0, 5);
  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Top recommended role</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-black text-slate-900"><BriefcaseBusiness className="text-blue-600" size={22} />{selectedRole.title}</h2>
          {selectedRole.status && <p className="mt-1 text-sm text-slate-500">{selectedRole.status}</p>}
          <p className="mt-1 text-xs text-slate-400">Compare the domain scores before choosing your own career target.</p>
        </div>
        {selectedRole.summary && <p className="max-w-xl text-sm leading-6 text-slate-600">{selectedRole.summary}</p>}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Career readiness" value={selectedRole.readiness} icon={Gauge} tone="text-indigo-600" />
        <Metric label="Skill gap" value={selectedRole.skillGap} icon={Target} tone="text-amber-600" />
        <Metric label="Domain alignment" value={selectedRole.domainAlignment} icon={Trophy} tone="text-emerald-600" />
        <Metric label="Final role score" value={selectedRole.finalRoleScore} icon={Trophy} tone="text-blue-600" />
      </div>
      {selectedRole.whyRankedHere && (
        <p className="mt-4 text-xs font-mono text-slate-500 leading-relaxed">{selectedRole.whyRankedHere}</p>
      )}
      {blockers.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">What is lowering this score</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {blockers.map((b, i) => (
              <span key={i} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800">
                {b.skill || b} — close this gap to raise readiness
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
