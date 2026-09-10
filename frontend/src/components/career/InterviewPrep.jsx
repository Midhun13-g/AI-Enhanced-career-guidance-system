import React, { useMemo } from 'react';
import { MessageSquareText, Code2, UserCheck, ListChecks } from 'lucide-react';

function Q({ tag, text }) {
  return (
    <div className="rounded-xl bg-white border border-slate-100 p-3 text-xs shadow-sm">
      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{tag}</span>
      <p className="font-semibold text-slate-800 leading-relaxed">{text}</p>
    </div>
  );
}

export default function InterviewPrep({ skillGap, courses, resume, roleTitle }) {
  const gaps = Array.isArray(skillGap?.gaps) ? skillGap.gaps : [];
  const projects = Array.isArray(resume?.projects) ? resume.projects : [];
  const role = roleTitle || 'target role';

  const { tech, projectQs, readiness } = useMemo(() => {
    const prioRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const sorted = [...gaps].sort((a, b) => (prioRank[a.priority] ?? 1) - (prioRank[b.priority] ?? 1));
    const tech = sorted.slice(0, 8).map((g) => {
      const skill = g.skill || 'skill';
      const course = (courses || []).find((c) => (c.targetSkill || '').toLowerCase() === String(skill).toLowerCase());
      return {
        skill,
        priority: g.priority || 'MEDIUM',
        questions: [
          `Explain the core concepts of ${skill} and where you have applied it.`,
          `Hands-on: walk through how you would use ${skill} in a ${role} task end-to-end.`,
          ...(course ? [`You are taking “${course.title}” — what are the 3 key takeaways you would revise before the interview?`] : []),
        ],
      };
    });
    const projectQs = projects.slice(0, 3).map((p) => {
      const name = typeof p === 'string' ? p : p.name || p.title || 'your project';
      return `Deep-dive into “${name}”: architecture, your contribution, and one hard bug you fixed.`;
    });
    const coverage = skillGap?.coverage;
    const readiness = coverage ? [
      { label: 'Required skills', value: Math.round(Number(coverage.required?.coverage_percentage ?? 0)) },
      { label: 'Preferred skills', value: Math.round(Number(coverage.preferred?.coverage_percentage ?? 0)) },
      { label: 'Soft skills', value: Math.round(Number(coverage.soft?.coverage_percentage ?? 0)) },
    ] : [];
    return { tech, projectQs, readiness };
  }, [gaps, courses, projects, role, skillGap]);

  // Gap-closing suggested projects: pair HIGH/MEDIUM missing skills (rule-based, labeled)
  const suggested = useMemo(() => {
    const pool = gaps.filter((g) => ['HIGH', 'MEDIUM'].includes((g.priority || '').toUpperCase())).map((g) => g.skill).filter(Boolean);
    const out = [];
    for (let i = 0; i + 1 < pool.length && out.length < 3; i += 2) {
      const pair = [pool[i], pool[i + 1]];
      const covers = Math.round((2 / Math.max(1, gaps.length)) * 100);
      out.push({ skills: pair, covers });
    }
    return out;
  }, [gaps]);

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquareText className="text-blue-600" size={22} /> Interview Preparation — {role}
        </h2>
        <p className="text-sm text-slate-500">Prioritized by your actual skill gaps (HIGH first). Practice prompts, not scores.</p>

        {readiness.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {readiness.map((r) => (
              <div key={r.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{r.label}</p>
                <p className="text-xl font-black text-slate-900">{r.value}%</p>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5"><ListChecks size={13} /> Technical questions (weakness-first)</h3>
          <div className="space-y-3">
            {tech.length > 0 ? tech.map((t, i) => (
              <div key={i}>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">{t.skill} • {t.priority} priority</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {t.questions.map((q, j) => <Q key={j} tag={`Q${j + 1}`} text={q} />)}
                </div>
              </div>
            )) : <p className="text-xs text-slate-400 italic">No skill gaps — revise your strongest skills instead.</p>}
          </div>
        </div>

        {projectQs.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Project questions (from your resume)</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {projectQs.map((q, i) => <Q key={i} tag="Project" text={q} />)}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5"><UserCheck size={13} /> General HR</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <Q tag="HR" text="Walk me through your resume in 2 minutes, ending with why this role." />
            <Q tag="HR" text="Describe a conflict or blocker in a team project and how you resolved it." />
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-3">
        <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
          <Code2 size={17} className="text-teal-600" /> Gap-closing project ideas
        </h3>
        <p className="text-[11px] text-slate-400">Suggested practice projects generated from your missing skills — pick one that covers your HIGH gaps.</p>
        {suggested.length > 0 ? suggested.map((s, i) => (
          <div key={i} className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-xs">
            <p className="font-black text-slate-900 text-sm">Project {i + 1}: {s.skills.join(' + ')} build</p>
            <p className="text-slate-600 mt-1">Skills covered: {s.skills.join(', ')} — approximately {s.covers}% of your current skill gaps.</p>
          </div>
        )) : <p className="text-xs text-slate-400 italic">No missing skills — build an advanced portfolio piece in your top domain instead.</p>}
      </div>
    </div>
  );
}
