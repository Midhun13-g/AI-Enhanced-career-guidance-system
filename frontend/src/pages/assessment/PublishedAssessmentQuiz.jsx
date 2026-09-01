import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiAlertCircle,
  FiLoader,
  FiLayers,
  FiHelpCircle,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';

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

export default function PublishedAssessmentQuiz() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/assessment/published/${assessmentId}`)
      .then((response) => setAssessment(response.data))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            'This standardized assessment is no longer available.'
        )
      )
      .finally(() => setLoading(false));
  }, [assessmentId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl py-20 text-center space-y-3">
          <FiLoader size={24} className="mx-auto text-[#0038FF] animate-spin" />
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Initializing Proctored Test Session...
          </p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-xs font-mono text-rose-700 space-y-3">
          <div className="flex items-center gap-2 font-bold uppercase">
            <FiAlertCircle size={16} className="text-rose-600" />
            <span>Session Initialization Error</span>
          </div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/assessments/categories')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:underline pt-2"
          >
            <FiArrowLeft size={12} /> Return to Assessment Catalog
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!assessment?.questions?.length) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 text-center space-y-4">
          <FiHelpCircle size={28} className="mx-auto text-neutral-400" />
          <div>
            <h2 className="text-sm font-bold text-neutral-900">No Test Items Available</h2>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              This module does not currently contain any published questions in the item bank.
            </p>
          </div>
          <button
            onClick={() => navigate('/assessments/categories')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-mono font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <FiArrowLeft size={13} />
            <span>Back to Catalog</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  const question = assessment.questions[current];
  const answeredCount = Object.keys(answers).length;
  const isLast = current === assessment.questions.length - 1;
  const progressPct = ((current + 1) / assessment.questions.length) * 100;

  const handleSelectOption = (optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const finish = async () => {
    setSubmitting(true);
    setError('');
    try {
      const response = await api.post(
        `/api/assessment/published/${assessmentId}/submit`,
        {
          answers: Object.entries(answers).map(([questionId, optionId]) => ({
            questionId: Number(questionId),
            optionId,
          })),
          timeTakenSecs: null,
        }
      );
      navigate(
        `/assessments/quiz/${assessmentId}/result/${response.data.attemptId}`
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to commit assessment submission. Please try again.'
      );
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-4xl space-y-6 pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Exit Action ── */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-neutral-400 hover:text-neutral-800 transition-colors group"
        >
          <FiArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Exit Evaluation Session</span>
        </button>

        {/* ── Module Header Briefing Card ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600">
                  {assessment.category || 'Technical Track'}
                </span>
                <span
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${difficultyBadge(
                    assessment.difficulty
                  )}`}
                >
                  {assessment.difficulty || 'Intermediate'}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                  <FiShield size={8} /> Proctored Live
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950">
                {assessment.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 bg-[#F8FAFC] border border-neutral-200/80 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
              <FiClock size={13} className="text-[#0038FF]" />
              <span>{assessment.durationMinutes || 30} mins allocated</span>
            </div>
          </div>

          {/* Progress Telemetry Rails */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-500">
                Item <strong className="text-neutral-950">{current + 1}</strong> of{' '}
                <strong className="text-neutral-950">{assessment.questions.length}</strong>
              </span>
              <span className="text-neutral-500">
                Committed: <strong className="text-[#0038FF]">{answeredCount}</strong> / {assessment.questions.length}
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#0038FF]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* ── Active Question Viewport ── */}
        <motion.section
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
              Question Item {current + 1}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-950 leading-relaxed font-sans">
              {question.questionText}
            </h2>
          </div>

          {/* Answer Options Grid */}
          <div className="grid gap-3 pt-2">
            {question.options?.map((option, index) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`group flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-[#0038FF] bg-blue-50/40 text-neutral-950 shadow-xs'
                      : 'border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/60'
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#0038FF] text-white'
                        : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-800'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Error Prompt If Submission Fails ── */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-xs font-mono text-rose-700">
            <FiAlertCircle size={15} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Footer Navigation & Submission Controls ── */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            disabled={!current || submitting}
            onClick={() => setCurrent((val) => Math.max(0, val - 1))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 px-4 py-2.5 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
          >
            <FiArrowLeft size={13} />
            <span>Previous</span>
          </button>

          {isLast ? (
            <button
              disabled={answeredCount !== assessment.questions.length || submitting}
              onClick={finish}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20"
            >
              {submitting ? (
                <>
                  <FiLoader size={13} className="animate-spin" />
                  <span>Synthesizing Telemetry...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle size={13} />
                  <span>Finalize & Submit</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={() => setCurrent((val) => Math.min(assessment.questions.length - 1, val + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <span>Next Item</span>
              <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>

      </main>
    </AppLayout>
  );
}