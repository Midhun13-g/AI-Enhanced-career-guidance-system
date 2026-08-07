import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BarChart3, BookOpen, CheckCircle2, FileText, History, Plus, Sparkles, Upload } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { resumeHistory } from './resumeData';

function StatCard({ icon: Icon, label, value, color, bg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card-hover p-5"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
        <Icon size={20} className={color} />
      </div>
      <p className="mt-4 text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </motion.div>
  );
}

function CircularProgress({ value }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="-rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#EFF6FF" strokeWidth="10" />
        <motion.circle
          cx="72" cy="72" r={r} fill="none"
          stroke="url(#prog)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black text-slate-900">{value}%</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Complete</p>
      </div>
    </div>
  );
}

const STATUS_COLOR = { Analyzed: 'bg-emerald-50 text-emerald-700', Processing: 'bg-amber-50 text-amber-700', Failed: 'bg-red-50 text-red-700' };

export default function ResumeDashboard() {
  const stats = [
    { icon: CheckCircle2, label: 'Resume Status', value: 'Uploaded ✓', color: 'text-emerald-600', bg: 'bg-emerald-50', delay: 0.05 },
    { icon: BarChart3, label: 'Resume Score', value: '82%', color: 'text-blue-600', bg: 'bg-blue-50', delay: 0.1 },
    { icon: Sparkles, label: 'Skills Extracted', value: '10', color: 'text-indigo-600', bg: 'bg-indigo-50', delay: 0.15 },
    { icon: BookOpen, label: 'Projects Identified', value: '2', color: 'text-teal-600', bg: 'bg-teal-50', delay: 0.2 },
    { icon: Award, label: 'Certifications Found', value: '2', color: 'text-amber-600', bg: 'bg-amber-50', delay: 0.25 },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 p-7 text-white shadow-xl shadow-blue-200 sm:p-10"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-200">Module 3 · Resume Intelligence</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">Welcome back, Alex 👋</h1>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <p className="text-sm leading-6 text-blue-50">
                  Upload your resume to analyze your skills and improve your career profile. AI will extract skills, education, projects, and certifications automatically.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/resume/upload" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
                  <Upload size={16} /> Upload New Resume
                </Link>
                <Link to="/resume/analysis" className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/25">
                  <BarChart3 size={16} /> View Report
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularProgress value={88} />
              <p className="text-sm font-semibold text-blue-100">Profile Completion</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Recent Analysis */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <h2 className="font-black text-slate-900">Recent Resume Analysis</h2>
            <Link to="/resume/history" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {resumeHistory.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex flex-wrap items-center gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <FileText size={18} />
                </div>
                <div className="min-w-[160px] flex-1">
                  <p className="font-bold text-slate-900">{item.fileName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Uploaded {item.uploadDate}</p>
                </div>
                <span className="text-sm font-black text-blue-600">{item.score}%</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[item.status] || 'bg-slate-100 text-slate-600'}`}>
                  {item.status}
                </span>
                <div className="flex gap-1">
                  <Link to="/resume/nlp-results" className="rounded-lg px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50">View</Link>
                  <Link to="/resume/analysis" className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Report</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { to: '/resume/nlp-results', icon: Sparkles, label: 'NLP Extraction Results', desc: 'View all extracted entities from your resume', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { to: '/resume/skill-taxonomy', icon: BarChart3, label: 'Skill Taxonomy Mapping', desc: 'Review how your skills are normalized', color: 'text-teal-600', bg: 'bg-teal-50' },
            { to: '/resume/insights', icon: History, label: 'AI Career Insights', desc: 'Get personalized career recommendations', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link key={to} to={to} className="card-hover flex items-start gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
              <ArrowRight size={16} className="ml-auto mt-1 shrink-0 text-slate-300" />
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
