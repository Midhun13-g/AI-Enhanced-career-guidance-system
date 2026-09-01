import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiClipboard,
  FiCheckCircle,
  FiBarChart2,
  FiZap,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiPlay,
  FiShield,
  FiLayers,
  FiActivity,
  FiCalendar,
  FiTarget,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import ProgressRing from '../../components/ui/ProgressRing';
import { useAuth } from '../../context/AuthContext';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const radarData = [
  { subject: 'Technical', A: 72 },
  { subject: 'Aptitude', A: 65 },
  { subject: 'Soft Skills', A: 80 },
  { subject: 'Personality', A: 74 },
  { subject: 'Interest', A: 88 },
];

const recentAssessments = [
  { name: 'Java Programming & OOP', category: 'Technical', score: 82, date: '2026-07-20', status: 'Passed' },
  { name: 'Logical Deduction & Reasoning', category: 'Aptitude', score: 74, date: '2026-07-18', status: 'Passed' },
  { name: 'Professional Communication', category: 'Soft Skills', score: 91, date: '2026-07-15', status: 'Passed' },
  { name: 'Data Structures & Algorithms', category: 'Technical', score: 68, date: '2026-07-10', status: 'Passed' },
];

const upcomingAssessments = [
  { title: 'SQL & Database Architecture', difficulty: 'Intermediate', duration: '30 min', questions: 25, category: 'Technical' },
  { title: 'Quantitative Reasoning Battery', difficulty: 'Advanced', duration: '45 min', questions: 30, category: 'Aptitude' },
  { title: 'Teamwork & Technical Leadership', difficulty: 'Foundational', duration: '20 min', questions: 20, category: 'Soft Skills' },
];

const difficultyBadge = (val) => {
  const level = (val || '').toUpperCase();
  switch (level) {
    case 'FOUNDATIONAL':
    case 'EASY':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'INTERMEDIATE':
    case 'MEDIUM':
      return 'bg-blue-50 text-[#0038FF] border-blue-200/80';
    case 'ADVANCED':
    case 'HARD':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
};

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

export default function AssessmentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'Student';

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Header Ribbon & Primary CTA ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Evaluation Hub
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Candidate Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Welcome back, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Standardized assessment telemetry, competency progression, and diagnostic interventions.
            </p>
          </div>

          <button
            onClick={() => navigate('/assessments/categories')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group shrink-0"
          >
            <FiPlay size={13} className="transition-transform group-hover:scale-110" />
            <span>Launch New Assessment</span>
          </button>
        </div>

        {/* ── 5-Card Metric KPI Row ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Total Modules', value: '24', sub: 'Audited test banks', icon: FiClipboard },
            { label: 'Completed Tests', value: '18', sub: '+12% completion velocity', icon: FiCheckCircle },
            { label: 'Cohort Mean Score', value: '76%', sub: 'Above 70% threshold', icon: FiBarChart2 },
            { label: 'Role Readiness', value: '82%', sub: 'Target: Backend Engineer', icon: FiTarget },
            { label: 'Skill Vector Growth', value: '+18%', sub: 'Since baseline test', icon: FiTrendingUp },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                    {stat.label}
                  </span>
                  <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                    <Icon size={14} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Analytical Middle Row: Circular Progress, Radar, & Intervention Widget ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Progress Breakdown Ring Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Curriculum Index
                </span>
                <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  75% Complete
                </span>
              </div>

              <div className="flex justify-center py-2">
                <ProgressRing value={75} size={135} stroke={11} color="#0038FF" sublabel="Completed" />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-100 font-mono text-xs">
              {[
                { label: 'Technical', pct: 80 },
                { label: 'Aptitude', pct: 70 },
                { label: 'Soft Skills', pct: 90 },
                { label: 'Personality', pct: 60 },
              ].map((item, idx) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-600">{item.label}</span>
                    <span className="font-bold text-neutral-900">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#0038FF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.15 + idx * 0.05 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Radar Chart Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Geometric Vector
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Skill Distribution Polygon</h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Calibrated</span>
              </div>

              <div className="h-56 w-full flex items-center justify-center pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }}
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
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Balanced multi-axis performance vector.
            </p>
          </motion.div>

          {/* AI Recommended Intervention & Benchmark Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col justify-between gap-4"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Recommended Action
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
                <span className="text-[10px] font-mono text-neutral-400">High Impact</span>
              </div>
              
              <h3 className="text-sm font-bold text-neutral-950 leading-snug">
                SQL & Database Fundamentals
              </h3>
              
              <p className="text-xs text-neutral-500 leading-relaxed">
                Completing this evaluation will address your primary algorithmic bottleneck and elevate your Backend match from 72% to 88%.
              </p>

              <button
                onClick={() => navigate('/assessments/categories')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] hover:bg-blue-50/40 text-neutral-800 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs group"
              >
                <span>Take Diagnostic</span>
                <FiArrowRight size={13} className="text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0038FF]" />
              </button>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex items-center justify-between font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Cohort Standing</span>
                <p className="text-xs text-neutral-600">Top 28th Percentile</p>
              </div>
              <span className="text-xl font-black text-[#0038FF]">82% Index</span>
            </div>
          </motion.div>

        </div>

        {/* ── Section: Recent Assessments Table / Card Grid ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Recent Submissions
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                Evaluated Attempt History
              </h2>
            </div>
            <button
              onClick={() => navigate('/assessments/history')}
              className="inline-flex items-center gap-1 text-xs font-semibold font-mono text-[#0038FF] hover:underline"
            >
              <span>View Full Ledger</span>
              <FiArrowRight size={12} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentAssessments.map((a, i) => (
              <div
                key={a.name}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                      {a.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                      <FiCheckCircle size={9} /> {a.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-neutral-950 leading-snug">
                    {a.name}
                  </h3>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-base font-black text-neutral-950">{a.score}%</span>
                    <span className="text-neutral-400 text-[11px]">
                      {new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0038FF] rounded-full" style={{ width: `${a.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Section: Available / Upcoming Modules ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Standardized Catalog
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                Available Assessment Modules
              </h2>
            </div>
            <button
              onClick={() => navigate('/assessments/categories')}
              className="inline-flex items-center gap-1 text-xs font-semibold font-mono text-[#0038FF] hover:underline"
            >
              <span>Explore All Modules</span>
              <FiArrowRight size={12} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {upcomingAssessments.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-neutral-300 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                      {a.category}
                    </span>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyBadge(a.difficulty)}`}>
                      {a.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-950 group-hover:text-[#0038FF] transition-colors leading-snug">
                    {a.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <FiClock size={12} className="text-neutral-400" />
                      {a.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiLayers size={12} className="text-neutral-400" />
                      {a.questions} Questions
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/assessments/details', { state: { assessment: a } })}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
                >
                  <span>Examine Module</span>
                  <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </AppLayout>
  );
}