import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Download, RotateCcw, BookOpen, Trophy, Clock, Target,
  TrendingUp, Award, CheckCircle2, XCircle, Minus,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import ProgressRing from '../../components/ui/ProgressRing';
import SkillBar from '../../components/ui/SkillBar';
import Badge from '../../components/ui/Badge';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

const result = {
  score: 78, accuracy: 82, rank: 142, timeTaken: '24 min 18 sec', totalStudents: 1840,
  passed: true, passingScore: 60,
  categories: [
    { name: 'SQL Queries', score: 85, color: '#2563EB' },
    { name: 'Normalization', score: 72, color: '#4F46E5' },
    { name: 'Joins', score: 90, color: '#14B8A6' },
    { name: 'Indexing', score: 65, color: '#F59E0B' },
    { name: 'Transactions', score: 70, color: '#8B5CF6' },
  ],
  radarData: [
    { subject: 'SQL', A: 85 }, { subject: 'Normalization', A: 72 },
    { subject: 'Joins', A: 90 }, { subject: 'Indexing', A: 65 }, { subject: 'Transactions', A: 70 },
  ],
  strengths: ['Strong JOIN operations', 'Excellent query writing', 'Good understanding of ACID properties'],
  weaknesses: ['Indexing strategies need improvement', 'Complex normalization forms'],
};

export default function ResultAnalysis() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Assessment Complete</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Result Analysis</h1>
            <p className="mt-1 text-sm text-slate-500">SQL & Database Fundamentals · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-card">
              <Download size={15} /> Download Report
            </button>
            <button onClick={() => navigate('/assessments/categories')} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
              <BookOpen size={15} /> Continue Learning
            </button>
          </div>
        </motion.div>

        {/* Score Card Row */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          {/* Main Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card flex flex-col items-center gap-4"
          >
            <ProgressRing
              value={result.score} size={150} stroke={14}
              color={result.passed ? '#22C55E' : '#EF4444'}
              sublabel="Score"
            />
            <Badge label={result.passed ? 'Passed' : 'Failed'} variant={result.passed ? 'green' : 'rose'} />
            <div className="w-full grid grid-cols-2 gap-3 text-center">
              {[
                { label: 'Accuracy', value: `${result.accuracy}%`, icon: Target },
                { label: 'Rank', value: `#${result.rank}`, icon: Trophy },
                { label: 'Time Taken', value: result.timeTaken, icon: Clock },
                { label: 'Passing Score', value: `${result.passingScore}%`, icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <Icon size={14} className="mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-extrabold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-5 text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart size={18} className="text-blue-600" /> Category Analysis
            </h2>
            <div className="space-y-4">
              {result.categories.map((cat, i) => (
                <SkillBar key={cat.name} label={cat.name} value={cat.score} color={['blue', 'indigo', 'teal', 'amber', 'purple'][i]} delay={0.1 * i} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Skill Radar Chart</h2>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={result.radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Radar dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Performance Graph</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={result.categories} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {result.categories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-green-100 bg-green-50 p-6"
          >
            <h2 className="mb-4 text-base font-extrabold text-green-800 flex items-center gap-2">
              <CheckCircle2 size={18} /> Strengths
            </h2>
            <div className="space-y-2">
              {result.strengths.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle2 size={14} className="shrink-0 text-green-500" /> {s}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border border-rose-100 bg-rose-50 p-6"
          >
            <h2 className="mb-4 text-base font-extrabold text-rose-800 flex items-center gap-2">
              <XCircle size={18} /> Areas to Improve
            </h2>
            <div className="space-y-2">
              {result.weaknesses.map((w) => (
                <div key={w} className="flex items-center gap-2 text-sm font-medium text-rose-700">
                  <Minus size={14} className="shrink-0 text-rose-400" /> {w}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <button onClick={() => navigate('/assessments/ai-analysis')}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <TrendingUp size={15} /> View AI Analysis
          </button>
          <button onClick={() => navigate('/assessment')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-card">
            <RotateCcw size={15} /> Retake Assessment
          </button>
          <button onClick={() => navigate('/assessments/categories')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-card">
            <BookOpen size={15} /> Continue Learning
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
