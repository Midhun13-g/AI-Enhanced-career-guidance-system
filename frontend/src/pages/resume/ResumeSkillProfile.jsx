import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getProfileImpact, getStudentSkills } from '../../services/resumeService';

export default function ResumeSkillProfile() {
  const [vector, setVector] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getProfileImpact(), getStudentSkills()])
      .then(([vecRes, skillRes]) => {
        setVector(vecRes.data);
        setSkills(skillRes.data ?? []);
      })
      .catch(() => setError('Failed to load profile data. Please process your resume first.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Loading skill profile…
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

  const rv = vector?.resumeVector ?? {};
  const ov = vector?.overallVector ?? {};

  // Build chart data from top skills with confidence
  const chartData = skills.slice(0, 8).map((s) => ({
    skill: s.normalizedName,
    confidence: Math.round((s.confidence ?? 0) * 100),
  }));

  const vectorStats = [
    { label: 'Skills Extracted',      value: rv.skill_count         ?? 0 },
    { label: 'Avg Skill Confidence',  value: `${Math.round((rv.avg_skill_confidence ?? 0) * 100)}%` },
    { label: 'Education Entries',     value: rv.education_count      ?? 0 },
    { label: 'Projects Found',        value: rv.project_count        ?? 0 },
    { label: 'Certifications',        value: rv.certification_count  ?? 0 },
    { label: 'Experience Entries',    value: rv.experience_count     ?? 0 },
    { label: 'Resume Score',          value: `${Math.round(rv.resume_score ?? 0)}%` },
    { label: 'Overall Profile Score', value: `${Math.round(ov.overall_score ?? 0)}%` },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Skill Profile</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Skill Profile Update</h1>
            <p className="mt-1 text-slate-500">How your resume improved your AI career profile vector.</p>
          </div>
          <Link to="/resume/history" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            Resume History <ArrowRight size={16} />
          </Link>
        </div>

        {/* Profile vector stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {vectorStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className="mt-1 text-2xl font-black text-blue-600">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Skill confidence chart */}
        {chartData.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="mb-5 flex items-center gap-2 font-black text-slate-900">
              <TrendingUp size={18} className="text-blue-600" /> Skill Confidence Scores
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="confidence" name="Confidence %" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* All extracted skills */}
        <div className="card p-6">
          <h2 className="mb-4 font-black text-slate-900">All Extracted Skills ({skills.length})</h2>
          {skills.length === 0
            ? <p className="text-sm text-slate-500">No skills extracted yet.</p>
            : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <motion.span key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
                    {s.normalizedName}
                    {s.category && <span className="ml-1 text-[10px] font-normal text-blue-400">({s.category})</span>}
                  </motion.span>
                ))}
              </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
