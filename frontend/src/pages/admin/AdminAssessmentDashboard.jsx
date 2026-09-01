import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiClipboard, FiUsers, FiBarChart2, FiTrendingUp, FiPlusSquare,
  FiCheckCircle, FiClock, FiAlertCircle, FiChevronRight,
  FiShield, FiTarget, FiActivity, FiArrowUpRight
} from 'react-icons/fi';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const participationData = [
  { month: 'Feb', attempts: 320, completions: 280 },
  { month: 'Mar', attempts: 410, completions: 360 },
  { month: 'Apr', attempts: 380, completions: 330 },
  { month: 'May', attempts: 520, completions: 470 },
  { month: 'Jun', attempts: 610, completions: 555 },
  { month: 'Jul', attempts: 740, completions: 680 },
];

const performanceTrends = [
  { month: 'Feb', technical: 62, aptitude: 58, softSkills: 72 },
  { month: 'Mar', technical: 65, aptitude: 61, softSkills: 74 },
  { month: 'Apr', technical: 68, aptitude: 64, softSkills: 76 },
  { month: 'May', technical: 71, aptitude: 67, softSkills: 78 },
  { month: 'Jun', technical: 74, aptitude: 70, softSkills: 80 },
  { month: 'Jul', technical: 76, aptitude: 72, softSkills: 82 },
];

const completionRate = [
  { name: 'Completed', value: 68, color: '#0038FF' },
  { name: 'In Progress', value: 18, color: '#60A5FA' },
  { name: 'Abandoned', value: 14, color: '#E2E8F0' },
];

const categoryStats = [
  { category: 'Technical & Systems', assessments: 42, avgScore: 74, passRate: 68 },
  { category: 'Aptitude & Logic', assessments: 28, avgScore: 70, passRate: 72 },
  { category: 'Professional Skills', assessments: 18, avgScore: 82, passRate: 88 },
  { category: 'Domain Personality', assessments: 12, avgScore: 78, passRate: 94 },
];

const recentActivity = [
  { student: 'Aarav Mehta', assessment: 'Java Programming & Architecture', score: 88, status: 'Passed', time: '2 hrs ago' },
  { student: 'Ananya Sharma', assessment: 'Logical Reasoning & Deduction', score: 74, status: 'Passed', time: '3 hrs ago' },
  { student: 'Rohan Gupta', assessment: 'Data Structures & Algorithms', score: 52, status: 'Failed', time: '5 hrs ago' },
  { student: 'Priya Nair', assessment: 'Technical Communication', score: 91, status: 'Passed', time: '6 hrs ago' },
  { student: 'Karan Singh', assessment: 'SQL Database Architecture', score: 67, status: 'Passed', time: '8 hrs ago' },
];

const StatCard = ({ icon: Icon, label, value, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.2 }}
    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-col justify-between"
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
        {label}
      </span>
      <span className="h-7 w-7 rounded-lg bg-blue-50 text-[#0038FF] flex items-center justify-center">
        <Icon size={14} />
      </span>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-black text-neutral-950 font-mono tracking-tight">{value}</div>
      {sub && (
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-0.5">
          <FiTrendingUp size={12} />
          <span>{sub}</span>
        </div>
      )}
    </div>
  </motion.div>
);

