import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  FiTerminal,
  FiBarChart2,
  FiCpu,
  FiCompass,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiSave,
  FiCornerDownRight,
  FiAlertCircle,
  FiShield,
  FiLayers,
} from 'react-icons/fi';
import AppLayout from '../../components/layout/AppLayout';
import AssessmentProgress from '../../components/assessment/AssessmentProgress';
import CategoryHeader from '../../components/assessment/CategoryHeader';
import QuestionCard from '../../components/assessment/QuestionCard';
import Timer from '../../components/assessment/Timer';
import EmptyState from '../../components/common/EmptyState';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';
import { getQuestionSection } from '../../utils/assessmentScoring';
import { useToast } from '../../context/ToastContext';

const icons = {
  technical: FiTerminal,
  aptitude: FiBarChart2,
  personality: FiCpu,
  interests: FiCompass,
};

export default function AssessmentQuiz() {
  const navigate = useNavigate();
  const toast = useToast();
  const assessment = useAssessment();
  const questions = assessment.questions?.length ? assessment.questions : [];
  const currentQuestion = questions[assessment.currentQuestionIndex];

  const currentSection = currentQuestion
    ? getQuestionSection(currentQuestion) ||
      assessmentSections.find((s) => s.id === currentQuestion.sectionId) ||
      assessmentSections[0]
    : assessmentSections[0];

  const methods = useForm({
    defaultValues: { answers: assessment.answers },
    mode: 'onChange',
  });

  const Icon = icons[currentSection?.id] || FiTerminal;

  const sectionQuestions = useMemo(
    () => questions.filter((q) => q.sectionId === currentSection?.id),
    [questions, currentSection]
  );

  const sectionPosition =
    sectionQuestions.findIndex((q) => q.id === currentQuestion?.id) + 1;

  const missingQuestions = useMemo(
    () =>
      questions.filter((q) => {
        const answer = assessment.answers[q.id];
        return (
          q.required &&
          (Array.isArray(answer)
            ? answer.length === 0
            : answer === undefined || answer === '')
        );
      }),
    [questions, assessment.answers]
  );

  const completion = questions.length
    ? Math.round(((questions.length - missingQuestions.length) / questions.length) * 100)
    : 0;

  const isComplete = questions.length > 0 && missingQuestions.length === 0;
  const isLastQuestion = assessment.currentQuestionIndex === questions.length - 1;
  const canPrevious = assessment.currentQuestionIndex > 0;

  const goNext = async () => {
    const valid = await methods.trigger(`answers.${currentQuestion.id}`);
    if (!valid) return;
    assessment.setCurrentQuestionIndex(
      Math.min(questions.length - 1, assessment.currentQuestionIndex + 1)
    );
  };

  const save = async () => {
    const value = methods.getValues(`answers.${currentQuestion.id}`);
    await assessment.persistAnswer(currentQuestion.id, value);
    toast?.('Answer committed to session', 'success');
  };

  const skip = () => {
    assessment.setCurrentQuestionIndex(
      Math.min(questions.length - 1, assessment.currentQuestionIndex + 1)
    );
  };

  if (!currentQuestion) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12">
          <EmptyState
            title="Evaluation Session Uninitialized"
            message="Item bank could not be loaded for this test session. Return to the curriculum catalog to restart."
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-16 antialiased selection:bg-[#0038FF] selection:text-white">
        
        {/* ── Top Fixed Telemetry Bar: Progress & Session Status ── */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0038FF]">
                <Icon size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Diagnostic Session
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                    <FiShield size={8} /> Proctored Module
                  </span>
                </div>
                <h2 className="text-sm font-bold text-neutral-950 font-sans">
                  {currentSection.title}
                </h2>
              </div>
            </div>

            {/* Timer Tile */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Timer minutes={45} />
            </div>
          </div>

          <AssessmentProgress
            current={assessment.currentQuestionIndex + 1}
            total={questions.length}
            section={currentSection}
            completion={completion}
          />
        </div>

        {/* ── Main Question Workspace ── */}
        <div className="space-y-5">
          <CategoryHeader
            eyebrow={`Section Module · ${sectionPosition > 0 ? sectionPosition : 1} of ${sectionQuestions.length || questions.length}`}
            title={currentSection.title}
            description={currentSection.description}
            icon={Icon}
          />

          <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentQuestion.id || assessment.currentQuestionIndex}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <QuestionCard
                      question={currentQuestion}
                      answer={assessment.answers[currentQuestion.id]}
                      onAnswer={assessment.persistAnswer}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Standardized Action Bar ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200/80 font-mono">
                {/* Left Controls: Previous & Skip */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={!canPrevious}
                    onClick={() => assessment.setCurrentQuestionIndex(Math.max(0, assessment.currentQuestionIndex - 1))}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white text-neutral-700 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-2xs"
                  >
                    <FiArrowLeft size={13} />
                    <span>Previous</span>
                  </button>

                  {!isLastQuestion && (
                    <button
                      type="button"
                      onClick={skip}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-2xs"
                    >
                      <FiCornerDownRight size={13} />
                      <span>Skip</span>
                    </button>
                  )}
                </div>

                {/* Right Controls: Save Draft & Next / Submit */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={save}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-2xs"
                  >
                    <FiSave size={13} />
                    <span>Save Draft</span>
                  </button>

                  {isLastQuestion ? (
                    <button
                      type="button"
                      disabled={!isComplete}
                      onClick={() => navigate('/assessment/review')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:hover:bg-[#0038FF] text-white px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20"
                    >
                      <FiCheckCircle size={13} />
                      <span>Complete Review</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/20 group"
                    >
                      <span>Next Question</span>
                      <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Incomplete Warning Prompt */}
              {!isComplete && isLastQuestion && (
                <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs font-mono text-amber-800">
                  <FiAlertCircle size={15} className="shrink-0 text-amber-600" />
                  <span>
                    Answer all mandatory questions before proceeding to final submission. ({missingQuestions.length} remaining item{missingQuestions.length === 1 ? '' : 's'}).
                  </span>
                </div>
              )}
            </form>
          </FormProvider>
        </div>

      </div>
    </AppLayout>
  );
}