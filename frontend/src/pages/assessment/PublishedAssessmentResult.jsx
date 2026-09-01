import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiShield,
  FiArrowRight,
  FiRotateCcw,
  FiHelpCircle,
  FiClock,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';

export default function PublishedAssessmentResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [review, setReview] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/assessment/published/attempts/${attemptId}/result`)
      .then((response) => setResult(response.data))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            'Unable to load standardized assessment result audit.'
        )
      )
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl py-20 text-center space-y-3">
          <FiLoader size={24} className="mx-auto text-[#0038FF] animate-spin" />
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Synthesizing Assessment Telemetry...
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
            <span>Audit Retrieval Error</span>
          </div>
          <p>{error}</p>
          <button
            onClick={() => navigate('/assessments/history')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:underline pt-2"
          >
            <span>Return to Assessment History</span>
            <FiArrowRight size={12} />
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!result) return null;

  return (
    <AppLayout>
      <main className="mx-auto max-w-4xl space-y-8 pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Diagnostic Ledger
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Evaluated Attempt #{attemptId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Evaluation Result & Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Standardized scoring breakdown, item response correctness ledger, and performance calibration index.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 shrink-0 self-start sm:self-end">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Audit Verified</span>
          </div>
        </div>

        {/* ── Composite Score Hero Card ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          {/* Top Blue Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038FF]" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                result.passed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : 'bg-rose-50 text-rose-700 border-rose-200/80'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${result.passed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {result.passed ? 'Standard Met (Passed)' : 'Below Benchmark'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Benchmark: 60.0%</span>
            </div>

            <h2 className="text-xl font-bold text-neutral-950 font-sans">
              {result.passed ? 'Benchmark Criteria Satisfied' : 'Competency Remediation Recommended'}
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
              {result.passed
                ? 'Your submission satisfies the proficiency criteria required for this module.'
                : 'Review incorrect response items below to identify competency gaps before re-attempting.'}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end shrink-0 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Composite Percentage
            </span>
            <div className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mt-0.5">
              {result.percentage?.toFixed(1)}%
            </div>
          </div>
        </motion.section>

        {/* ── Metric Breakdown Tiles ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Correct Items
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FiCheckCircle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {result.correctAnswers ?? 0}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Accurately answered questions
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Incorrect Items
              </span>
              <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <FiXCircle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {result.wrongAnswers ?? 0}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Questions requiring review
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Skipped Items
              </span>
              <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <FiHelpCircle size={14} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-950 font-mono tracking-tight">
                {result.skippedAnswers ?? 0}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Unanswered question items
              </p>
            </div>
          </motion.div>

        </div>

        {/* ── Action Trigger Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setReview(!review)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
          >
            <FiList size={14} />
            <span>{review ? 'Hide Question Breakdown' : 'Audit Response Items'}</span>
          </button>

          <button
            onClick={() => navigate('/assessments/history')}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
          >
            <FiRotateCcw size={13} />
            <span>Assessment Ledger</span>
          </button>
        </div>

        {/* ── Question-by-Question Detailed Review ── */}
        <AnimatePresence>
          {review && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-2 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Itemized Diagnostics
                  </span>
                  <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                    Question Response Analysis
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
                  {result.review?.length || 0} Total Items
                </span>
              </div>

              <div className="space-y-3">
                {result.review?.map((item, index) => (
                  <article
                    key={item.questionId || index}
                    className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 hover:border-neutral-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 font-mono text-xs font-bold text-neutral-700">
                          {index + 1}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-950 leading-snug pt-0.5">
                          {item.questionText}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 border ${
                          item.correct
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-rose-50 text-rose-700 border-rose-200/80'
                        }`}
                      >
                        {item.correct ? (
                          <>
                            <FiCheckCircle size={10} /> Correct
                          </>
                        ) : (
                          <>
                            <FiXCircle size={10} /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 font-mono text-xs">
                      {/* Candidate Selection */}
                      <div className="flex items-start gap-2 text-neutral-700">
                        <span className="text-neutral-400 text-[11px] uppercase w-28 shrink-0">Your Answer:</span>
                        <span className={item.correct ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-600'}>
                          {item.selectedOption || 'Not answered'}
                        </span>
                      </div>

                      {/* Correct Option If Incorrect */}
                      {!item.correct && (
                        <div className="flex items-start gap-2 text-neutral-700">
                          <span className="text-neutral-400 text-[11px] uppercase w-28 shrink-0">Correct Answer:</span>
                          <span className="font-bold text-neutral-900">
                            {item.correctOption}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </main>
    </AppLayout>
  );
}