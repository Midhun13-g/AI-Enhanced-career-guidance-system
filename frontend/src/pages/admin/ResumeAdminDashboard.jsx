import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import { BarChart3, CheckCircle2, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { adminResumeStats } from '../resume/resumeData';

const COLORS = ['#22C55E', '#EF4444', '#F59E0B'];

function StatCard({ icon: Icon, label, value, sub, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs font-semibold text-emerald-600">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ResumeAdminDashboard() {
  const s = adminResumeStats;

  return (
    <>
      <header className="mb-7">
        <p className="text-sm font-semibold text-indigo-600">RESUME INTELLIGENCE</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Resume Analytics Dashboard</h1>
        <p className="mt-2 text-slate-500">Platform-wide resume processing and skill extraction metrics.</p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total Resumes Uploaded" value={s.totalUploaded.toLocaleString()} sub="↑ 14.2% from last month" color="text-blue-600" bg="bg-blue-50" delay={0.05} />
        <StatCard icon={Sparkles} label="Total Skills Extracted" value={s.totalSkillsExtracted.toLocaleString()} sub="↑ 18.7% from last month" color="text-indigo-600" bg="bg-indigo-50" delay={0.1} />
        <StatCard icon={BarChart3} label="Average Resume Score" value={`${s.avgScore}%`} sub="↑ 2.3% from last month" color="text-teal-600" bg="bg-teal-50" delay={0.15} />
        <StatCard icon={CheckCircle2} label="Processing Success Rate" value={`${s.successRate}%`} sub="↑ 0.8% from last month" color="text-emerald-600" bg="bg-emerald-50" delay={0.2} />
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Upload trend */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-1 font-bold text-slate-900">Upload Trends</h2>
          <p className="mb-5 text-sm text-slate-500">Monthly resume uploads over the past 9 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.uploadTrend}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area dataKey="uploads" stroke="#2563EB" strokeWidth={2.5} fill="url(#uploadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing status */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-1 font-bold text-slate-900">Processing Status</h2>
          <p className="mb-4 text-sm text-slate-500">Overall parsing outcomes</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={s.processingStatus} dataKey="value" nameKey="status" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {s.processingStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {s.processingStatus.map((item, i) => (
              <div key={item.status} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-600">{item.status}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill distribution */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-bold text-slate-900">Popular Technologies</h2>
        <p className="mb-5 text-sm text-slate-500">Most frequently extracted skills across all resumes</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s.skillDistribution} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
