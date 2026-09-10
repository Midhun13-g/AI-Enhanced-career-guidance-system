import React, { useMemo, useState } from 'react';
import { GitCompare, ArrowRight, AlertCircle, CheckCircle2, Milestone } from 'lucide-react';

function effortFor(missingCount) {
  if (missingCount <= 3) return 'Low';
  if (missingCount <= 7) return 'Medium';
  return 'High';
}

function RoleCard({ role, selected, onSelect, badge }) {
  if (!role) return null;
  return (
    <button
      onClick={onSelect}
      className={`flex-1 rounded-2xl border p-4 text-left transition-all ${selected ? 'border-blue-500 bg-blue-50/60 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{badge}</p>
      <p className="mt-1 font-black text-slate-900">{role.jobTitle}</p>
      <p className="mt-1 text-xs font-mono text-slate-500">
        {role.matchScore}% fit • {(role.matchedSkills || []).length} matched • {(role.missingSkills || []).length} missing
      </p>
    </button>
  );
}

export default function CareerWhatIf({ jobMatches, courses }) {
  const roles = Array.isArray(jobMatches) ? jobMatches : [];
  const [aIdx, setAIdx] = useState(0);
  const [bIdx, setBIdx] = useState(1);

  const compare = useMemo(() => {
    const A = roles[aIdx];
    const B = roles[bIdx];
    if (!A || !B || aIdx === bIdx) return null;
    const shared = (A.matchedSkills || []).filter((s) => (B.matchedSkills || []).map(String).includes(String(s)));
    const bMissingCoveredByA = (B.missingSkills || []).filter((s) => (A.matchedSkills || []).map((x) => String(x).toLowerCase()).includes(String(s).toLowerCase()));
    const lower = A.matchScore >= B.matchScore ? B : A;
    const higher = A.matchScore >= B.matchScore ? A : B;
    const lowerHighGaps = (lower.skillsToLearn || []).filter((s) => (s.priority || '').toUpperCase() === 'HIGH');
    return { A, B, shared, bMissingCoveredByA, lower, higher, lowerHighGaps };
  }, [roles, aIdx, bIdx]);

  if (roles.length < 2) {
    return <div className="card p-6 text-center text-sm text-slate-400">Need at least 2 role matches to compare.</div>;
  }

  const courseFor = (skill) => (courses || []).find((c) => (c.targetSkill || '').toLowerCase() === String(skill).toLowerCase());

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <GitCompare className="text-blue-600" size={22} /> Career What-If Simulator
        </h2>
        <p className="text-sm text-slate-500">Calculated from your actual profile — pick two roles to compare transition cost.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <RoleCard role={roles[aIdx]} badge="Option A" selected onSelect={() => {}} />
          <RoleCard role={roles[bIdx]} badge="Option B" selected onSelect={() => {}} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1].map((slot) => (
            <select
              key={slot}
              value={slot === 0 ? aIdx : bIdx}
              onChange={(e) => (slot === 0 ? setAIdx(Number(e.target.value)) : setBIdx(Number(e.target.value)))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 bg-white"
            >
              {roles.map((r, i) => <option key={i} value={i}>{r.jobTitle} ({r.matchScore}%)</option>)}
            </select>
          ))}
        </div>

        {compare && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-3">Dimension</th>
                  <th className="py-2 pr-3">{compare.A.jobTitle}</th>
                  <th className="py-2">{compare.B.jobTitle}</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-2 [&_td]:pr-3 [&_tr]:border-b [&_tr]:border-slate-50">
                <tr><td className="font-bold text-slate-500">Current fit</td><td className="font-black text-slate-900">{compare.A.matchScore}%</td><td className="font-black text-slate-900">{compare.B.matchScore}%</td></tr>
                <tr><td className="font-bold text-slate-500">Matched skills</td><td>{(compare.A.matchedSkills || []).length}</td><td>{(compare.B.matchedSkills || []).length}</td></tr>
                <tr><td className="font-bold text-slate-500">Missing skills</td><td>{(compare.A.missingSkills || []).length}</td><td>{(compare.B.missingSkills || []).length}</td></tr>
                <tr><td className="font-bold text-slate-500">Readiness</td><td>{compare.A.readiness != null ? `${Math.round(Number(compare.A.readiness))}%` : '—'}</td><td>{compare.B.readiness != null ? `${Math.round(Number(compare.B.readiness))}%` : '—'}</td></tr>
                <tr><td className="font-bold text-slate-500">Learning effort</td><td>{effortFor((compare.A.missingSkills || []).length)}</td><td>{effortFor((compare.B.missingSkills || []).length)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {compare && (
        <div className="card p-6 space-y-3">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
            <AlertCircle size={17} className="text-amber-600" /> Why not {compare.lower.jobTitle} ({compare.lower.matchScore}%)?
          </h3>
          {compare.lowerHighGaps.length > 0 ? (
            <div className="space-y-2">
              {compare.lowerHighGaps.slice(0, 5).map((g, i) => {
                const c = courseFor(g.skill);
                return (
                  <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs">
                    <p className="font-bold text-slate-800">Missing HIGH-priority: {g.skill}</p>
                    <p className="text-slate-600 mt-0.5">How to become ready: {c ? `take “${c.title}”${c.url ? '' : ' (search link provided)'}.` : 'follow the roadmap phase covering this skill.'}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No HIGH-priority gaps recorded — gap is {(compare.lower.missingSkills || []).length} skill(s): {(compare.lower.missingSkills || []).slice(0, 6).join(', ') || 'none listed'}.</p>
          )}
          {compare.lower.whyRankedHere && <p className="text-[11px] font-mono text-slate-400 leading-relaxed">{compare.lower.whyRankedHere}</p>}
        </div>
      )}

      {compare && (
        <div className="card p-6 space-y-3">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
            <Milestone size={17} className="text-indigo-600" /> Transition path
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs font-bold">
            <span className="rounded-xl bg-slate-900 text-white px-3 py-2">{compare.A.jobTitle}</span>
            <span className="flex items-center gap-1 text-slate-400 justify-center"> <ArrowRight size={14} /> {compare.shared.length} shared skills </span>
            <span className="rounded-xl bg-blue-600 text-white px-3 py-2">{compare.B.jobTitle}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Shared strengths: {compare.shared.length > 0 ? compare.shared.slice(0, 8).join(', ') : 'none recorded'}.
            {compare.bMissingCoveredByA.length > 0 && ` Your ${compare.A.jobTitle} strengths already cover ${compare.bMissingCoveredByA.length} of ${compare.B.jobTitle}'s gaps (${compare.bMissingCoveredByA.slice(0, 5).join(', ')}).`}
            {' '}Remaining to learn for {compare.B.jobTitle}: {(compare.B.missingSkills || []).length} skills — effort {effortFor((compare.B.missingSkills || []).length)}.
          </p>
          <p className="text-[11px] font-mono text-emerald-700 flex items-center gap-1"><CheckCircle2 size={12} /> Transition is additive — nothing already learned is lost.</p>
        </div>
      )}
    </div>
  );
}
