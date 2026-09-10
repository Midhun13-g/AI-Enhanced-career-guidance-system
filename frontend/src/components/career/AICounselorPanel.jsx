import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';

const QUICK = [
  'Why was this career recommended?',
  'What should I learn next?',
  'What skills am I missing?',
  'Am I placement ready?',
  'How can I improve my readiness?',
];

export default function AICounselorPanel({ normalized }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'I answer only from your analyzed profile — no invented data. Ask me why a role fits, what to learn next, or whether you are placement ready.' },
  ]);
  const [input, setInput] = useState('');

  const answer = (q) => {
    const s = q.toLowerCase();
    const career = normalized?.career;
    const gaps = normalized?.skillGap?.gaps || [];
    const courses = normalized?.courses || [];
    const roadmap = normalized?.roadmap || [];
    const top = (normalized?.jobMatches || [])[0];
    const high = gaps.filter((g) => (g.priority || '').toUpperCase() === 'HIGH');

    if (/why.*recommend|why.*role|why.*fit|why this/.test(s)) {
      return `Top role “${top?.jobTitle || career?.selectedRole?.title || '—'}” (${top?.matchScore ?? '?'}% fit) because: ${(top?.matchedSkills || []).slice(0, 5).join(', ') || 'extracted skills'} match, domain “${career?.primaryDomain || '—'}” at ${career?.domainConfidence ?? '?'}% confidence${top?.whyRankedHere ? '. ' + top.whyRankedHere : '.'}`;
    }
    if (/learn next|what.*next|study/.test(s)) {
      const next = high.length > 0 ? high.slice(0, 3).map((g) => g.skill) : gaps.slice(0, 3).map((g) => g.skill);
      return next.length > 0 ? `Learn next (highest priority gaps): ${next.join(', ')}.` : 'No gaps recorded — deepen your top-domain expertise.';
    }
    if (/missing|gap/.test(s)) {
      return gaps.length > 0
        ? `Missing ${gaps.length} skills. HIGH: ${high.map((g) => g.skill).join(', ') || 'none'}. Full list: ${gaps.slice(0, 10).map((g) => g.skill).join(', ')}.`
        : 'No skill gaps detected for the target role.';
    }
    if (/ready|placement|placeable/.test(s)) {
      const r = career?.selectedRole;
      return r ? `Career readiness ${r.readiness ?? '?'}% for ${r.title}, skill gap ${r.skillGap ?? '?'}% (${r.status || 'see report'}). ${high.length > 0 ? 'Not fully placement-ready: close HIGH gaps first: ' + high.slice(0, 3).map((g) => g.skill).join(', ') + '.' : 'Profile looks placement-ready for this role.'}` : 'No readiness computed for this analysis.';
    }
    if (/improve/.test(s)) {
      const c = courses[0];
      return `To improve: 1) close ${high[0]?.skill || gaps[0]?.skill || 'top gaps'} first${c ? ` via “${c.title}”` : ''}; 2) complete roadmap phase 1 (${(roadmap[0]?.skillsToLearn || []).join(', ') || 'see roadmap'}); 3) re-upload your resume after finishing to update scores.`;
    }
    if (/course/.test(s)) {
      return courses.length > 0 ? `Top recommendations: ${courses.slice(0, 3).map((c) => `“${c.title}” for ${c.targetSkill}`).join('; ')}.` : 'No course recommendations in this analysis.';
    }
    if (/roadmap|plan/.test(s)) {
      return roadmap.length > 0 ? `Roadmap: ${roadmap.map((p) => `${p.title} (${p.duration || 'no estimate'})`).join(' → ')}.` : 'No roadmap phases in this analysis.';
    }
    if (/switch|change|compare|instead/.test(s)) {
      const list = (normalized?.jobMatches || []).slice(0, 3).map((j) => `${j.jobTitle} ${j.matchScore}%`).join(' vs ');
      return `Top alternatives from your data: ${list || 'none'}. Open the Compare tab for a side-by-side transition cost.`;
    }
    if (/project/.test(s)) {
      return 'Open the Prepare tab — project ideas there are generated from your actual missing skills.';
    }
    if (/salary|package|pay/.test(s)) {
      return 'I do not have salary data — I only use your analyzed profile (skills, gaps, courses, roadmap).';
    }
    return 'I can answer from your profile: recommendation reasons, missing skills, next steps, readiness, courses, roadmap, or role comparison. What would you like to know?';
  };

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { from: 'user', text: q }, { from: 'bot', text: answer(q) }]);
    setInput('');
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
        <Bot size={18} className="text-indigo-600" /> Profile Assistant
        <span className="text-[10px] font-mono font-bold text-slate-400 border border-slate-200 rounded-md px-1.5 py-0.5">answers from your real data</span>
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition-colors">
            {q}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2 rounded-xl bg-slate-50 border border-slate-100 p-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.from === 'bot' ? 'bg-white border border-slate-200 text-slate-700' : 'ml-auto bg-blue-600 text-white'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about your fit, gaps, next steps…"
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <button onClick={() => send()} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white p-2 transition-colors" aria-label="Send">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
