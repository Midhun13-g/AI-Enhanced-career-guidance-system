import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { assessmentQuestions } from '../utils/assessmentData';
import { getCompletionPercentage, getMissingRequiredQuestions } from '../utils/assessmentScoring';

const AssessmentContext = createContext(null);

const initialAnswers = (() => {
  try {
    return JSON.parse(localStorage.getItem('career_ai_assessment'))?.answers || {};
  } catch {
    return {};
  }
})();

export function AssessmentProvider({ children }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentId, setAssessmentId] = useState(null);

  const setAnswer = useCallback((questionId, answer) => {
    setAnswers((current) => ({ ...current, [questionId]: answer }));
  }, []);

  const resetAssessment = useCallback(() => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentId(null);
    localStorage.removeItem('career_ai_assessment');
  }, []);

  const value = useMemo(() => {
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    const missingQuestions = getMissingRequiredQuestions(answers);
    return {
      answers,
      setAnswer,
      currentQuestion,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      assessmentId,
      setAssessmentId,
      resetAssessment,
      completion: getCompletionPercentage(answers),
      missingQuestions,
      isComplete: missingQuestions.length === 0,
      totalQuestions: assessmentQuestions.length,
    };
  }, [answers, assessmentId, currentQuestionIndex, resetAssessment, setAnswer]);

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentContext must be used inside AssessmentProvider');
  }
  return context;
}
