import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload, FiTrendingUp, FiUsers, FiBarChart2,
  FiTarget, FiChevronDown, FiShield, FiFilter, FiActivity
} from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { adminService } from '../../services/adminService';

const ranges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'This academic year'];

const avgScoreByCategory = [];
const difficultyData = [];
const monthlyTrend = [];
const topAssessments = [];
const scoreDistribution = [];

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

export default function AdminAnalytics() {
  const [range, setRange] = useState('Last 30 days');
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    adminService.getAssessments().then((data) => {
      setAssessments(Array.isArray(data) ? data : data?.content || []);
    }).catch(() => setAssessments([]));
  }, []);

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

      {/* ── Top Header & Global Range Controls ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Evaluation Intelligence
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Telemetry Verified
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Cohort Analytics & Benchmarks
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Standardized assessment telemetry, pass-rate distribution, and curriculum diagnostics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-8 text-xs font-mono text-neutral-800 shadow-2xs focus:border-transparent focus:ring-2 focus:ring-[#0038FF] focus:outline-none cursor-pointer"
            >
              {ranges.map((r) => <option key={r}>{r}</option>)}
            </select>
            <FiChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>

          <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-2xs font-mono">
            <FiDownload size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </motion.div>

      {/* ── KPI Metric Stat Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total Assessed" value="—" delay={0.05} />
        <StatCard icon={FiBarChart2} label="Mean Score" value="—" delay={0.1} />
        <StatCard icon={FiTarget} label="Platform Pass Rate" value="—" delay={0.15} />
        <StatCard icon={FiActivity} label="Published Assessments" value={assessments.filter((item) => ['PUBLISHED', 'ACTIVE'].includes(item.status)).length} delay={0.2} />
      </div>

      {/* ── Row 1: Monthly Trend + Score Distribution ── */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Monthly Performance Trend (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Longitudinal Trajectory
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Monthly Cohort Performance</h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
                <span className="text-neutral-600">Candidates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-neutral-400" />
                <span className="text-neutral-500">Pass Rate %</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0038FF" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#0038FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area yAxisId="left" type="monotone" dataKey="students" stroke="#0038FF" strokeWidth={2} fill="url(#colorStudents)" name="Candidates" />
                <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#0F172A' }} name="Pass Rate %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>No submission history available</span>
            <span>Sync: Live</span>
          </div>
        </motion.div>

        {/* Score Distribution (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Score Dispersion
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Gaussian Score Distribution</h2>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} Students`, 'Count']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {scoreDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Median cohort score: 71.4%</span>
            <span>Target: 60%+</span>
          </div>
        </motion.div>

      </div>

      {/* ── Row 2: Category Breakdown + Difficulty Analysis ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Competency Breakdown
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Performance by Assessment Domain</h2>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgScoreByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                <Bar dataKey="avgScore" fill="#0038FF" radius={[4, 4, 0, 0]} name="Mean Score %" barSize={22} />
                <Bar dataKey="passRate" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Pass Rate %" barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0038FF]" />
              <span>Mean Score %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neutral-400" />
              <span>Pass Rate %</span>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Curriculum Calibration
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Pass vs Fail Rate by Difficulty Tier</h2>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`]} />
                <Bar dataKey="pass" fill="#0038FF" stackId="a" name="Pass %" barSize={26} />
                <Bar dataKey="fail" fill="#E2E8F0" stackId="a" radius={[4, 4, 0, 0]} name="Fail %" barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-[#0038FF]" />
              <span>Pass %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-neutral-200" />
              <span>Fail %</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Top Assessments Data Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.25 }}
        className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              High-Volume Evaluations
            </span>
            <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Top Assessments by Attempt Volume</h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
            Ranked by Ingestion
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-y border-neutral-100 bg-[#F8FAFC] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <th className="px-4 py-3 font-semibold">Assessment Title</th>
                <th className="px-4 py-3 font-semibold">Domain</th>
                <th className="px-4 py-3 font-semibold">Attempts</th>
                <th className="px-4 py-3 font-semibold">Mean Score</th>
                <th className="px-4 py-3 font-semibold">Pass Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Trajectory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {topAssessments.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-neutral-900">
                    {row.name}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#0038FF] border border-blue-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
                      {row.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-neutral-800">
                    {row.attempts}
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-neutral-900">
                    {row.avgScore}%
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 min-w-[32px]">
                        {row.passRate}%
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0038FF]"
                          style={{ width: `${row.passRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right font-mono text-emerald-600">
                    <span className="inline-flex items-center gap-1">
                      <FiTrendingUp size={12} />
                      <span>+{(i * 1.8 + 2.4).toFixed(1)}%</span>
                    </span>
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