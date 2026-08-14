import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Users, BarChart3, TrendingUp, Plus,
  CheckCircle2, Clock, AlertCircle, ChevronRight,
} from 'lucide-react';
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
  { name: 'Completed', value: 68, color: '#22C55E' },
  { name: 'In Progress', value: 18, color: '#F59E0B' },
  { name: 'Not Started', value: 14, color: '#E2E8F0' },
];

const categoryStats = [
  { category: 'Technical', assessments: 42, avgScore: 74, passRate: 68, color: '#2563EB' },
  { category: 'Aptitude', assessments: 28, avgScore: 70, passRate: 72, color: '#4F46E5' },
  { category: 'Soft Skills', assessments: 18, avgScore: 82, passRate: 88, color: '#14B8A6' },
  { category: 'Personality', assessments: 12, avgScore: 78, passRate: 94, color: '#F59E0B' },
];

const recentActivity = [
  { student: 'Aarav Mehta', assessment: 'Java Programming', score: 88, status: 'Passed', time: '2 hrs ago' },
  { student: 'Ananya Sharma', assessment: 'Logical Reasoning', score: 74, status: 'Passed', time: '3 hrs ago' },
  { student: 'Rohan Gupta', assessment: 'Data Structures', score: 52, status: 'Failed', time: '5 hrs ago' },
  { student: 'Priya Nair', assessment: 'Communication', score: 91, status: 'Passed', time: '6 hrs ago' },
  { student: 'Karan Singh', assessment: 'SQL Database', score: 67, status: 'Passed', time: '8 hrs ago' },
];

const StatCard = ({ icon: Icon, label, value, sub, tone, delay = 0 }) => {
  const tones = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   text: 'text-blue-700',   border: 'border-blue-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-600', text: 'text-indigo-700', border: 'border-indigo-100' },
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-600',   text: 'text-teal-700',   border: 'border-teal-100' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-600',  text: 'text-green-700',  border: 'border-green-100' },
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

export default function AdminAssessmentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Assessment Engine</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Assessment Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Platform-wide assessment performance and analytics.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/assessments/create')}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <Plus size={15} /> Create Assessment
          </button>
          <button onClick={() => navigate('/admin/assessments/analytics')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <BarChart3 size={15} /> Analytics
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Assessments" value="100" sub="Across all categories" tone="blue" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Active Tests" value="24" sub="Currently published" tone="green" delay={0.1} />
        <StatCard icon={Users} label="Students Attempted" value="1,840" sub="+12% this month" tone="indigo" delay={0.15} />
        <StatCard icon={TrendingUp} label="Average Score" value="74%" sub="Platform-wide" tone="teal" delay={0.2} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Participation Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Assessment Participation</h2>
              <p className="text-xs text-slate-400">Attempts vs completions per month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={participationData}>
              <defs>
                <linearGradient id="attempts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="completions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="attempts" stroke="#4F46E5" strokeWidth={2} fill="url(#attempts)" name="Attempts" />
              <Area type="monotone" dataKey="completions" stroke="#14B8A6" strokeWidth={2} fill="url(#completions)" name="Completions" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Completion Rate Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Completion Rate</h2>
          <p className="mb-4 text-xs text-slate-400">Overall assessment completion status</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={completionRate} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {completionRate.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {completionRate.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Trends */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Performance Trends</h2>
          <p className="mb-4 text-xs text-slate-400">Average scores by category over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="technical" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Technical" />
              <Line type="monotone" dataKey="aptitude" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} name="Aptitude" />
              <Line type="monotone" dataKey="softSkills" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} name="Soft Skills" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-base font-extrabold text-slate-900">Category Breakdown</h2>
          <p className="mb-4 text-xs text-slate-400">Assessments, scores and pass rates by category</p>
          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">{cat.category}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">{cat.assessments} tests</span>
                    <span className="font-bold text-slate-700">Avg: {cat.avgScore}%</span>
                    <span className="font-bold text-green-600">Pass: {cat.passRate}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <motion.div className="h-2 rounded-full" style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }} animate={{ width: `${cat.avgScore}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Recent Activity</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Student', 'Assessment', 'Score', 'Status', 'Time'].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentActivity.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 font-semibold text-slate-800">{row.student}</td>
                  <td className="py-3 text-slate-600">{row.assessment}</td>
                  <td className="py-3">
                    <span className={`font-bold ${row.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>{row.score}%</span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${row.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.status === 'Passed' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-400">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
