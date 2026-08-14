import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Clock, HelpCircle, BarChart3, Target, RefreshCw, Shield,
  CheckCircle2, AlertTriangle, BookOpen, ChevronLeft, Play,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';

const defaultAssessment = {
  title: 'SQL & Database Fundamentals',
  category: 'Technical',
  description: 'A comprehensive assessment covering relational database concepts, SQL query writing, normalization, indexing, and query optimization. Designed to evaluate your readiness for backend and data engineering roles.',
  duration: '30 minutes',
  questions: 25,
  difficulty: 'Medium',
  passingScore: 60,
  maxAttempts: 3,
  skills: ['SQL Queries', 'Normalization', 'Joins & Subqueries', 'Indexing', 'Transactions', 'Stored Procedures'],
};

const rules = [
  { icon: Clock, text: 'Complete the assessment before the timer ends. Auto-submission will occur.' },
  { icon: Shield, text: 'Do not switch browser tabs or windows during the assessment.' },
  { icon: CheckCircle2, text: 'All answers are auto-saved every 30 seconds.' },
  { icon: AlertTriangle, text: 'Leaving full-screen mode will trigger a warning.' },
  { icon: RefreshCw, text: 'You may review and change answers before final submission.' },
];

export default function AssessmentDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessment = location.state?.assessment || location.state?.category
    ? { ...defaultAssessment, ...(location.state?.assessment || {}), title: location.state?.category?.name || defaultAssessment.title }
    : defaultAssessment;

  const infoItems = [
    { icon: Clock, label: 'Duration', value: assessment.duration || '30 minutes' },
    { icon: HelpCircle, label: 'Questions', value: `${assessment.questions || 25} Questions` },
    { icon: BarChart3, label: 'Difficulty', value: assessment.difficulty || 'Medium' },
    { icon: Target, label: 'Passing Score', value: `${assessment.passingScore || 60}%` },
    { icon: RefreshCw, label: 'Max Attempts', value: assessment.maxAttempts || 3 },
    { icon: BookOpen, label: 'Category', value: assessment.category || 'Technical' },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Categories
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-glow"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge label={assessment.category || 'Technical'} variant="ai" />
                <Badge label={assessment.difficulty || 'Medium'} />
              </div>
              <h1 className="text-2xl font-extrabold leading-snug">{assessment.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-blue-100 max-w-xl">{assessment.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left: Info + Skills + Rules */}
          <div className="space-y-6">
            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
            >
              <h2 className="mb-4 text-base font-extrabold text-slate-900">Assessment Overview</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills Tested */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
            >
              <h2 className="mb-4 text-base font-extrabold text-slate-900">Skills Tested</h2>
              <div className="flex flex-wrap gap-2">
                {(assessment.skills || defaultAssessment.skills).map((skill) => (
                  <span key={skill} className="rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-amber-100 bg-amber-50 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-amber-600" />
                <h2 className="text-base font-extrabold text-amber-800">Assessment Rules</h2>
              </div>
              <div className="space-y-3">
                {rules.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon size={15} className="mt-0.5 shrink-0 text-amber-600" />
                    <p className="text-sm text-amber-800 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Action Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <h2 className="mb-4 text-base font-extrabold text-slate-900">Ready to Begin?</h2>
              <div className="space-y-3 mb-6">
                {[
                  `${assessment.questions || 25} questions to answer`,
                  `${assessment.duration || '30 minutes'} time limit`,
                  `Minimum ${assessment.passingScore || 60}% to pass`,
                  'Results available immediately',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => assessment.id ? navigate(`/assessments/quiz/${assessment.id}`) : navigate('/assessment')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Play size={16} /> Start Assessment
              </button>
              <button
                onClick={() => navigate(-1)}
                className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
