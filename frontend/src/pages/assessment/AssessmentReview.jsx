import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiEdit2,
  FiSend,
  FiShield,
  FiAlertCircle,
  FiHelpCircle,
  FiArrowLeft,
  FiLayers,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import ConfirmationModal from '../../components/assessment/ConfirmationModal';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';
import { useToast } from '../../context/ToastContext';

function formatAnswer(answer, question) {
  if (Array.isArray(answer)) return answer.length ? answer.join(', ') : 'Not answered';
  if (answer === undefined || answer === '') return 'Not answered';
  return (
    question?.options?.find((option) => String(option.value) === String(answer))?.label ||
    String(answer)
  );
}

export default function AssessmentReview() {
  const navigate = useNavigate();
  const toast = useToast();
  const assessment = useAssessment();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const questions = assessment.questions || [];

  const grouped = useMemo(
    () =>
      assessmentSections.map((section) => ({
        ...section,
        questions: questions.filter((question) => question.sectionId === section.id),
      })),
    [questions]
  );

  const missingQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const answer = assessment.answers[question.id];
        return (
          question.required &&
          (Array.isArray(answer)
            ? answer.length === 0
            : answer === undefined || answer === '')
        );
      }),
    [questions, assessment.answers]
  );

  const isComplete = questions.length > 0 && missingQuestions.length === 0;

  const editQuestion = (questionId) => {
    const index = questions.findIndex((question) => question.id === questionId);
    assessment.setCurrentQuestionIndex(Math.max(0, index));
    navigate('/assessment/quiz');
  };

  const submit = async () => {
    if (!isComplete) {
      toast?.('Please complete all mandatory questions prior to submission.', 'error');
      setConfirmOpen(false);
      return;
    }
    setConfirmOpen(false);
    await assessment.submit();
    setTimeout(() => navigate('/assessment/result'), 1300);
  };

  if (assessment.submitting) {
    return <LoadingAnimation />;
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Header Ribbon & Submit Trigger ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Verification Ledger
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                <FiShield size={9} /> Pre-Submission Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
              Audit & Confirm Responses
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
              Verify your committed answers across all assessment sections. You can edit any individual question before final synthesis.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/assessment/quiz')}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 py-2.5 px-4 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs"
            >
              <FiArrowLeft size={13} />
              <span>Return to Quiz</span>
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              disabled={!isComplete}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-5 font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
            >
              <FiSend size={13} className="transition-transform group-hover:translate-x-0.5" />
              <span>Finalize & Submit</span>
            </button>
          </div>
        </div>

        {/* ── Status Banner for Missing Items ── */}
        {!isComplete && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs font-mono text-amber-800">
            <FiAlertCircle size={16} className="shrink-0 text-amber-600" />
            <span>
              Submission is locked until all mandatory items are committed. Missing: <strong>{missingQuestions.length} required item{missingQuestions.length === 1 ? '' : 's'}</strong>.
            </span>
          </div>
        )}

        {/* ── Question Breakdown by Section ── */}
        <div className="space-y-6">
          {grouped.map((section, idx) => (
            <section
              key={section.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-5"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0038FF] font-mono">
                    {section.eyebrow || `Part 0${idx + 1}`}
                  </span>
                  <h2 className="text-base font-bold text-neutral-950 mt-0.5">
                    {section.title}
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded">
                  {section.questions.length} Items Total
                </span>
              </div>

              {/* Item Rows */}
              <div className="divide-y divide-neutral-100">
                {section.questions.map((question, qIdx) => {
                  const answer = assessment.answers[question.id];
                  const answered = Array.isArray(answer)
                    ? answer.length > 0
                    : answer !== undefined && answer !== '';
                  const formatted = formatAnswer(answer, question);

                  return (
                    <div
                      key={question.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 group"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-start gap-2.5">
                          <span className={`mt-0.5 shrink-0 ${answered ? 'text-emerald-600' : 'text-neutral-300'}`}>
                            <FiCheckCircle size={15} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-neutral-950 leading-snug">
                              <span className="font-mono text-neutral-400 mr-1.5">{qIdx + 1}.</span>
                              {question.title}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[11px] font-mono uppercase text-neutral-400">Response:</span>
                              <span
                                className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-medium ${
                                  answered
                                    ? 'bg-blue-50 text-[#0038FF] border border-blue-100'
                                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200 italic'
                                }`}
                              >
                                {formatted}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modify Answer Action */}
                      <button
                        onClick={() => editQuestion(question.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:border-[#0038FF] hover:text-[#0038FF] hover:bg-blue-50/40 text-neutral-700 px-3 py-1.5 font-mono text-xs font-semibold tracking-wide transition-all shadow-2xs shrink-0 self-start sm:self-auto"
                      >
                        <FiEdit2 size={12} className="text-neutral-400 group-hover:text-[#0038FF]" />
                        <span>Edit Item</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>

      {/* ── Submission Confirmation Modal ── */}
      <ConfirmationModal
        open={confirmOpen}
        title="Finalize & Submit Assessment?"
        message="Your committed answers will be analyzed by the diagnostic engine to generate skill vectors, gap telemetry, and career path recommendations."
        confirmLabel="Confirm Submission"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submit}
      />
    </AppLayout>
  );
}