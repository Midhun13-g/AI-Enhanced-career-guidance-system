import { useCallback, useEffect, useState } from 'react';
import assessmentService from '../services/assessmentService';
import { useAssessmentContext } from '../context/AssessmentContext';

export default function useAssessment() {
  const context = useAssessmentContext();
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assessmentService.getQuestions();
      setQuestions(data.questions || data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load assessment questions');
    } finally {
      setLoading(false);
    }
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assessmentService.startAssessment();
      context.setAssessmentId(data.assessmentId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [context]);

  const persistAnswer = useCallback(async (questionId, answer) => {
    context.setAnswer(questionId, answer);
    try {
      await assessmentService.saveAnswer({
        assessmentId: context.assessmentId,
        questionId,
        answer,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Answer saved locally. Server sync failed.');
    }
  }, [context]);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await assessmentService.submitAssessment({
        assessmentId: context.assessmentId,
        answers: context.answers,
      });
      setResult(data.result);
      return data.result;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit assessment');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [context.answers, context.assessmentId]);

  const loadResult = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assessmentService.getResult();
      setResult(data.result || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load assessment result');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    ...context,
    questions,
    result,
    loading,
    submitting,
    error,
    start,
    persistAnswer,
    submit,
    loadResult,
  };
}
