import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const careers = ['Backend Developer', 'Data Engineer', 'Full Stack Developer', 'AI/ML Engineer', 'DevOps Engineer'];

const gapData = {
  'Backend Developer': [
    { skill: 'Java', required: 90, student: 70, gap: 20 },
    { skill: 'Spring Boot', required: 85, student: 65, gap: 20 },
    { skill: 'SQL', required: 80, student: 78, gap: 2 },
    { skill: 'REST APIs', required: 85, student: 60, gap: 25 },
    { skill: 'System Design', required: 75, student: 45, gap: 30 },
    { skill: 'Docker', required: 70, student: 30, gap: 40 },
  ],
  'Data Engineer': [
    { skill: 'Python', required: 90, student: 62, gap: 28 },
    { skill: 'SQL', required: 95, student: 78, gap: 17 },
    { skill: 'Spark', required: 80, student: 20, gap: 60 },
    { skill: 'Kafka', required: 75, student: 15, gap: 60 },
    { skill: 'Data Modeling', required: 85, student: 40, gap: 45 },
    { skill: 'Cloud (AWS)', required: 80, student: 35, gap: 45 },
  ],
  'Full Stack Developer': [
    { skill: 'React', required: 85, student: 82, gap: 3 },
    { skill: 'Node.js', required: 80, student: 50, gap: 30 },
    { skill: 'TypeScript', required: 75, student: 45, gap: 30 },
    { skill: 'SQL', required: 70, student: 78, gap: 0 },
    { skill: 'CSS/Tailwind', required: 80, student: 75, gap: 5 },
    { skill: 'REST APIs', required: 85, student: 60, gap: 25 },
  ],
  'AI/ML Engineer': [
    { skill: 'Python', required: 95, student: 62, gap: 33 },
    { skill: 'ML Algorithms', required: 90, student: 40, gap: 50 },
    { skill: 'Statistics', required: 85, student: 55, gap: 30 },
    { skill: 'TensorFlow', required: 80, student: 25, gap: 55 },
    { skill: 'Data Analysis', required: 85, student: 60, gap: 25 },
    { skill: 'Cloud (GCP)', required: 75, student: 30, gap: 45 },
  ],
  'DevOps Engineer': [
    { skill: 'Docker', required: 90, student: 30, gap: 60 },
    { skill: 'Kubernetes', required: 85, student: 20, gap: 65 },
    { skill: 'CI/CD', required: 85, student: 35, gap: 50 },
    { skill: 'Linux', required: 80, student: 55, gap: 25 },
    { skill: 'Cloud (AWS)', required: 85, student: 35, gap: 50 },
    { skill: 'Scripting', required: 75, student: 50, gap: 25 },
  ],
};

const learningPaths = {
  'Backend Developer': [
    { step: 1, title: 'Master Java Core & OOP', duration: '3 weeks', type: 'Course' },
    { step: 2, title: 'Spring Boot REST API Development', duration: '4 weeks', type: 'Course' },
    { step: 3, title: 'System Design Fundamentals', duration: '3 weeks', type: 'Course' },
    { step: 4, title: 'Docker & Containerization', duration: '2 weeks', type: 'Practice' },
    { step: 5, title: 'Backend Developer Assessment', duration: '1 hour', type: 'Assessment' },
  ],
};

export default function SkillGapAnalysis() {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState('Backend Developer');
  const data = gapData[selectedCareer] || [];
  const path = learningPaths[selectedCareer] || learningPaths['Backend Developer'];
  const avgGap = Math.round(data.reduce((s, i) => s + i.gap, 0) / data.length);
  const readiness = Math.round(data.reduce((s, i) => s + Math.min(i.student / i.required, 1), 0) / data.length * 100);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Career Intelligence</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Skill Gap Analysis</h1>
            <p className="mt-1 text-sm text-slate-500">Compare your current skills against career requirements.</p>
          </div>
          <div className="relative">
            <select value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-bold text-slate-700 shadow-card focus:border-blue-500 focus:outline-none cursor-pointer">
              {careers.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Career Target', value: selectedCareer, sub: 'Selected career path', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
            { label: 'Career Readiness', value: `${readiness}%`, sub: 'Current match score', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
            { label: 'Average Skill Gap', value: `${avgGap}%`, sub: 'Points to close', color: avgGap > 30 ? 'text-rose-700' : 'text-amber-700', bg: avgGap > 30 ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className={`rounded-2xl border p-5 ${item.bg}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className={`mt-2 text-2xl font-black ${item.color} leading-tight`}>{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Gap Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
        >
          <h2 className="mb-5 text-base font-extrabold text-slate-900">Required vs Your Skills — {selectedCareer}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="skill" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip formatter={(v, n) => [`${v}%`, n === 'required' ? 'Required' : 'Your Score']} />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => v === 'required' ? 'Required' : 'Your Score'} />
              <Bar dataKey="required" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="required" />
              <Bar dataKey="student" radius={[4, 4, 0, 0]} name="student">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.gap > 20 ? '#EF4444' : entry.gap > 10 ? '#F59E0B' : '#22C55E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Gap Detail Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
        >
          <h2 className="mb-5 text-base font-extrabold text-slate-900">Skill Gap Breakdown</h2>
          <div className="space-y-4">
            {data.map((item, i) => (
              <motion.div key={item.skill} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-700">{item.skill}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">You: <span className="font-bold text-slate-700">{item.student}%</span></span>
                    <span className="text-xs text-slate-400">Required: <span className="font-bold text-slate-700">{item.required}%</span></span>
                    <Badge
                      label={item.gap === 0 ? 'Met' : `Gap: ${item.gap}%`}
                      variant={item.gap === 0 ? 'green' : item.gap > 20 ? 'rose' : 'amber'}
                    />
                  </div>
                </div>
                <div className="relative h-2.5 w-full rounded-full bg-slate-100">
                  <div className="absolute top-0 h-2.5 rounded-full bg-slate-200" style={{ width: `${item.required}%` }} />
                  <motion.div
                    className={`absolute top-0 h-2.5 rounded-full ${item.gap === 0 ? 'bg-green-500' : item.gap > 20 ? 'bg-red-500' : 'bg-amber-500'}`}
                    initial={{ width: 0 }} animate={{ width: `${item.student}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * i }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
        >
          <h2 className="mb-5 text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" /> Recommended Learning Path
          </h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />
            <div className="space-y-4">
              {path.map((step, i) => (
                <motion.div key={step.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  className="relative flex items-start gap-4 pl-12">
                  <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-sm
                    ${step.type === 'Assessment' ? 'bg-green-600' : step.type === 'Practice' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                    {step.step}
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-800">{step.title}</p>
                      <Badge label={step.type} variant={step.type === 'Assessment' ? 'green' : step.type === 'Practice' ? 'amber' : 'blue'} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{step.duration}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/assessments/categories')}
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
            <TrendingUp size={15} /> Start Learning Path <ChevronRight size={14} />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
