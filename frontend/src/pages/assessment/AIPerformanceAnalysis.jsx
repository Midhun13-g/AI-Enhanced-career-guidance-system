import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiCpu,
  FiTerminal,
  FiBarChart2,
  FiMessageSquare,
  FiTarget,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';

// Dimensions are rendered ONLY when the backend provides evidence for them.
// GET /api/assessment/history -> AssessmentResultResponse[] with
// technicalScore / aptitudeScore / interestScore / overallScore (real,
// computed server-side from submitted answers). Communication-style scores
// have no backend evidence and are therefore shown as "Insufficient data"
// instead of invented numbers.
const DIMENSIONS = [
  { key: 'technicalScore', label: 'Technical Execution', metric: 'Scored technical answers', icon: FiTerminal },
  { key: 'aptitudeScore', label: 'Cognitive Aptitude', metric: 'Scored aptitude answers', icon: FiBarChart2 },
  { key: 'interestScore', label: 'Interest Alignment', metric: 'Scored interest answers', icon: FiMessageSquare },
  { key: 'overallScore', label: 'Overall Assessment', metric: 'Weighted composite', icon: FiCpu },
];

const UNMEASURED = [
  { label: 'Communication', reason: 'No communication assessment evidence in the backend.' },
  { label: 'Problem Structuring', reason: 'No problem-structuring rubric in the backend.' },
  { label: 'Domain Analysis', reason: 'Domain fit is computed by the AI guidance pipeline instead.' },
];

