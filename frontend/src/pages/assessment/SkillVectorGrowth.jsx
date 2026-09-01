import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiArrowUpRight,
  FiMinus,
  FiShield,
  FiActivity,
  FiLayers,
  FiArrowRight,
  FiCheckCircle,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

const skillGrowth = [
  { skill: 'Java Architecture', before: 60, after: 78, desc: 'Enterprise patterns & concurrency' },
  { skill: 'Python Analytics', before: 45, after: 62, desc: 'Scripting, ETL & data pipelines' },
  { skill: 'SQL & Query Plans', before: 55, after: 78, desc: 'Indexing strategies & ACID constraints' },
  { skill: 'React Architecture', before: 70, after: 82, desc: 'State hooks & component trees' },
  { skill: 'Spring Boot Services', before: 50, after: 68, desc: 'JPA persistence & REST endpoints' },
  { skill: 'Data Structures & Alg', before: 40, after: 58, desc: 'Trees, heaps & graph traversals' },
  { skill: 'Distributed Systems', before: 30, after: 48, desc: 'Load balancers, queues & caching' },
  { skill: 'Quantitative Aptitude', before: 65, after: 74, desc: 'Logical inference & problem solving' },
];

const timeline = [
  { month: 'Mar', technical: 55, aptitude: 48, softSkills: 70, overall: 58 },
  { month: 'Apr', technical: 60, aptitude: 55, softSkills: 72, overall: 62 },
  { month: 'May', technical: 65, aptitude: 60, softSkills: 75, overall: 67 },
  { month: 'Jun', technical: 70, aptitude: 65, softSkills: 80, overall: 72 },
  { month: 'Jul', technical: 78, aptitude: 72, softSkills: 85, overall: 78 },
];

const radarData = skillGrowth.map((s) => ({
  subject: s.skill.split(' ')[0],
  Baseline: s.before,
  Current: s.after,
  fullMark: 100,
}));

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

export default function SkillVectorGrowth() {
  const navigate = useNavigate();

  const avgBefore = Math.round(
    skillGrowth.reduce((s, i) => s + i.before, 0) / skillGrowth.length
  );
  const avgAfter = Math.round(
    skillGrowth.reduce((s, i) => s + i.after, 0) / skillGrowth.length
  );
  const totalDelta = avgAfter - avgBefore;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Longitudinal Telemetry
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Trajectory Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Skill Vector Growth & Delta Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Audited velocity tracking candidate proficiency progression from baseline diagnosis to present assessment attempts.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start sm:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Telemetry Calibrated</span>
          </div>
        </div>

        {/* ── Metric KPI Summary Row ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Pre-Evaluation Baseline
              </span>
              <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <FiActivity size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {avgBefore}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Initial diagnostic mean score
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Active Proficiency Mean
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <FiTrendingUp size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {avgAfter}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Current post-assessment average
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Composite Growth Delta
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiArrowUpRight size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
                +{totalDelta}%
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Aggregate skill vector improvement
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── Section 1: Itemized 2-Column Competency Growth Grid ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Discrete Progression
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Baseline vs. Present Assessment Performance
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              {skillGrowth.length} Monitored Vectors
            </span>
          </div>

          {/* 2-Column Responsive Card Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGrowth.map((item, i) => {
              const diff = item.after - item.before;
              return (
                <div
                  key={item.skill}
                  className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3.5 hover:border-neutral-300 transition-colors"
                >
                  {/* Title & Growth Pill */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-neutral-900 font-mono truncate">
                        {item.skill}
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                        {item.desc}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                        diff > 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {diff > 0 ? <FiArrowUpRight size={10} /> : <FiMinus size={10} />}
                      {diff > 0 ? `+${diff}%` : `${diff}%`}
                    </span>
                  </div>

                  {/* Dual Layered Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative h-2 w-full rounded-full bg-neutral-200/80 overflow-hidden">
                      {/* Current Score Progress */}
                      <motion.div
                        className="h-full rounded-full bg-[#0038FF]"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.after}%` }}
                        transition={{ duration: 0.8, delay: 0.05 * i }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>
                        Baseline: <strong className="text-neutral-700">{item.before}%</strong>
                      </span>
                      <span>
                        Current: <strong className="text-neutral-900">{item.after}%</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Progress evaluated against structured test bank attempts.</span>
            <span className="text-[#0038FF] font-semibold">Active Cohort Sync</span>
          </div>
        </motion.section>

        {/* ── Section 2: Visual Telemetry (Timeline + Radar) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Longitudinal Trend Line Chart */}
          <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Temporal Trajectory
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Competency Growth Timeline</h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Past 5 Months</span>
              </div>

              <div className="h-60 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                    <Line type="monotone" dataKey="technical" stroke="#0038FF" strokeWidth={2} dot={{ r: 3, fill: '#0038FF' }} name="Technical" />
                    <Line type="monotone" dataKey="aptitude" stroke="#64748B" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 3 }} name="Aptitude" />
                    <Line type="monotone" dataKey="softSkills" stroke="#94A3B8" strokeWidth={1.5} dot={{ r: 3 }} name="Communication" />
                    <Line type="monotone" dataKey="overall" stroke="#0F172A" strokeWidth={2} dot={{ r: 3, fill: '#0F172A' }} name="Composite" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Consistent upward trajectory with +20% composite score elevation.
            </p>
          </section>

          {/* Radar Vector Overlay */}
          <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Geometric Vector
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Baseline vs. Current Radar</h2>
                </div>
                <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  Dual Polyline
                </span>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }}
                    />
                    <Radar
                      name="Baseline"
                      dataKey="Baseline"
                      stroke="#94A3B8"
                      fill="#94A3B8"
                      fillOpacity={0.12}
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                    />
                    <Radar
                      name="Current"
                      dataKey="Current"
                      stroke="#0038FF"
                      fill="#0038FF"
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Expansion observed across all 8 tested engineering dimensions.
            </p>
          </section>

        </div>

        {/* ── Section 3: Next Step Action Banner ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs font-mono">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF]">
                Recommended Trajectory Focus
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
              <span className="text-[10px] text-neutral-400">High Velocity Area</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-950 font-sans">
              Advance to Distributed Systems Architecture Assessment
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Elevating your Distributed Systems vector from 48% to 65% will close the final prerequisite gap for Senior Backend roles.
            </p>
          </div>

          <button
            onClick={() => navigate('/assessments/categories')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group shrink-0"
          >
            <span>Launch Evaluation</span>
            <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </AppLayout>
  );
}