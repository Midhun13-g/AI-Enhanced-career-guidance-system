import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, Target, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeAnalysis, getStudentSkills } from '../../services/resumeService';

const COLORS = ['#2563EB', '#0EA5E9', '#22C55E', '#8B5CF6', '#F59E0B'];

function CircleScore({ value, label }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const v = Math.round(value ?? 0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="-rotate-90" width="112" height="112">
          <circle cx="56" cy="56" r={r} fill="none" stroke="#EFF6FF" strokeWidth="9" />
          <motion.circle cx="56" cy="56" r={r} fill="none"
            stroke="url(#scoreGrad)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (v / 100) * circ }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <p className="text-xl font-black text-slate-900">{v}%</p>
        </div>
      </div>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setError('No resume found. Please upload and process a resume first.');
      setLoading(false);
      return;
    }
    Promise.all([getResumeAnalysis(resumeId), getStudentSkills()])
      .then(([anaRes, skillRes]) => {
        setReport(anaRes.data);
        setSkills(skillRes.data ?? []);
      })
      .catch(() => setError('Failed to load analysis. Please process your resume first.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Loading analysis…
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="font-bold text-red-600">{error}</p>
        <Link to="/resume/upload" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">
          Upload Resume
        </Link>
      </div>
    </AppLayout>
  );

  const sections = [
    { name: 'Skills',    value: Math.round(report.skillScore     ?? 0) },
    { name: 'Projects',  value: Math.round(report.projectScore   ?? 0) },
    { name: 'Education', value: Math.round(report.educationScore ?? 0) },
    { name: 'ATS',       value: Math.round(report.atsScore       ?? 0) },
  ];

  const qualityMetrics = [
    { label: 'ATS Compatibility',    value: Math.round(report.atsScore       ?? 0), color: 'bg-blue-500' },
    { label: 'Skill Relevance',      value: Math.round(report.skillScore     ?? 0), color: 'bg-indigo-500' },
    { label: 'Project Quality',      value: Math.round(report.projectScore   ?? 0), color: 'bg-purple-500' },
    { label: 'Education Score',      value: Math.round(report.educationScore ?? 0), color: 'bg-teal-500' },
  ];

  const radarData = sections.map((s) => ({ subject: s.name, A: s.value, fullMark: 100 }));

  // Build feedback strings from aiFeedback text
  const feedbackLines = (report.aiFeedback ?? '').split('.').map((s) => s.trim()).filter(Boolean);
  const strengths    = feedbackLines.filter((l) => !l.toLowerCase().startsWith('add') && !l.toLowerCase().startsWith('include'));
  const improvements = feedbackLines.filter((l) =>  l.toLowerCase().startsWith('add') ||  l.toLowerCase().startsWith('include'));

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Quality Analysis</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Resume Quality Analysis</h1>
        <p className="mt-1 text-slate-600">A comprehensive evaluation of your resume across key dimensions.</p>

        {/* Score row */}
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="card flex items-center justify-center p-6">
            <CircleScore value={report.overallScore} label="Overall Resume Score" />
          </div>
          <div className="card flex items-center justify-center p-6">
            <CircleScore value={report.atsScore} label="ATS Compatibility" />
          </div>
          <div className="card bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Skills Detected</p>
            <p className="mt-2 text-5xl font-black">{skills.length}</p>
            <p className="mt-1 text-sm text-slate-300">From your resume</p>
            <div className="mt-4 h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                style={{ width: `${Math.min(100, skills.length * 8)}%` }} />
            </div>
          </div>
        </div>

        {/* Quality metrics */}
        <div className="mt-6 card p-6">
          <h2 className="mb-5 font-black text-slate-900">Quality Breakdown</h2>
          <div className="space-y-4">
            {qualityMetrics.map((m, i) => (
              <div key={m.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{m.label}</span>
                  <span className="font-black text-slate-900">{m.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className={`h-full rounded-full ${m.color}`}
                    initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                    transition={{ delay: i * 0.1, duration: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 font-black text-slate-900">Section Readiness</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sections}>
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {sections.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 font-black text-slate-900">Resume Radar</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Radar name="Score" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths / Improvements */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-black text-slate-900">
              <CheckCircle2 className="text-emerald-500" size={18} /> Strengths
            </h2>
            <div className="space-y-2">
              {strengths.length > 0
                ? strengths.map((s, i) => <p key={i} className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{s}</p>)
                : <p className="text-sm text-slate-500">Keep improving your resume to unlock strengths.</p>}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-black text-slate-900">
              <TriangleAlert className="text-amber-500" size={18} /> Improvement Areas
            </h2>
            <div className="space-y-2">
              {improvements.length > 0
                ? improvements.map((s, i) => <p key={i} className="rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">{s}</p>)
                : <p className="text-sm text-slate-500">No major issues detected.</p>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-7 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:flex sm:items-center sm:justify-between">
          <div>
            <Target className="text-blue-200" size={20} />
            <h2 className="mt-2 text-xl font-black">Get AI Career Insights</h2>
            <p className="mt-1 text-sm text-blue-100">See personalised recommendations based on your resume analysis.</p>
          </div>
          <button onClick={() => navigate('/resume/insights')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 sm:mt-0">
            View Insights <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
