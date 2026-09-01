import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiShield,
  FiActivity,
  FiUploadCloud,
  FiLayers,
  FiCompass,
  FiTarget,
  FiAward,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import { getResumeAnalysis, getStudentSkills } from '../../services/resumeService';

function CircleScore({ value, label, sublabel }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const v = Math.round(value ?? 0);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="-rotate-90" width="112" height="112">
          <circle cx="56" cy="56" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
          <motion.circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke="#0038FF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (v / 100) * circ }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-black text-neutral-950 font-mono tracking-tight leading-none">
            {v}%
          </p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-neutral-900 font-mono">{label}</p>
        {sublabel && <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#0F172A',
  borderRadius: 8,
  border: 'none',
  color: '#FFFFFF',
  fontSize: 11,
  fontFamily: 'monospace',
};

export default function ResumeAnalysis() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resumeId = sessionStorage.getItem('resumeId');
    if (!resumeId) {
      setError('No active resume record found. Please upload and parse a resume first.');
      setLoading(false);
      return;
    }
    Promise.all([getResumeAnalysis(resumeId), getStudentSkills()])
      .then(([anaRes, skillRes]) => {
        setReport(anaRes.data);
        setSkills(skillRes.data ?? []);
      })
      .catch(() => setError('Failed to load quality analysis. Please ensure the backend AI pipeline is active.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <FiActivity className="animate-spin text-[#0038FF]" size={24} />
          <span>Synthesizing resume quality vectors...</span>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-lg py-16 text-center antialiased">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <FiAlertCircle size={22} />
            </div>
            <p className="text-xs font-bold text-neutral-900 font-mono">{error}</p>
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-mono font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <FiUploadCloud size={14} />
              <span>Upload Resume Document</span>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const sections = [
    { name: 'Skills Vector',    value: Math.round(report?.skillScore     ?? 0) },
    { name: 'Projects & Exp',   value: Math.round(report?.projectScore   ?? 0) },
    { name: 'Academic Record',  value: Math.round(report?.educationScore ?? 0) },
    { name: 'ATS Parseability', value: Math.round(report?.atsScore       ?? 0) },
  ];

  const qualityMetrics = [
    { label: 'ATS Syntax & Schema Parseability', value: Math.round(report?.atsScore       ?? 0), sub: 'Industry standard tokenization' },
    { label: 'Skill Taxonomy Relevance',         value: Math.round(report?.skillScore     ?? 0), sub: 'Alignment to market requirements' },
    { label: 'Project Impact & Scope Index',     value: Math.round(report?.projectScore   ?? 0), sub: 'Outcome and metric quantification' },
    { label: 'Academic & Accreditation Score',   value: Math.round(report?.educationScore ?? 0), sub: 'Verified degree and coursework validation' },
  ];

  const radarData = sections.map((s) => ({
    subject: s.name.split(' ')[0],
    score: s.value,
    fullMark: 100,
  }));

  // Build feedback items
  const feedbackLines = (report?.aiFeedback ?? '').split('.').map((s) => s.trim()).filter(Boolean);
  const strengths = feedbackLines.filter((l) => !l.toLowerCase().startsWith('add') && !l.toLowerCase().startsWith('include'));
  const improvements = feedbackLines.filter((l) => l.toLowerCase().startsWith('add') || l.toLowerCase().startsWith('include'));

  return (
    <AppLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon & Breadcrumbs ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Resume Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Module 03 Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Resume Quality & Parsing Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Algorithmic evaluation measuring ATS formatting compatibility, semantic skill extraction fidelity, and quantified achievement scope.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/resume/upload"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiUploadCloud size={13} className="text-neutral-400" />
              <span>Upload New PDF</span>
            </Link>

            <button
              onClick={() => navigate('/resume/insights')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Explore AI Insights</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ── Top Metric Showcase (Score Ring, ATS Score & Detected Entities) ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Overall Score Circle (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Composite Quality Index
              </span>
              <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                Calibrated
              </span>
            </div>

            <div className="py-2 flex justify-center">
              <CircleScore
                value={report?.overallScore}
                label="Overall Resume Quality"
                sublabel="Multi-factor weighted index"
              />
            </div>

            <div className="text-[11px] font-mono text-neutral-400 text-center border-t border-neutral-100 pt-3">
              <span>Benchmark target: 80%+ for Tier-1 screening</span>
            </div>
          </motion.div>

          {/* ATS Compatibility Circle (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Parser Compatibility
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded uppercase">
                ATS Verified
              </span>
            </div>

            <div className="py-2 flex justify-center">
              <CircleScore
                value={report?.atsScore}
                label="ATS Readability Score"
                sublabel="Parsing error resistance"
              />
            </div>

            <div className="text-[11px] font-mono text-neutral-400 text-center border-t border-neutral-100 pt-3">
              <span>Verified against modern OCR and text extraction models</span>
            </div>
          </motion.div>

          {/* Extracted Entity Counter Tile (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Extracted Entities
                </span>
                <div className="h-6 w-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                  <FiLayers size={12} />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-4xl font-black text-neutral-950 font-mono tracking-tight">
                  {skills.length}
                </p>
                <p className="text-xs font-semibold text-neutral-700 font-mono">
                  Technical & Domain Competencies Detected
                </p>
                <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                  Structured entities tagged directly from candidate experience and project sections.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Taxonomy Density</span>
                <span className="font-bold text-neutral-900">{Math.min(100, skills.length * 8)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#0038FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, skills.length * 8)}%` }}
                  transition={{ duration: 0.9, delay: 0.15 }}
                />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Section 1: Detailed Quality Vector Breakdown Rails ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Component Diagnostic
              </span>
              <h2 className="text-sm font-bold text-neutral-950 mt-0.5">
                Multi-Factor Section Readiness Rails
              </h2>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
              Audited Metrics
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {qualityMetrics.map((m, i) => (
              <div
                key={m.label}
                className="rounded-xl border border-neutral-200/80 bg-[#F8FAFC] p-4 flex flex-col justify-between space-y-3 hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-neutral-900 font-mono">{m.label}</p>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{m.sub}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-950 shrink-0">
                    {m.value}%
                  </span>
                </div>

                <div className="h-2 w-full bg-neutral-200/80 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#0038FF] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ delay: i * 0.08, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-neutral-100 pt-3">
            <span>Aggregated assessment score based on current parsed structure.</span>
            <span className="text-[#0038FF] font-semibold">4 Sections Audited</span>
          </div>
        </motion.div>

        {/* ── Section 2: Visual Telemetry (Bar + Radar Visualizations) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Section Readiness Bar Chart */}
          <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Discrete Index
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Section Readiness Distribution</h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">0–100 Scale</span>
              </div>

              <div className="h-60 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sections} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <PolarGrid stroke="#F1F5F9" />
                    <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}%`, 'Score']} />
                    <Bar dataKey="value" fill="#0038FF" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Balanced sectional distribution across technical, experience, and academic vectors.
            </p>
          </section>

          {/* Skill Radar Polyline */}
          <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Geometric Vector
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Resume Dimensional Radar</h2>
                </div>
                <span className="text-[10px] font-mono text-[#0038FF] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  Calibrated
                </span>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: '#475569', fontFamily: 'monospace' }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#0038FF"
                      fill="#0038FF"
                      fillOpacity={0.12}
                      strokeWidth={1.75}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-mono text-center pt-2 border-t border-neutral-100">
              Radial polygon representation across 4 core resume dimensions.
            </p>
          </section>

        </div>

        {/* ── Section 3: Diagnostic Observations (Strengths & Improvement Areas) ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Demonstrated Strengths */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 border-b border-neutral-100 pb-3">
              <FiCheckCircle size={15} />
              <span className="uppercase tracking-wider">Demonstrated Formatting Strengths</span>
            </div>
            <div className="space-y-2.5">
              {strengths.length > 0 ? (
                strengths.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-neutral-800 font-sans"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-neutral-400 py-3">
                  Keep refining your resume layout to unlock identified strengths.
                </p>
              )}
            </div>
          </div>

          {/* Identified Remediation Gaps */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 border-b border-neutral-100 pb-3">
              <FiAlertCircle size={15} />
              <span className="uppercase tracking-wider">Identified Remediation Areas</span>
            </div>
            <div className="space-y-2.5">
              {improvements.length > 0 ? (
                improvements.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-amber-100 bg-amber-50/40 p-3 text-xs text-neutral-800 font-sans"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-neutral-400 py-3">
                  No structural formatting or semantic defects detected.
                </p>
              )}
            </div>
          </div>

        </div>

        {/* ── Section 4: Next-Step Interventions Strip ── */}
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs font-mono">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF]">
                Recommended Next Step
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
              <span className="text-[10px] text-neutral-400">Career Trajectory Analysis</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-950 font-sans">
              Review AI Semantic Role Matches & Skill Gaps
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
              Connect your parsed resume profile with the Hugging Face AI pipeline to discover matched roles, competency deficiencies, and SHAP explainability insights.
            </p>
          </div>

          <button
            onClick={() => navigate('/resume/insights')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group shrink-0"
          >
            <span>Launch AI Insights</span>
            <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </AppLayout>
  );
}