import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, FileText, Loader2, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeReport, getStudentSkills } from '../../services/resumeService';

export default function ResumeReport() {
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
    Promise.all([getResumeReport(resumeId), getStudentSkills()])
      .then(([repRes, skillRes]) => {
        setReport(repRes.data);
        setSkills(skillRes.data ?? []);
      })
      .catch(() => setError('Failed to load report. Please process your resume first.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin" size={22} /> Loading report…
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
    { name: 'Skill Score',     value: report.skillScore     ?? 0 },
    { name: 'Project Score',   value: report.projectScore   ?? 0 },
    { name: 'Education Score', value: report.educationScore ?? 0 },
    { name: 'ATS Score',       value: report.atsScore       ?? 0 },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Module 3 · Report</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Resume Report</h1>
            <p className="mt-1 text-slate-500">Your complete AI-generated resume intelligence report.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              <Download size={16} /> Download PDF
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <Share2 size={16} /> Share Report
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden" id="resume-report">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-600 px-8 py-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200">AI Resume Intelligence Report</span>
                </div>
                <h2 className="text-3xl font-black">Resume Analysis</h2>
                <p className="mt-1 text-sm text-blue-200">
                  Generated {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'just now'}
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center">
                <p className="text-3xl font-black">{Math.round(report.overallScore ?? 0)}%</p>
                <p className="text-xs font-bold text-blue-200">Resume Score</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 px-8">
            {/* AI Feedback */}
            {report.aiFeedback && (
              <section className="py-6">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">AI Feedback</h3>
                <p className="text-sm leading-6 text-slate-700">{report.aiFeedback}</p>
              </section>
            )}

            {/* Skills */}
            <section className="py-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Extracted Skills ({skills.length})
              </h3>
              {skills.length === 0
                ? <p className="text-sm text-slate-500">No skills extracted yet.</p>
                : (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s.id} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                        {s.normalizedName}
                      </span>
                    ))}
                  </div>
                )}
            </section>

            {/* Score breakdown */}
            <section className="py-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">AI Score Breakdown</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {sections.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                    <span className="font-black text-blue-600">{Math.round(s.value)}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between bg-slate-50 px-8 py-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <FileText size={13} />
              <span>Generated by CareerAI · Resume Intelligence System</span>
            </div>
            <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
