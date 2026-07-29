import { AnimatePresence } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Brain, Code2, Compass } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import AssessmentProgress from '../../components/assessment/AssessmentProgress';
import CategoryHeader from '../../components/assessment/CategoryHeader';
import QuestionCard from '../../components/assessment/QuestionCard';
import QuestionNavigation from '../../components/assessment/QuestionNavigation';
import Timer from '../../components/assessment/Timer';
import EmptyState from '../../components/common/EmptyState';
import useAssessment from '../../hooks/useAssessment';
import { assessmentSections } from '../../utils/assessmentData';
import { getQuestionSection } from '../../utils/assessmentScoring';
import { useToast } from '../../context/ToastContext';

const icons = { technical: Code2, aptitude: BarChart3, personality: Brain, interests: Compass };

export default function AssessmentQuiz() {
  const navigate = useNavigate();
  const toast = useToast();
  const assessment = useAssessment();
  const questions = assessment.questions.length ? assessment.questions : [];
  const currentQuestion = questions[assessment.currentQuestionIndex];
  const currentSection = currentQuestion
    ? getQuestionSection(currentQuestion) || assessmentSections.find((section) => section.id === currentQuestion.sectionId) || assessmentSections[0]
    : assessmentSections[0];
  const methods = useForm({ defaultValues: { answers: assessment.answers }, mode: 'onChange' });
  const Icon = icons[currentSection?.id] || Code2;

  const sectionQuestions = useMemo(() => questions.filter((question) => question.sectionId === currentSection?.id), [questions, currentSection]);
  const sectionPosition = sectionQuestions.findIndex((question) => question.id === currentQuestion?.id) + 1;

  const goNext = async () => {
    const valid = await methods.trigger(`answers.${currentQuestion.id}`);
    if (!valid) return;
    assessment.setCurrentQuestionIndex(Math.min(questions.length - 1, assessment.currentQuestionIndex + 1));
  };

  const save = async () => {
    const value = methods.getValues(`answers.${currentQuestion.id}`);
    await assessment.persistAnswer(currentQuestion.id, value);
    toast?.('Answer saved', 'success');
  };

  const skip = () => {
    assessment.setCurrentQuestionIndex(Math.min(questions.length - 1, assessment.currentQuestionIndex + 1));
  };

  if (!currentQuestion) {
    return (
      <AppLayout>
        <EmptyState title="Assessment is not ready" message="Questions could not be loaded. Please try again from the instructions screen." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AssessmentProgress current={assessment.currentQuestionIndex + 1} total={questions.length} section={currentSection} completion={assessment.completion} />
      <div className="pt-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex justify-end">
            <Timer minutes={45} />
          </div>
          <CategoryHeader
            eyebrow={`${currentSection?.eyebrow || 'Section'} - ${sectionPosition} of ${sectionQuestions.length}`}
            title={currentSection.title}
            description={currentSection.description}
            icon={Icon}
          />

          <FormProvider {...methods}>
            <form>
              <AnimatePresence mode="wait">
                <QuestionCard
                  question={currentQuestion}
                  answer={assessment.answers[currentQuestion.id]}
                  onAnswer={assessment.persistAnswer}
                />
              </AnimatePresence>
              <QuestionNavigation
                canPrevious={assessment.currentQuestionIndex > 0}
                isLastQuestion={assessment.currentQuestionIndex === questions.length - 1}
                finishDisabled={!assessment.isComplete}
                onPrevious={() => assessment.setCurrentQuestionIndex(Math.max(0, assessment.currentQuestionIndex - 1))}
                onNext={goNext}
                onSkip={skip}
                onSave={save}
                onFinish={() => navigate('/assessment/review')}
              />
              {!assessment.isComplete && assessment.currentQuestionIndex === questions.length - 1 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  Answer all required questions before finishing. Missing: {assessment.missingQuestions.length}
                </p>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </AppLayout>
  );
}
