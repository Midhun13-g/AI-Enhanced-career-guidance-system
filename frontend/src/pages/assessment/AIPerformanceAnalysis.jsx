import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Brain, Code2, BarChart3, MessageSquare, Lightbulb,
  TrendingUp, BookOpen, Target, ChevronRight, Zap, Star,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import SkillBar from '../../components/ui/SkillBar';
import AIRecommendationCard from '../../components/ui/AIRecommendationCard';
import Badge from '../../components/ui/Badge';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const scores = [
  { label: 'Technical Score', value: 78, icon: Code2, color: 'blue', bar: 'blue' },
  { label: 'Aptitude Score', value: 72, icon: BarChart3, color: 'indigo', bar: 'indigo' },
  { label: 'Communication', value: 85, icon: MessageSquare, color: 'teal', bar: 'teal' },
  { label: 'Problem Solving', value: 70, icon: Brain, color: 'purple', bar: 'purple' },
  { label: 'Analytical Score', value: 74, icon: Target, color: 'amber', bar: 'amber' },
];

const radarData = scores.map((s) => ({ subject: s.label.replace(' Score', ''), A: s.value }));

const strengths = [
  'Strong logical reasoning and pattern recognition',
  'Excellent communication and presentation skills',
  'Good understanding of object-oriented programming',
  'Consistent performance across aptitude sections',
];

const weaknesses = [
  'Database concepts and SQL optimization need improvement',
  'Advanced data structures (graphs, trees) require practice',
  'Numerical computation speed below benchmark',
];

const courses = [
  { title: 'Advanced SQL & Database Design', provider: 'Coursera', duration: '6 weeks', match: 95 },
  { title: 'Data Structures & Algorithms', provider: 'LeetCode', duration: '8 weeks', match: 88 },
  { title: 'System Design Fundamentals', provider: 'Udemy', duration: '4 weeks', match: 82 },
];

const practiceAreas = [
  { area: 'SQL Query Optimization', priority: 'High', impact: '+12% Backend Match' },
  { area: 'Graph Algorithms', priority: 'Medium', impact: '+8% DSA Score' },
  { area: 'Numerical Reasoning', priority: 'Medium', impact: '+6% Aptitude Score' },
];

const careerImpact = [
  { career: 'Backend Developer', current: 72, potential: 88, color: '#2563EB' },
  { career: 'Data Engineer', current: 65, potential: 82, color: '#4F46E5' },
  { career: 'Full Stack Dev', current: 78, potential: 90, color: '#14B8A6' },
];

export default function AIPerformanceAnalysis() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Sparkles size={14} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">AI Intelligence Engine</p>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">AI Performance Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">Deep skill intelligence powered by your assessment data.</p>
        </motion.div>

        {/* AI Skill Intelligence Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-glow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/30">
              <Brain size={20} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">AI Skill Intelligence</h2>
              <p className="text-xs text-blue-300">Based on 4 completed assessments</p>
            </div>
            <Badge label="AI Powered" variant="ai" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {scores.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
                >
                  <Icon size={20} className="mx-auto mb-2 text-blue-300" />
                  <p className="text-2xl font-black text-white">{s.value}%</p>
                  <p className="mt-1 text-[11px] font-semibold text-blue-200">{s.label}</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                    <motion.div
                      className="h-1.5 rounded-full bg-blue-400"
                      initial={{ width: 0 }} animate={{ width: `${s.value}%` }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.07 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Middle Row: Radar + Insights */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Skill Profile Radar</h2>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Radar dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card space-y-5"
          >
            <div>
              <h2 className="mb-3 text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Star size={16} className="text-green-500" /> AI Identified Strengths
              </h2>
              <div className="space-y-2">
                {strengths.map((s) => (
                  <div key={s} className="flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
                    <Zap size={13} className="mt-0.5 shrink-0 text-green-500" /> {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Target size={16} className="text-rose-500" /> Areas to Improve
              </h2>
              <div className="space-y-2">
                {weaknesses.map((w) => (
                  <div key={w} className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800">
                    <TrendingUp size={13} className="mt-0.5 shrink-0 text-rose-400" /> {w}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Suggestions Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recommended Courses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" /> Recommended Courses
            </h2>
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.title} className="rounded-xl border border-slate-100 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 leading-snug">{c.title}</p>
                    <span className="shrink-0 text-xs font-bold text-green-600">{c.match}%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span>{c.provider}</span>
                    <span>·</span>
                    <span>{c.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Practice Areas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" /> Practice Areas
            </h2>
            <div className="space-y-3">
              {practiceAreas.map((p) => (
                <div key={p.area} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800">{p.area}</p>
                    <Badge label={p.priority} variant={p.priority === 'High' ? 'rose' : 'amber'} />
                  </div>
                  <p className="text-xs font-semibold text-teal-600">{p.impact}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Impact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600" /> Career Impact
            </h2>
            <div className="space-y-4">
              {careerImpact.map((c) => (
                <div key={c.career}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-700">{c.career}</span>
                    <span className="text-xs font-bold text-indigo-600">{c.current}% → {c.potential}%</span>
                  </div>
                  <div className="relative h-2.5 w-full rounded-full bg-slate-100">
                    <motion.div className="h-2.5 rounded-full opacity-30" style={{ backgroundColor: c.color, width: `${c.potential}%` }}
                      initial={{ width: 0 }} animate={{ width: `${c.potential}%` }} transition={{ duration: 0.9, delay: 0.4 }} />
                    <motion.div className="absolute top-0 h-2.5 rounded-full" style={{ backgroundColor: c.color, width: `${c.current}%` }}
                      initial={{ width: 0 }} animate={{ width: `${c.current}%` }} transition={{ duration: 0.9, delay: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/assessments/skill-gap')}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
              View Skill Gap Analysis <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* AI Recommendation Widget */}
        <AIRecommendationCard
          title="Focus on SQL Optimization This Week"
          reason="Completing the Advanced SQL assessment will directly improve your Backend Developer match from 72% to an estimated 88%."
          improvement="Highest ROI skill improvement available right now"
          action="Start SQL Assessment"
          onAction={() => navigate('/assessments/categories')}
          delay={0.45}
        />
      </div>
    </AppLayout>
  );
}
