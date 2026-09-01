import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiClock,
  FiHelpCircle,
  FiBarChart2,
  FiTarget,
  FiRotateCcw,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
  FiArrowLeft,
  FiArrowRight,
  FiPlay,
  FiLayers,
  FiCpu,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';

const defaultAssessment = {
  title: 'SQL & Relational Database Architecture',
  category: 'Technical Systems',
  description:
    'A standardized evaluation covering relational database paradigms, SQL query writing, normalization forms, B-tree indexing mechanics, and ACID transaction safety. Calibrated for backend and data engineering tracks.',
  duration: '30 minutes',
  questions: 25,
  difficulty: 'Intermediate',
  passingScore: 60,
  maxAttempts: 3,
  skills: [
    'Complex SQL Queries',
    'Schema Normalization',
    'Multi-Table JOINs',
    'Query Execution Plans',
    'ACID Transactions',
    'Indexing Optimization',
  ],
};

const rules = [
  { icon: FiClock, text: 'Complete the evaluation within the allocated timeframe. Auto-submission occurs on timeout.' },
  { icon: FiShield, text: 'Strict session isolation is enforced. Switching browser windows will trigger telemetry warnings.' },
  { icon: FiCheckCircle, text: 'Candidate answer states are committed and persisted asynchronously on each step.' },
  { icon: FiAlertCircle, text: 'Exiting the designated evaluation viewport registers an integrity anomaly.' },
  { icon: FiRotateCcw, text: 'Candidates may navigate, review, and modify answer items prior to final submission.' },
];

const difficultyBadge = (val) => {
  const level = (val || '').toUpperCase();
  switch (level) {
    case 'FOUNDATIONAL':
    case 'EASY':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'INTERMEDIATE':
    case 'MEDIUM':
      return 'bg-blue-50 text-[#0038FF] border-blue-200/80';
    case 'ADVANCED':
    case 'HARD':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'EXPERT':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
};

export default function AssessmentDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const assessment =
    location.state?.assessment || location.state?.category
      ? {
          ...defaultAssessment,
          ...(location.state?.assessment || {}),
          title: location.state?.category?.name || defaultAssessment.title,
        }
      : defaultAssessment;

  const infoItems = [
    { icon: FiClock, label: 'Allocated Time', value: assessment.duration || '30 minutes' },
    { icon: FiHelpCircle, label: 'Question Volume', value: `${assessment.questions || 25} Items` },
    { icon: FiBarChart2, label: 'Standard Tier', value: assessment.difficulty || 'Intermediate' },
    { icon: FiTarget, label: 'Passing Threshold', value: `${assessment.passingScore || 60}%` },
    { icon: FiRotateCcw, label: 'Max Attempts', value: `${assessment.maxAttempts || 3} Allowed` },
    { icon: FiBookOpen, label: 'Curriculum Track', value: assessment.category || 'Technical Systems' },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8 pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Navigation & Back Link ── */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          <FiArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Assessment Directory</span>
        </motion.button>

        {/* ── Editorial Module Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 sm:p-8 shadow-xs space-y-4"
        >
          {/* Top Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038FF]" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                  {assessment.category || 'General Track'}
                </span>
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyBadge(
                    assessment.difficulty
                  )}`}
                >
                  {assessment.difficulty || 'Intermediate'}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                  <FiShield size={8} /> Proctored Test Bank
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                {assessment.title}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                {assessment.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Main Two-Column Briefing Grid ── */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Left Column: Metrics, Skills, & Protocols (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview Metric Tiles */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Module Parameters
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Standardized Criteria</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Icon size={12} className="text-[#0038FF]" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-xs font-bold text-neutral-900 font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Skills & Domains Tested */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Curriculum Competencies
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Evaluated Vectors</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(assessment.skills || defaultAssessment.skills).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-1.5 text-xs font-mono font-medium text-neutral-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Examination Rules & Integrity Protocols */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Proctoring Directives
                </span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                  Mandatory
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {rules.map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-[#F8FAFC] p-3 text-xs text-neutral-700 font-mono"
                  >
                    <Icon size={14} className="mt-0.5 shrink-0 text-[#0038FF]" />
                    <span className="leading-relaxed font-sans text-neutral-700 text-xs">{text}</span>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>

          {/* Right Column: Launch Action Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <motion.aside
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6 sticky top-6"
            >
              <div className="space-y-4">
                <div className="border-b border-neutral-100 pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Candidate Verification
                  </span>
                  <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Session Readiness</h2>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  {[
                    `${assessment.questions || 25} standardized items to evaluate`,
                    `${assessment.duration || '30 minutes'} strict runtime limit`,
                    `Minimum ${assessment.passingScore || 60}% composite benchmark`,
                    'Instant telemetry & diagnostic synthesis',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-neutral-600 text-xs">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0038FF]">
                        <FiCheckCircle size={11} />
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                <button
                  onClick={() =>
                    assessment.id
                      ? navigate(`/assessments/quiz/${assessment.id}`)
                      : navigate('/assessment')
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-3 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
                >
                  <FiPlay size={13} className="transition-transform group-hover:scale-110" />
                  <span>Begin Assessment</span>
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
                >
                  <span>Return to Catalog</span>
                </button>
              </div>
            </motion.aside>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}