import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, CheckCircle2, BarChart3, Zap, TrendingUp,
  Clock, ChevronRight, Play, Star, Calendar,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import ProgressRing from '../../components/ui/ProgressRing';
import AIRecommendationCard from '../../components/ui/AIRecommendationCard';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const radarData = [
  { subject: 'Technical', A: 72 },
  { subject: 'Aptitude', A: 65 },
  { subject: 'Soft Skills', A: 80 },
  { subject: 'Personality', A: 74 },
  { subject: 'Interest', A: 88 },
];

const recentAssessments = [
  { name: 'Java Programming', category: 'Technical', score: 82, date: '2025-07-20', status: 'Completed' },
  { name: 'Logical Reasoning', category: 'Aptitude', score: 74, date: '2025-07-18', status: 'Completed' },
  { name: 'Communication Skills', category: 'Soft Skills', score: 91, date: '2025-07-15', status: 'Completed' },
  { name: 'Data Structures', category: 'Technical', score: 68, date: '2025-07-10', status: 'Completed' },
];

const upcomingAssessments = [
  { title: 'SQL & Database Fundamentals', difficulty: 'Medium', duration: '30 min', questions: 25, category: 'Technical' },
  { title: 'Quantitative Aptitude', difficulty: 'Hard', duration: '45 min', questions: 30, category: 'Aptitude' },
  { title: 'Leadership & Teamwork', difficulty: 'Easy', duration: '20 min', questions: 20, category: 'Soft Skills' },
];

const categoryColor = { Technical: 'blue', Aptitude: 'indigo', 'Soft Skills': 'teal', Personality: 'purple', Interest: 'amber' };

export default function AssessmentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'Student';

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Assessment Module</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">Track your progress and unlock your career potential.</p>
          </div>
          <button
            onClick={() => navigate('/assessments/categories')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Play size={15} /> Start New Assessment
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={ClipboardList} label="Total Assessments" value="24" tone="blue" delay={0.05} />
          <StatCard icon={CheckCircle2} label="Completed Tests" value="18" trend={12} tone="green" delay={0.1} />
          <StatCard icon={BarChart3} label="Average Score" value="76%" trend={5} tone="indigo" delay={0.15} />
          <StatCard icon={Zap} label="Career Readiness" value="82%" trend={8} tone="teal" delay={0.2} />
          <StatCard icon={TrendingUp} label="Skill Growth" value="+18%" trend={18} tone="purple" delay={0.25} />
        </div>

        {/* Middle Row: Progress + Radar + AI Widget */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Circular Progress */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card flex flex-col items-center gap-4"
          >
            <h2 className="self-start text-base font-extrabold text-slate-900">Assessment Progress</h2>
            <ProgressRing value={75} size={140} stroke={12} color="#2563EB" sublabel="Complete" />
            <div className="w-full space-y-2">
              {[
                { label: 'Technical', pct: 80, color: 'bg-blue-600' },
                { label: 'Aptitude', pct: 70, color: 'bg-indigo-500' },
                { label: 'Soft Skills', pct: 90, color: 'bg-teal-500' },
                { label: 'Personality', pct: 60, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-semibold text-slate-500">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100">
                    <motion.div
                      className={`h-2 rounded-full ${item.color}`}
                      initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs font-bold text-slate-600">{item.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <h2 className="mb-4 text-base font-extrabold text-slate-900">Skill Profile</h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                <Radar dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} strokeWidth={2} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* AI Recommendation */}
          <div className="flex flex-col gap-4">
            <AIRecommendationCard
              title="SQL & Database Fundamentals"
              reason="Your backend developer match score can improve significantly with stronger database skills."
              improvement="Expected +12% career readiness boost"
              action="Start Assessment"
              onAction={() => navigate('/assessments/categories')}
              delay={0.3}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="rounded-2xl border border-teal-100 bg-teal-50 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={15} className="text-teal-600" />
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Career Readiness</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-teal-700">82%</span>
                <span className="mb-1 text-sm font-semibold text-teal-600">/ 100</span>
              </div>
              <p className="mt-1 text-xs text-teal-600">You're in the top 28% of students in your cohort.</p>
            </motion.div>
          </div>
        </div>

        {/* Recent Assessments */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Recent Assessments</h2>
            <button onClick={() => navigate('/assessments/history')} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recentAssessments.map((a, i) => (
              <motion.div
                key={a.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card hover:shadow-card-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge label={a.category} variant={categoryColor[a.category] || 'slate'} />
                  <Badge label={a.status} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{a.name}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600">{a.score}%</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={12} />
                    {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${a.score}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Upcoming Assessments */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Upcoming Assessments</h2>
            <button onClick={() => navigate('/assessments/categories')} className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Browse All <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingAssessments.map((a, i) => (
              <motion.div
                key={a.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card hover:shadow-card-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge label={a.category} variant={categoryColor[a.category] || 'slate'} />
                  <Badge label={a.difficulty} />
                </div>
                <h3 className="font-extrabold text-slate-800 leading-snug">{a.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {a.duration}</span>
                  <span className="flex items-center gap-1"><ClipboardList size={12} /> {a.questions} Qs</span>
                </div>
                <button
                  onClick={() => navigate('/assessments/details', { state: { assessment: a } })}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors group-hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Start Assessment
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </AppLayout>
  );
}
