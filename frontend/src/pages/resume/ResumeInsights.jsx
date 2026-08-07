import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lightbulb, Loader2, Sparkles, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeReport, getStudentSkills } from '../../services/resumeService';

const PRIORITY_STYLE = {
  High:   'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low:    'bg-slate-100 text-slate-600 border-slate-200',
};

function buildInsights(report, skills) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  const score   = report?.overallScore   ?? 0;
  const ats     = report?.atsScore       ?? 0;
  const skillSc = report?.skillScore     ?? 0;
  const projSc  = report?.projectScore   ?? 0;
  const eduSc   = report?.educationScore ?? 0;

  if (skills.length >= 5)  strengths.push(`Strong skill set with ${skills.length} extracted skills.`);
  if (ats >= 60)           strengths.push(`Good ATS compatibility score of ${Math.round(ats)}%.`);
  if (score >= 70)         strengths.push(`Overall resume score of ${Math.round(score)}% is above average.`);
  if (eduSc >= 40)         strengths.push('Education section is well-structured.');
  if (projSc >= 20)        strengths.push('Projects section adds value to your profile.');

  if (skills.length < 5)   weaknesses.push('Add more technical skills to strengthen your profile.');
  if (ats < 60)            weaknesses.push(`ATS score of ${Math.round(ats)}% is low — add more job-relevant keywords.`);
  if (projSc === 0)        weaknesses.push('No projects detected — add at least 2 projects with tech stack details.');
  if (eduSc === 0)         weaknesses.push('Education section is missing or could not be extracted.');
  if (score < 50)          weaknesses.push('Overall resume score is below 50% — significant improvements needed.');

  if (skills.length < 8)
    recommendations.push({ title: 'Add More Technical Skills', description: 'Include at least 8–10 relevant technical skills matching your target role.', priority: 'High', category: 'Skills' });
  if (projSc < 40)
    recommendations.push({ title: 'Strengthen Projects Section', description: 'Add 2–3 projects with clear descriptions, tech stack, and outcomes.', priority: 'High', category: 'Portfolio' });
  if (ats < 70)
    recommendations.push({ title: 'Improve ATS Compatibility', description: 'Use standard section headings and include keywords from job descriptions.', priority: 'Medium', category: 'ATS' });
  recommendations.push({ title: 'Add Certifications', description: 'Certifications from AWS, Google, or Coursera can significantly boost your profile score.', priority: 'Medium', category: 'Certification' });
  recommendations.push({ title: 'Quantify Achievements', description: 'Use numbers and metrics in your experience and project descriptions.', priority: 'Low', category: 'Content' });

  return { strengths, weaknesses, recommendations };
}

export default function ResumeInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setError('No resume found. Please upload and process a resume first.');
      setLoading(false);
      return;
    }
    Promise.all([getResumeReport(resumeId), getStudentSkills()])
      .then(([repRes, skillRes]) => {
        setInsights(buildInsights(repRes.data, skillRes.data ?? []));
      })
      .catch(() => setError('Failed to load insights. Please process your resume first.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Generating insights…
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

  const { strengths, weaknesses, recommendations } = insights;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · AI Insights</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">AI Career Insights</h1>
            <p className="mt-1 text-slate-500">Personalised recommendations generated from your resume analysis.</p>
          </div>
          <Link to="/resume/skill-profile" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            Skill Profile <ArrowRight size={16} />
          </Link>
        </div>

        {/* AI banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex items-start gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-black">AI Resume Assistant</p>
            <p className="mt-1 text-sm leading-6 text-blue-100">
              Based on your resume, I've identified your key strengths and the most impactful improvements to boost your career profile score.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-black text-slate-900">
              <CheckCircle2 size={18} className="text-emerald-500" /> Strengths
            </h2>
            <div className="space-y-3">
              {strengths.length > 0
                ? strengths.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-800">{s}</p>
                  </motion.div>
                ))
                : <p className="text-sm text-slate-500">Process your resume to unlock strengths.</p>}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-black text-slate-900">
              <TriangleAlert size={18} className="text-amber-500" /> Areas to Improve
            </h2>
            <div className="space-y-3">
              {weaknesses.length > 0
                ? weaknesses.map((w, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 rounded-xl bg-amber-50 p-3">
                    <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-500" />
                    <p className="text-sm font-medium text-amber-800">{w}</p>
                  </motion.div>
                ))
                : <p className="text-sm text-slate-500">No major issues detected.</p>}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 card p-6">
          <h2 className="mb-5 flex items-center gap-2 font-black text-slate-900">
            <Lightbulb size={18} className="text-blue-500" /> AI Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
                  {rec.category[0]}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-slate-900">{rec.title}</p>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${PRIORITY_STYLE[rec.priority]}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">{rec.category}</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{rec.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
