import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Users, BarChart3, Target, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import Badge from '../../components/ui/Badge';

const ranges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'This year'];

const avgScoreByCategory = [
  { category: 'Technical', avgScore: 74, attempts: 420, passRate: 68 },
  { category: 'Aptitude', avgScore: 70, attempts: 310, passRate: 72 },
  { category: 'Soft Skills', avgScore: 82, attempts: 220, passRate: 88 },
  { category: 'Personality', avgScore: 78, attempts: 180, passRate: 94 },
];

const difficultyData = [
  { name: 'Easy', pass: 92, fail: 8, color: '#22C55E' },
  { name: 'Medium', pass: 74, fail: 26, color: '#F59E0B' },
  { name: 'Hard', pass: 58, fail: 42, color: '#EF4444' },
  { name: 'Expert', pass: 38, fail: 62, color: '#8B5CF6' },
];

const monthlyTrend = [
  { month: 'Jan', students: 180, avgScore: 68, passRate: 64 },
  { month: 'Feb', students: 220, avgScore: 70, passRate: 67 },
  { month: 'Mar', students: 290, avgScore: 71, passRate: 69 },
  { month: 'Apr', students: 340, avgScore: 72, passRate: 70 },
  { month: 'May', students: 410, avgScore: 73, passRate: 72 },
  { month: 'Jun', students: 480, avgScore: 74, passRate: 74 },
  { month: 'Jul', students: 560, avgScore: 76, passRate: 76 },
];

const topAssessments = [
  { name: 'Java Programming', attempts: 284, avgScore: 76, passRate: 72, category: 'Technical' },
  { name: 'Logical Reasoning', attempts: 261, avgScore: 70, passRate: 68, category: 'Aptitude' },
  { name: 'Communication Skills', attempts: 198, avgScore: 84, passRate: 90, category: 'Soft Skills' },
  { name: 'SQL & Database', attempts: 176, avgScore: 72, passRate: 70, category: 'Technical' },
  { name: 'Data Structures', attempts: 154, avgScore: 65, passRate: 58, category: 'Technical' },
];

const scoreDistribution = [
  { range: '0–20', count: 42, color: '#EF4444' },
  { range: '21–40', count: 88, color: '#F97316' },
  { range: '41–60', count: 210, color: '#F59E0B' },
  { range: '61–80', count: 480, color: '#22C55E' },
  { range: '81–100', count: 320, color: '#2563EB' },
];

const StatCard = ({ icon: Icon, label, value, sub, tone, delay = 0 }) => {
  const tones = {
    blue:   { icon: 'bg-blue-600',   border: 'border-blue-100',   text: 'text-blue-700' },
    indigo: { icon: 'bg-indigo-600', border: 'border-indigo-100', text: 'text-indigo-700' },
    teal:   { icon: 'bg-teal-600',   border: 'border-teal-100',   text: 'text-teal-700' },
    green:  { icon: 'bg-green-600',  border: 'border-green-100',  text: 'text-green-700' },
  };
  const t = tones[tone] || tones.blue;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`rounded-2xl border ${t.border} bg-white p-5 shadow-sm`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.icon} text-white shadow-sm`}>
        <Icon size={20} />
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
      <p className={`mt-0.5 text-sm font-semibold ${t.text}`}>{label}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </motion.div>
  );
};

export default function AdminAnalytics() {
  const [range, setRange] = useState('Last 30 days');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Platform Intelligence</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Comprehensive assessment performance and student analytics.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select value={range} onChange={(e) => setRange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold text-slate-600 shadow-sm focus:border-indigo-500 focus:outline-none cursor-pointer">
              {ranges.map((r) => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={15} /> Export
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Students Assessed" value="1,840" sub="+12% vs last period" tone="blue" delay={0.05} />
        <StatCard icon={BarChart3} label="Average Score" value="74%" sub="Platform-wide" tone="indigo" delay={0.1} />
        <StatCard icon={Target} label="Pass Percentage" value="72%" sub="Across all categories" tone="green" delay={0.15} />
        <StatCard icon={TrendingUp} label="Completion Rate" value="68%" sub="Started → Submitted" tone="teal" delay={0.2} />
      </div>

      {/* Row 1: Monthly Trend + Score Distribution */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Monthly Performance Trend</h2>
          <p className="mb-5 text-xs text-slate-400">Students assessed, average score and pass rate over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[50, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="left" type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={2} fill="url(#gStudents)" name="Students" />
              <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} name="Avg Score %" />
              <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} name="Pass Rate %" strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Score Distribution</h2>
          <p className="mb-5 text-xs text-slate-400">Number of students per score range</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreDistribution} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [v, 'Students']} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Students">
                {scoreDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Row 2: Category Performance + Difficulty Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Student Performance by Category</h2>
          <p className="mb-5 text-xs text-slate-400">Average scores across assessment categories</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={avgScoreByCategory} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="avgScore" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Avg Score" />
              <Bar dataKey="passRate" fill="#14B8A6" radius={[6, 6, 0, 0]} name="Pass Rate" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Assessment Difficulty Analysis</h2>
          <p className="mb-5 text-xs text-slate-400">Pass vs fail rates by difficulty level</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={difficultyData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="pass" fill="#22C55E" radius={[6, 6, 0, 0]} name="Pass %" stackId="a" />
              <Bar dataKey="fail" fill="#FCA5A5" radius={[0, 0, 6, 6]} name="Fail %" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Assessments Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-extrabold text-slate-900">Top Assessments by Attempts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Assessment', 'Category', 'Attempts', 'Avg Score', 'Pass Rate', 'Trend'].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topAssessments.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{row.name}</td>
                  <td className="py-3">
                    <Badge label={row.category} variant={{ Technical: 'blue', Aptitude: 'indigo', 'Soft Skills': 'teal' }[row.category] || 'slate'} />
                  </td>
                  <td className="py-3 font-bold text-slate-700">{row.attempts}</td>
                  <td className="py-3">
                    <span className={`font-bold ${row.avgScore >= 75 ? 'text-green-600' : row.avgScore >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                      {row.avgScore}%
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${row.passRate >= 75 ? 'text-green-600' : 'text-amber-600'}`}>{row.passRate}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100">
                        <div className={`h-1.5 rounded-full ${row.passRate >= 75 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${row.passRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <TrendingUp size={14} className="text-green-500" />
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