export default function AdminAssessmentDashboard() {
  const navigate = useNavigate();

  const tooltipStyle = {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    fontSize: 11,
    fontFamily: 'monospace'
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">

      {/* ── Top Header Ribbon ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Evaluation Engine
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Assessment Core
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Assessment Supervision Hub
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time evaluation ingestion, test bank health, and cohort participation telemetry.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/assessments/analytics')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-2xs font-mono"
          >
            <FiBarChart2 size={13} />
            <span>Telemetry</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/assessments/create')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] px-4 py-2 text-xs font-semibold text-white transition-all shadow-md shadow-blue-500/20"
          >
            <FiPlusSquare size={13} />
            <span>Create Assessment</span>
          </button>
        </div>
      </motion.div>

      {/* ── Top Metric Stat Row ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiClipboard} label="Total Evaluations" value="100" sub="All categories published" delay={0.05} />
        <StatCard icon={FiCheckCircle} label="Active Test Banks" value="24" sub="Live on student portal" delay={0.1} />
        <StatCard icon={FiUsers} label="Total Submissions" value="1,840" sub="+12% this cycle" delay={0.15} />
        <StatCard icon={FiTarget} label="Platform Mean Score" value="74.2%" sub="+3.1% benchmark shift" delay={0.2} />
      </div>

      {/* ── Analytical Row 1: Ingestion vs Completions & Completion Ratio ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Participation Velocity Chart (8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Ingestion Velocity
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Attempts vs Submissions per Month</h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
                <span className="text-neutral-600">Started</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-neutral-300" />
                <span className="text-neutral-500">Submitted</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attempts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0038FF" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#0038FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="attempts" stroke="#0038FF" strokeWidth={2} fill="url(#attempts)" name="Started" />
                <Area type="monotone" dataKey="completions" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Submitted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Overall Completion Efficiency: 91.8%</span>
            <span>Real-time Telemetry</span>
          </div>
        </motion.div>

        {/* Completion Breakdown Donut (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Retention Metric
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Session Completion State</h2>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionRate} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={3}>
                  {completionRate.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Ratio']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-neutral-950 font-mono">68%</span>
              <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-400">Finished</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-neutral-100 pt-3 font-mono text-xs">
            {completionRate.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-700 text-[11px]">{item.name}</span>
                </div>
                <span className="font-bold text-neutral-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Analytical Row 2: Category Breakdown & Performance Trajectories ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Performance Trends by Track */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Trajectory Progression
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Average Score Trends by Track</h2>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis domain={[50, 90]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                <Line type="monotone" dataKey="technical" stroke="#0038FF" strokeWidth={2} dot={{ r: 3, fill: '#0038FF' }} name="Technical" />
                <Line type="monotone" dataKey="aptitude" stroke="#64748B" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 3 }} name="Aptitude" />
                <Line type="monotone" dataKey="softSkills" stroke="#94A3B8" strokeWidth={1.5} dot={{ r: 3 }} name="Professional" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
              <span>Technical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neutral-500" />
              <span>Aptitude</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              <span>Professional</span>
            </div>
          </div>
        </motion.div>

        {/* Category Stats List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Domain Health
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Category Benchmarks & Volumes</h2>
          </div>

          <div className="space-y-3 pt-1">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="rounded-xl bg-[#F8FAFC] border border-neutral-200/60 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">{cat.category}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-neutral-400">{cat.assessments} tests</span>
                    <span className="font-bold text-neutral-900">Avg: {cat.avgScore}%</span>
                    <span className="font-bold text-emerald-600">Pass: {cat.passRate}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#0038FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.avgScore}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Overall domain pass benchmark: 70%+</span>
            <Link to="/admin/assessments" className="text-[#0038FF] hover:underline flex items-center gap-1 font-semibold">
              Manage bank <FiArrowUpRight size={12} />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* ── Recent Assessment Activity Log ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.25 }}
        className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Live Ingestion Log
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Recent Student Submissions</h2>
          </div>
          <Link
            to="/admin/assessments/analytics"
            className="flex items-center gap-1 text-xs font-semibold text-[#0038FF] hover:underline font-mono"
          >
            <span>All Submissions</span>
            <FiChevronRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <th className="px-4 py-3 font-semibold">Student Candidate</th>
                <th className="px-4 py-3 font-semibold">Evaluation Module</th>
                <th className="px-4 py-3 font-semibold">Achieved Score</th>
                <th className="px-4 py-3 font-semibold">Audit Result</th>
                <th className="px-4 py-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-neutral-900">
                    {row.student}
                  </td>
                  
                  <td className="px-4 py-3.5 text-neutral-600 font-medium">
                    {row.assessment}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                    {row.score}%
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      row.status === 'Passed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : 'bg-rose-50 text-rose-700 border-rose-200/80'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        row.status === 'Passed' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      {row.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-neutral-400">
                    {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}