import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, Minus } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

const skillGrowth = [
  { skill: 'Java', before: 60, after: 78, color: 'blue' },
  { skill: 'Python', before: 45, after: 62, color: 'indigo' },
  { skill: 'SQL', before: 55, after: 78, color: 'teal' },
  { skill: 'React', before: 70, after: 82, color: 'green' },
  { skill: 'Spring Boot', before: 50, after: 68, color: 'purple' },
  { skill: 'Data Structures', before: 40, after: 58, color: 'amber' },
  { skill: 'System Design', before: 30, after: 48, color: 'rose' },
  { skill: 'Problem Solving', before: 65, after: 74, color: 'blue' },
];

const timeline = [
  { month: 'Mar', technical: 55, aptitude: 48, softSkills: 70, overall: 58 },
  { month: 'Apr', technical: 60, aptitude: 55, softSkills: 72, overall: 62 },
  { month: 'May', technical: 65, aptitude: 60, softSkills: 75, overall: 67 },
  { month: 'Jun', technical: 70, aptitude: 65, softSkills: 80, overall: 72 },
  { month: 'Jul', technical: 78, aptitude: 72, softSkills: 85, overall: 78 },
];

const radarBefore = skillGrowth.map((s) => ({ subject: s.skill, before: s.before, after: s.after }));

const colorMap = {
  blue: { bar: 'bg-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', diff: 'text-blue-600' },
  indigo: { bar: 'bg-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', diff: 'text-indigo-600' },
  teal: { bar: 'bg-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', diff: 'text-teal-600' },
  green: { bar: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', diff: 'text-green-600' },
  purple: { bar: 'bg-purple-600', bg: 'bg-purple-50', text: 'text-purple-700', diff: 'text-purple-600' },
  amber: { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', diff: 'text-amber-600' },
  rose: { bar: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', diff: 'text-rose-600' },
};

export default function SkillVectorGrowth() {
  const avgBefore = Math.round(skillGrowth.reduce((s, i) => s + i.before, 0) / skillGrowth.length);
  const avgAfter = Math.round(skillGrowth.reduce((s, i) => s + i.after, 0) / skillGrowth.length);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Skill Intelligence</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Skill Vector Growth</h1>
          <p className="mt-1 text-sm text-slate-500">Track how your skill profile has evolved through assessments.</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Average Before', value: `${avgBefore}%`, sub: 'Pre-assessment baseline', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
            { label: 'Average After', value: `${avgAfter}%`, sub: 'Post-assessment score', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
            { label: 'Total Growth', value: `+${avgAfter - avgBefore}%`, sub: 'Skill vector improvement', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className={`rounded-2xl border p-5 ${item.bg}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className={`mt-2 text-3xl font-black ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Skill Comparison Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
        >
          <h2 className="mb-6 text-base font-extrabold text-slate-900">Before vs After Assessment</h2>
          <div className="space-y-5">
            {skillGrowth.map((item, i) => {
              const c = colorMap[item.color] || colorMap.blue;
              const diff = item.after - item.before;
              return (
                <motion.div key={item.skill} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-700">{item.skill}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{item.before}% → <span className="font-bold text-slate-700">{item.after}%</span></span>
                      <span className={`flex items-center gap-0.5 text-xs font-bold ${diff > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {diff > 0 ? <ArrowUp size={11} /> : <Minus size={11} />}
                        {diff > 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-slate-100">
                    {/* Before bar */}
                    <motion.div
                      className={`absolute top-0 h-3 rounded-full ${c.bar} opacity-25`}
                      initial={{ width: 0 }} animate={{ width: `${item.before}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * i }}
                    />
                    {/* After bar */}
                    <motion.div
                      className={`absolute top-0 h-3 rounded-full ${c.bar}`}
                      initial={{ width: 0 }} animate={{ width: `${item.after}%` }}
                      transition={{ duration: 0.9, delay: 0.1 + 0.05 * i }}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className={`h-2 w-2 rounded-full ${c.bar} opacity-30`} />Before: {item.before}%</span>
                    <span className="flex items-center gap-1"><span className={`h-2 w-2 rounded-full ${c.bar}`} />After: {item.after}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Timeline Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Skill Improvement Timeline</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip formatter={(v) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="technical" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} name="Technical" />
                <Line type="monotone" dataKey="aptitude" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} name="Aptitude" />
                <Line type="monotone" dataKey="softSkills" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} name="Soft Skills" />
                <Line type="monotone" dataKey="overall" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4 }} name="Overall" strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Skill Radar Comparison</h2>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarBefore}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
                <Radar dataKey="before" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.15} strokeWidth={1.5} name="Before" />
                <Radar dataKey="after" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} name="After" />
                <Tooltip formatter={(v) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
