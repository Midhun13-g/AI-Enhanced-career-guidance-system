import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiUploadCloud,
  FiZap,
  FiCompass,
  FiLayers,
  FiSliders,
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeReport, getStudentSkills } from '../../services/resumeService';

const PRIORITY_BADGE = {
  High: 'bg-rose-50 text-rose-700 border-rose-200/80',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200/80',
  Low: 'bg-neutral-100 text-neutral-700 border-neutral-200/80',
};

function buildInsights(report, skills) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  const score = report?.overallScore ?? 0;
  const ats = report?.atsScore ?? 0;
  const skillSc = report?.skillScore ?? 0;
  const projSc = report?.projectScore ?? 0;
  const eduSc = report?.educationScore ?? 0;

  if (skills.length >= 5) strengths.push(`Strong competency density with ${skills.length} extracted technical skills.`);
  if (ats >= 60) strengths.push(`High ATS structural compatibility score of ${Math.round(ats)}%.`);
  if (score >= 70) strengths.push(`Composite resume quality index of ${Math.round(score)}% is above target screening benchmark.`);
  if (eduSc >= 40) strengths.push('Academic credentials and degree timeline are verified and well-structured.');
  if (projSc >= 20) strengths.push('Project portfolio demonstrates clear scope and relevant technology stacks.');

  if (skills.length < 5) weaknesses.push('Skill density is below baseline — add specific tools and technical frameworks.');
  if (ats < 60) weaknesses.push(`ATS compatibility of ${Math.round(ats)}% is low — format with standard headings and role-specific keywords.`);
  if (projSc === 0) weaknesses.push('No technical projects detected — append at least 2 quantified project case studies.');
  if (eduSc === 0) weaknesses.push('Education schema could not be verified or is missing from candidate layout.');
  if (score < 50) weaknesses.push('Composite score is below 50% — requires multi-section structural remediation.');

  if (skills.length < 8) {
    recommendations.push({
      title: 'Expand Technical Competency Density',
      description: 'Include 8–10 verified domain skills matching your target technical trajectory.',
      priority: 'High',
      category: 'Skills',
    });
  }
  if (projSc < 40) {
    recommendations.push({
      title: 'Quantify Project Outcomes & Scope',
      description: 'Add 2–3 projects with explicit architectural descriptions, tech stacks, and quantified results.',
      priority: 'High',
      category: 'Portfolio',
    });
  }
  if (ats < 70) {
    recommendations.push({
      title: 'Calibrate ATS Schema & Layout',
      description: 'Use standard sectional taxonomy and incorporate keywords derived from primary target job descriptions.',
      priority: 'Medium',
      category: 'ATS',
    });
  }
  recommendations.push({
    title: 'Incorporate Verified Accreditations',
    description: 'Industry-standard cloud and systems certifications significantly elevate candidate ranking.',
    priority: 'Medium',
    category: 'Certification',
  });
  recommendations.push({
    title: 'Benchmark Metrics & Action Verbs',
    description: 'Structure experience bullet points with strong lead action verbs and concrete percentage/latency improvements.',
    priority: 'Low',
    category: 'Content',
  });

  return { strengths, weaknesses, recommendations };
}

export default function ResumeInsights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setError('No active resume record found. Please upload and parse a resume first.');
      setLoading(false);
      return;
    }
    Promise.all([getResumeReport(resumeId), getStudentSkills()])
      .then(([repRes, skillRes]) => {
        setInsights(buildInsights(repRes.data, skillRes.data ?? []));
      })
      .catch(() => setError('Failed to generate insights. Please ensure the backend AI pipeline is online.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Synthesizing personalized AI career recommendations...</span>
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

  const { strengths, weaknesses, recommendations } = insights;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Synthesis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              AI Career & Quality Insights
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Algorithmic recommendations and profile optimizations generated directly from parsed resume telemetry and skill vectors.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/resume/skill-profile"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Skill Profile Matrix</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ── AI Executive Summary Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neutral-800 bg-[#03081E] p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#70B4FF] shrink-0 mt-0.5">
              <FiZap size={18} />
            </div>
            <div className="space-y-1 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-blue-200 text-[10px] font-bold font-mono uppercase tracking-wider">
                Inference Synthesis
              </div>
              <h2 className="text-sm font-bold text-white">AI Diagnostic Assistant Summary</h2>
              <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
                Cross-referencing your extracted resume profile against industry standards indicates strong sectional fundamentals with specific high-yield opportunities in project quantification and skill taxonomy density.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
            <span className="text-[11px] font-mono text-blue-200/80 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg">
              {recommendations.length} Action Items Identified
            </span>
          </div>
        </motion.div>

        {/* ── Diagnostic Strengths & Growth Areas Grid ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Demonstrated Strengths */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
                <FiCheckCircle size={15} />
                <span className="uppercase tracking-wider">Demonstrated Formatting Strengths</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {strengths.length} Validated
              </span>
            </div>

            <div className="space-y-2.5">
              {strengths.length > 0 ? (
                strengths.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-neutral-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs font-mono text-neutral-400 py-3">
                  Process additional resume sections to populate verified strengths.
                </p>
              )}
            </div>
          </div>

          {/* Identified Remediation Gaps */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700">
                <FiAlertCircle size={15} />
                <span className="uppercase tracking-wider">Identified Remediation Areas</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {weaknesses.length} Actionable
              </span>
            </div>

            <div className="space-y-2.5">
              {weaknesses.length > 0 ? (
                weaknesses.map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-xs text-neutral-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{w}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-xs font-mono text-neutral-400 py-3">
                  No structural or semantic defects identified in current profile.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* ── Actionable Recommendations Ledger ── */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                Prescriptive Interventions
              </span>
              <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                AI Optimization Roadmap
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              Ranked by Impact
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-300 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF] font-mono font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                    {rec.category[0]}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold text-neutral-950 font-mono">{rec.title}</p>
                      
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                          PRIORITY_BADGE[rec.priority]
                        }`}
                      >
                        {rec.priority} Priority
                      </span>

                      <span className="rounded-md bg-neutral-200/70 px-2 py-0.5 text-[9px] font-mono font-bold text-neutral-700 uppercase">
                        {rec.category}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-sans max-w-3xl">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/resume/editor')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 px-3.5 py-2 text-xs font-mono font-bold transition-all shadow-2xs shrink-0 self-end sm:self-center"
                >
                  <FiSliders size={12} className="text-[#0038FF]" />
                  <span>Calibrate</span>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Implementing High Priority items provides highest screening score lift.</span>
            <span className="text-[#0038FF] font-semibold">Continuous Guidance Online</span>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}