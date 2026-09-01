import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiShare2,
  FiFileText,
  FiActivity,
  FiShield,
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiPrinter,
  FiAward,
} from 'react-icons/fi';
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
      setError('No active resume record found. Please upload and process a resume first.');
      setLoading(false);
      return;
    }
    Promise.all([getResumeReport(resumeId), getStudentSkills()])
      .then(([repRes, skillRes]) => {
        setReport(repRes?.data);
        setSkills(skillRes?.data ?? []);
      })
      .catch(() => setError('Failed to generate synthesis report. Please ensure the backend AI pipeline is active.'))
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CareerAI Resume Intelligence Report',
          text: `Overall Resume Quality Score: ${Math.round(report?.overallScore ?? 0)}%`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard.');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Generating AI resume intelligence report...</span>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-lg py-16 text-center antialiased">
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <FiAlertCircle size={22} />
            </div>
            <p className="text-xs font-bold text-neutral-900 font-mono">{error}</p>
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <FiUploadCloud size={14} />
              <span>Upload Resume</span>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const sections = [
    { name: 'Skill Vector Score',     value: report?.skillScore     ?? 0, sub: 'Taxonomy & depth coverage' },
    { name: 'Project & Exp Quality',  value: report?.projectScore   ?? 0, sub: 'Quantified impact & scope' },
    { name: 'Academic Verification',  value: report?.educationScore ?? 0, sub: 'Degree and coursework schema' },
    { name: 'ATS Parseability',       value: report?.atsScore       ?? 0, sub: 'OCR & tokenization compatibility' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6 print:hidden">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Executive Synthesis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Candidate Resume Report
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Consolidated intelligence dossier detailing parsing verification, section readiness scores, and algorithmic feedback.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20"
            >
              <FiPrinter size={13} />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiShare2 size={13} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ── Dossier Report Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          id="resume-report"
          className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden print:border-none print:shadow-none"
        >
          {/* Executive Header Banner */}
          <div className="bg-[#03081E] p-8 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-neutral-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-blue-200 text-[10px] font-bold font-mono uppercase tracking-wider">
                <FiZap size={10} className="text-blue-300" /> Executive Dossier
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Resume Intelligence Analysis
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Generated {report?.generatedAt ? new Date(report.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'September 1, 2026'} · Verified Pipeline Token
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 border border-white/15 px-6 py-4 text-center shrink-0 min-w-[140px] shadow-sm">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono leading-none">
                {Math.round(report?.overallScore ?? 0)}%
              </span>
              <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest font-mono mt-1.5">
                Quality Index
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 p-6 sm:p-8 space-y-6">
            
            {/* AI Feedback Section */}
            {report?.aiFeedback && (
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                    Diagnostic Commentary
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Synthesized
                  </span>
                </div>
                <div className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 text-xs font-sans text-neutral-700 leading-relaxed">
                  {report.aiFeedback}
                </div>
              </section>
            )}

            {/* Extracted Skills Section */}
            <section className="space-y-3 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Extracted Competencies
                </span>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                  {skills.length} Detected
                </span>
              </div>

              {skills.length === 0 ? (
                <p className="text-xs font-mono text-neutral-400 py-2">No technical skills detected in document schema.</p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((s, i) => (
                    <span
                      key={s.id || i}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-1 text-xs font-mono font-medium text-[#0038FF]"
                    >
                      {s.normalizedName || s.skillName || 'Skill'}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Score Breakdown Section */}
            <section className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                  Dimensional Score Breakdown
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  0–100 Benchmark
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {sections.map((s) => (
                  <div
                    key={s.name}
                    className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-neutral-900 font-mono">{s.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{s.sub}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-neutral-950 shrink-0">
                        {Math.round(s.value)}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-neutral-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0038FF] rounded-full"
                        style={{ width: `${Math.round(s.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Dossier Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-[#F8FAFC] px-8 py-4 text-xs font-mono text-neutral-400 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <FiFileText size={13} className="text-[#0038FF]" />
              <span>CareerAI Intelligence Dossier · Module 03 Pipeline</span>
            </div>
            <span>September 1, 2026 · Confidential Candidate Audit</span>
          </div>
        </motion.div>

      </div>
    </AppLayout>
  );
}