export default function AIPerformanceAnalysis() {
  const navigate = useNavigate();
  // Standard sessions (category scores) + published attempts (overall %).
  // The backend keeps both stores; reading only one hid real attempts.
  const [history, setHistory] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      api.get('/api/assessment/history'),
      api.get('/api/assessment/published/history'),
    ]).then(([s, p]) => {
      if (s.status === 'fulfilled' && Array.isArray(s.value.data)) setHistory(s.value.data);
      if (p.status === 'fulfilled' && Array.isArray(p.value.data)) setPublished(p.value.data);
      if (s.status === 'rejected' && p.status === 'rejected') {
        setError(s.reason?.response?.data?.message || 'Unable to load assessment diagnostics.');
      }
      setLoading(false);
    });
  }, []);

  const latest = history[0] || null;
  const latestPublished = [...published].sort(
    (a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
  )[0] || null;
  const count = history.length + published.length;

  const dims = DIMENSIONS.map((d) => ({
    ...d,
    value: latest && Number.isFinite(Number(latest[d.key])) ? Math.round(Number(latest[d.key])) : null,
  }));
  const measured = dims.filter((d) => d.value != null);

  const radarData = measured.map((d) => ({
    subject: d.label.split(' ')[0],
    score: d.value,
    fullMark: 100,
  }));

  const strengths = latest && Array.isArray(latest.strengths) ? latest.strengths : [];
  const weaknesses = latest && Array.isArray(latest.weaknesses) ? latest.weaknesses : [];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto antialiased selection:bg-[#0038FF] selection:text-white">

        {/* ── Header Ribbon ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Diagnostic Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiCpu size={9} /> Real assessment data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              AI Performance Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Synthesis of your submitted assessment scores. Every number below comes from the backend scoring engine — dimensions without evidence are marked as such.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start md:self-end">
            <span className={`h-2 w-2 rounded-full ${count > 0 ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
            <span>{loading ? 'Loading…' : `${count} Evaluation${count === 1 ? '' : 's'} Synthesized`}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-neutral-400">
            <FiActivity size={24} className="mx-auto animate-spin text-[#0038FF]" />
            <p className="mt-3">Loading diagnostics…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <FiAlertCircle size={22} className="mx-auto text-rose-500" />
            <p className="mt-2 text-xs font-bold text-rose-700 font-mono">{error}</p>
          </div>
        ) : !latest && !latestPublished ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
              <FiCpu size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Not enough assessment data</p>
              <p className="text-xs text-neutral-400 mt-1">Complete an assessment to generate your diagnostic scores. No scores are shown until real evidence exists.</p>
            </div>
            <button
              onClick={() => navigate('/assessments/categories')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all"
            >
              <span>Start an Assessment</span>
              <FiArrowRight size={13} />
            </button>
          </div>
        ) : !latest ? (
          // Published attempt exists but no standard session: show the real
          // overall — category breakdown genuinely needs a standard session.
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-neutral-950">
                    {latestPublished.assessmentTitle || 'Published assessment'} — {latestPublished.percentage != null ? `${Math.round(Number(latestPublished.percentage))}%` : '—'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    {latestPublished.correctAnswers ?? '?'} correct • {latestPublished.wrongAnswers ?? '?'} wrong • {latestPublished.skippedAnswers ?? '?'} skipped
                    {latestPublished.submittedAt ? ` • ${new Date(latestPublished.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ''}
                    {' '}• {latestPublished.passed ? 'Passed' : 'Needs review'}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded">Published attempt</span>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Category breakdown: insufficient data</p>
                <p className="text-xs text-neutral-500 mt-1">Published attempts record only an overall percentage. Take the standard assessment for technical / aptitude / interest breakdown.</p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all"
                >
                  <span>Take Standard Assessment</span>
                  <FiArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Measured dimensions ── */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
                <div>
                  <h2 className="text-lg font-black text-neutral-950 flex items-center gap-2">
                    <FiActivity size={18} className="text-[#0038FF]" /> Core Competency Matrix
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Latest submitted session {latest.sessionId ? `#${latest.sessionId}` : ''} • {count} session{count === 1 ? '' : 's'} on record</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded">Backend scored</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dims.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.key} className="rounded-2xl border border-neutral-200/80 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Icon size={15} />
                        </span>
                        <span className="text-lg font-black font-mono text-neutral-950">
                          {d.value != null ? `${d.value}%` : '—'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-black text-neutral-900">{d.label}</p>
                      <p className="text-[11px] font-mono text-neutral-400">{d.metric}</p>
                      <div className="mt-3 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#0038FF]" style={{ width: `${d.value ?? 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Unmeasured dimensions: honest, not invented ── */}
              <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Insufficient data — not scored</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {UNMEASURED.map((u) => (
                    <div key={u.label} className="rounded-xl bg-white border border-neutral-200 p-3">
                      <p className="text-xs font-bold text-neutral-800">{u.label}: <span className="text-neutral-400">Insufficient data</span></p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{u.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {(latest.personalityType || latest.recommendedCategory) && (
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  {latest.personalityType && (
                    <span className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1.5 font-bold text-indigo-700">
                      Personality: {latest.personalityType}
                    </span>
                  )}
                  {latest.recommendedCategory && (
                    <span className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 font-bold text-emerald-700">
                      Recommended: {latest.recommendedCategory}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Radar of measured dimensions */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Geometric vector</p>
                <h3 className="text-base font-black text-neutral-950 mt-0.5">Skill Distribution Radar</h3>
                <div className="h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="score" stroke="#0038FF" fill="#0038FF" fillOpacity={0.25} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: 8, border: 'none', color: '#fff', fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real strengths / weaknesses */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <FiCheckCircle size={14} /> Demonstrated proficiencies
                  </p>
                  <div className="mt-2 space-y-2">
                    {strengths.length > 0 ? strengths.map((s, i) => (
                      <div key={i} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-neutral-800">{s}</div>
                    )) : <p className="text-xs text-neutral-400 italic">No strengths recorded for this session.</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <FiTrendingUp size={14} /> Growth areas
                  </p>
                  <div className="mt-2 space-y-2">
                    {weaknesses.length > 0 ? weaknesses.map((s, i) => (
                      <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs text-neutral-800">{s}</div>
                    )) : <p className="text-xs text-neutral-400 italic">No weaknesses recorded for this session.</p>}
                  </div>
                </div>
                <button
                  onClick={() => navigate('/assessments/categories')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold transition-all"
                >
                  <span>Take another assessment</span>
                  <FiArrowRight size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
