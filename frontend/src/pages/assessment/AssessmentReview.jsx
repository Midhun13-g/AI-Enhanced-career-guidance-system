import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Edit3, Send } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import ConfirmationModal from '../../components/assessment/ConfirmationModal';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';
import { useToast } from '../../context/ToastContext';

function formatAnswer(answer, question) {
  if (Array.isArray(answer)) return answer.join(', ');
  if (answer === undefined || answer === '') return 'Not answered';
  return question.options?.find((option) => String(option.value) === String(answer))?.label || String(answer);
}

export default function AssessmentReview() {
  const navigate = useNavigate();
  const toast = useToast();
  const assessment = useAssessment();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const questions = assessment.questions;

  const grouped = useMemo(() => assessmentSections.map((section) => ({
    ...section,
    questions: questions.filter((question) => question.sectionId === section.id),
  })), [questions]);
  const missingQuestions = useMemo(
    () => questions.filter((question) => {
      const answer = assessment.answers[question.id];
      return question.required && (Array.isArray(answer) ? answer.length === 0 : answer === undefined || answer === '');
    }),
    [questions, assessment.answers],
  );
  const isComplete = questions.length > 0 && missingQuestions.length === 0;

  const editQuestion = (questionId) => {
    const index = questions.findIndex((question) => question.id === questionId);
    assessment.setCurrentQuestionIndex(Math.max(0, index));
    navigate('/assessment/quiz');
  };

  const submit = async () => {
    if (!isComplete) {
      toast?.('Please complete all required questions before submitting.', 'error');
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Review Answers</p>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">Confirm before submission</h1>
            <p className="mt-2 text-sm text-slate-600">Review each response and edit any answer before the final analysis.</p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!isComplete}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={17} /> Submit Assessment
          </button>
        </div>

        {!isComplete && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Submit is disabled until all required questions are answered. Missing: {missingQuestions.length}
          </div>
        )}

        <div className="space-y-5">
          {grouped.map((section) => (
            <section key={section.id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{section.eyebrow}</p>
                  <h2 className="text-lg font-extrabold text-slate-950">{section.title}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{section.questions.length} questions</span>
              </div>
              <div className="divide-y divide-slate-100">
                {section.questions.map((question) => {
                  const answer = assessment.answers[question.id];
                  const answered = Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== '';
                  return (
                    <div key={question.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className={answered ? 'text-emerald-500' : 'text-slate-300'} aria-hidden="true" />
                          <p className="text-sm font-bold text-slate-900">{question.title}</p>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{formatAnswer(answer, question)}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">{section.title}</p>
                      </div>
                      <button onClick={() => editQuestion(question.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <Edit3 size={15} /> Edit Answer
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        title="Submit assessment?"
        message="Your responses will be analyzed to generate scores, personality insights, interest distribution, and career previews."
        confirmLabel="Submit"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={submit}
      />
    </AppLayout>
  );
}
