import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiDownload,
  FiRotateCcw,
  FiBookOpen,
  FiAward,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiActivity,
  FiArrowRight,
  FiBarChart2,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import ProgressRing from '../../components/ui/ProgressRing';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const result = {
  score: 78,
  accuracy: 82,
  rank: 142,
  timeTaken: '24m 18s',
  totalCandidates: 1840,
  passed: true,
  passingScore: 60,
  categories: [
    { name: 'SQL Queries', score: 85 },
    { name: 'Normalization', score: 72 },
    { name: 'Joins & Relations', score: 90 },
    { name: 'Indexing & Plans', score: 65 },
    { name: 'ACID Transactions', score: 70 },
  ],
  radarData: [
    { subject: 'SQL', A: 85 },
    { subject: 'Normalization', A: 72 },
    { subject: 'Joins', A: 90 },
    { subject: 'Indexing', A: 65 },
    { subject: 'Transactions', A: 70 },
  ],
  strengths: [
    'Relational query composition and complex multi-table JOIN operations.',
    'Clear structured reasoning on relational schema decomposition.',
    'Consistent application of ACID transactional integrity criteria.',
  ],
  weaknesses: [
    'B-Tree indexing mechanics and query execution plan latency bottlenecks.',
    'Advanced higher-order normalization forms (BCNF, 4NF edge cases).',
  ],
};

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

export default function ResultAnalysis() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon & Global Action Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Post-Evaluation Audit
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Assessment Finalized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Evaluation Result Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed font-mono">
              Module: Relational Database Architecture & Query Systems · Evaluated September 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiDownload size={13} className="text-neutral-400" />
              <span>Export Audit PDF</span>
            </button>

            <button
              onClick={() => navigate('/assessments/categories')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Continue Learning</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ── Section 1: Score Telemetry & Domain Progress Grid ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Main Score Ring & Stat Matrix (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Composite Index
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  result.passed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : 'bg-rose-50 text-rose-700 border-rose-200/80'
                }`}>
                  {result.passed ? 'Standard Met (Pass)' : 'Needs Remediation'}
                </span>
              </div>

              <div className="flex justify-center py-2">
                <ProgressRing
                  value={result.score}
                  size={140}
                  stroke={12}
                  color={result.passed ? '#0038FF' : '#EF4444'}
                  sublabel="Final Score"
                />
              </div>
            </div>

            {/* Micro Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
              {[
                { label: 'Accuracy', value: `${result.accuracy}%`, icon: FiTarget },
                { label: 'Cohort Rank', value: `#${result.rank} / ${result.totalCandidates}`, icon: FiAward },
                { label: 'Duration', value: result.timeTaken, icon: FiClock },
                { label: 'Pass Benchmark', value: `${result.passingScore}%`, icon: FiShield },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Icon size={12} className="text-[#0038FF]" />
                    <span className="text-[10px] font-mono uppercase">{label}</span>
                  </div>
                  <p className="text-xs font-bold font-mono text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Clean Category Analysis Progress Rails (8 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Domain Diagnostic
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Category Proficiency Breakdown</h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Target Standard: 70%+</span>
            </div>

            <div className="space-y-4 pt-1">
              {result.categories.map((cat, i) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900">{cat.name}</span>
                    <span className="font-mono font-bold text-neutral-900">{cat.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0038FF] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
              <span>Benchmark calibrated against active cohort submissions.</span>
              <span className="text-[#0038FF] font-semibold">5 Sub-domains Audited</span>
            </div>
          </motion.div>

        </div>

        {/* ── Section 2: Visual Telemetry (Radar + Bar Chart) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Skill Radar */}
          <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Geometric Alignment
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Cognitive Competency Polygon</h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Radial Vector</span>
            </div>

            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={result.radarData} outerRadius="75%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: '#475569', fontFamily: 'monospace' }}
                  />
                  <Radar
                    dataKey="A"
                    stroke="#0038FF"
                    fill="#0038FF"
                    fillOpacity={0.12}
                    strokeWidth={1.75}
                  />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Proficiency']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Performance Bar Chart */}
          <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Discrete Scores
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Relative Competency Distribution</h2>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">0–100 Scale</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Score']} />
                  <Bar dataKey="score" fill="#0038FF" radius={[4, 4, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>

        {/* ── Section 3: Diagnostic Observations (Strengths & Improvements) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Demonstrated Strengths */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 border-b border-neutral-100 pb-3">
              <FiCheckCircle size={15} />
              <span className="uppercase tracking-wider">Demonstrated Proficiencies</span>
            </div>
            <div className="space-y-2.5">
              {result.strengths.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-neutral-800"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Identified Growth Areas */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 border-b border-neutral-100 pb-3">
              <FiAlertCircle size={15} />
              <span className="uppercase tracking-wider">Identified Remediation Areas</span>
            </div>
            <div className="space-y-2.5">
              {result.weaknesses.map((w, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-xs text-neutral-800"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{w}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Section 4: Next-Step Navigation Strip ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs font-mono">
          <span className="text-xs text-neutral-500 text-center sm:text-left">
            Ready to review AI career telemetry or re-attempt module?
          </span>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => navigate('/assessment')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiRotateCcw size={13} />
              <span>Retake Evaluation</span>
            </button>

            <button
              onClick={() => navigate('/assessments/ai-analysis')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Launch AI Analysis</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}