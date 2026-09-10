import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

// Real trajectory from BOTH attempt stores (the backend keeps two):
// - GET /api/assessment/history (standard sessions: category scores, no dates)
// - GET /api/assessment/published/history (published attempts: overall % + date)
// Published points carry only overall; standard points carry dimensions.
// Nothing is plotted until at least one real session exists.
export default function SkillVectorGrowth() {
  const navigate = useNavigate();
  const [standard, setStandard] = useState([]);
  const [published, setPublished] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      api.get('/api/assessment/history'),
      api.get('/api/assessment/published/history'),
    ]).then(([s, p]) => {
      if (s.status === 'fulfilled' && Array.isArray(s.value.data)) setStandard(s.value.data);
      if (p.status === 'fulfilled' && Array.isArray(p.value.data)) setPublished(p.value.data);
      if (s.status === 'rejected' && p.status === 'rejected') {
        setError(s.reason?.response?.data?.message || 'Unable to load skill trajectory.');
      }
      setLoading(false);
    });
  }, []);

  const timeline = useMemo(() => {
    // Published: real chronological order via submittedAt.
    const pub = [...published]
      .sort((a, b) => new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0))
      .map((r) => ({
        attempt: (r.assessmentTitle || 'Published').slice(0, 18),
        publishedOverall: r.percentage != null ? Math.round(Number(r.percentage)) : null,
        standardOverall: null,
        technical: null,
        aptitude: null,
        interest: null,
      }));
    // Standard: backend returns newest-first with no dates; reverse to oldest-first.
    const std = [...standard].reverse().map((r, i) => ({
      attempt: `Standard ${i + 1}`,
      publishedOverall: null,
      standardOverall: r.overallScore != null ? Math.round(Number(r.overallScore)) : null,
      technical: r.technicalScore != null ? Math.round(Number(r.technicalScore)) : null,
      aptitude: r.aptitudeScore != null ? Math.round(Number(r.aptitudeScore)) : null,
      interest: r.interestScore != null ? Math.round(Number(r.interestScore)) : null,
    }));
    return [...pub, ...std];
  }, [standard, published]);

  const sessionCount = standard.length + published.length;

  const deltas = useMemo(() => {
    if (timeline.length < 2) return [];
    const first = timeline[0];
    const last = timeline[timeline.length - 1];
    const firstOverall = first.standardOverall ?? first.publishedOverall;
    const lastOverall = last.standardOverall ?? last.publishedOverall;
    const rows = [
      { dimension: 'Technical', before: first.technical, after: last.technical },
      { dimension: 'Aptitude', before: first.aptitude, after: last.aptitude },
      { dimension: 'Interest', before: first.interest, after: last.interest },
      { dimension: 'Overall', before: firstOverall, after: lastOverall },
    ];
    return rows.map((r) => ({
      ...r,
      delta: r.before != null && r.after != null ? r.after - r.before : null,
    }));
  }, [timeline]);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">

        {/* ── Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Skill Trajectory
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Real attempt history
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Skill Trajectory
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              How your assessed scores change across submitted attempts. Nothing is plotted until real sessions exist.
            </p>
          </div>
          <div className="text-xs font-mono text-neutral-400 shrink-0">
            {loading ? 'Loading…' : `${sessionCount} session${sessionCount === 1 ? '' : 's'} on record (${published.length} published • ${standard.length} standard)`}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-neutral-400">
            <FiActivity size={24} className="mx-auto animate-spin text-[#0038FF]" />
            <p className="mt-3">Loading trajectory…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
            <FiAlertCircle size={22} className="mx-auto text-rose-500" />
            <p className="mt-2 text-xs font-bold text-rose-700 font-mono">{error}</p>
          </div>
        ) : timeline.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
              <FiTrendingUp size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">No assessed sessions yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Take any assessment — published or standard — and it will appear here.
              </p>
            </div>
            <button
              onClick={() => navigate('/assessments/categories')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all"
            >
              <span>Take an Assessment</span>
              <FiArrowRight size={13} />
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-black text-neutral-950">Score trajectory by attempt</h2>
              <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                {timeline.length < 2
                  ? 'First session recorded — submit a second assessment to draw movement.'
                  : 'Oldest → newest • blue = published overall, indigo = standard overall'}
              </p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                    <CartesianGrid stroke="#F1F5F9" />
                    <XAxis dataKey="attempt" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Line type="monotone" dataKey="publishedOverall" name="Published overall" stroke="#0038FF" strokeWidth={2} dot connectNulls={false} />
                    <Line type="monotone" dataKey="standardOverall" name="Standard overall" stroke="#6366F1" strokeWidth={2} dot connectNulls={false} />
                    <Line type="monotone" dataKey="technical" stroke="#0038FF" strokeWidth={2} dot={false} connectNulls strokeDasharray="6 3" />
                    <Line type="monotone" dataKey="aptitude" stroke="#8B5CF6" strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="interest" stroke="#10B981" strokeWidth={2} dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {deltas.length > 0 && deltas.some((d) => d.delta != null) && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-black text-neutral-950">First → latest delta</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {deltas.map((d) => (
                  <motion.div key={d.dimension} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-neutral-200/80 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">{d.dimension}</p>
                    <p className="mt-1 text-sm font-mono text-neutral-700">
                      {d.before ?? '—'}% → <span className="font-black text-neutral-950">{d.after ?? '—'}%</span>
                    </p>
                    <p className={`mt-1 text-xs font-bold font-mono ${d.delta == null ? 'text-neutral-400' : d.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {d.delta == null ? 'n/a' : `${d.delta >= 0 ? '+' : ''}${d.delta}%`}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
