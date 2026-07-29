import api from './api';
import { assessmentQuestions } from '../utils/assessmentData';
import { calculateAssessmentResult } from '../utils/assessmentScoring';

const ASSESSMENT_STORAGE_KEY = 'career_ai_assessment';

function readLocalSession() {
  try {
    return JSON.parse(localStorage.getItem(ASSESSMENT_STORAGE_KEY)) || { answers: {}, startedAt: null, result: null };
  } catch {
    return { answers: {}, startedAt: null, result: null };
  }
}

function writeLocalSession(session) {
  localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(session));
  return session;
}

const fallback = {
  startAssessment() {
    const session = writeLocalSession({ ...readLocalSession(), startedAt: new Date().toISOString() });
    return { assessmentId: 'local-assessment', ...session };
  },
  getQuestions() {
    return { questions: assessmentQuestions };
  },
  saveAnswer(payload) {
    const session = readLocalSession();
    writeLocalSession({
      ...session,
      answers: { ...session.answers, [payload.questionId]: payload.answer },
      updatedAt: new Date().toISOString(),
    });
    return { saved: true };
  },
  submitAssessment(payload) {
    const result = calculateAssessmentResult(payload.answers || readLocalSession().answers || {});
    writeLocalSession({ ...readLocalSession(), answers: payload.answers, result, submittedAt: new Date().toISOString() });
    return { submitted: true, result };
  },
  getResult() {
    const session = readLocalSession();
    return { result: session.result || calculateAssessmentResult(session.answers || {}) };
  },
};

async function requestWithFallback(request, localResolver) {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    if (error.response?.status && error.response.status !== 404) {
      throw error;
    }
    return localResolver();
  }
}

export function startAssessment() {
  return requestWithFallback(() => api.post('/api/assessment/start'), fallback.startAssessment);
}

export function getQuestions() {
  return requestWithFallback(() => api.get('/api/assessment/questions'), fallback.getQuestions);
}

export function saveAnswer(payload) {
  return requestWithFallback(() => api.post('/api/assessment/save-answer', payload), () => fallback.saveAnswer(payload));
}

export function submitAssessment(payload) {
  return requestWithFallback(() => api.post('/api/assessment/submit', payload), () => fallback.submitAssessment(payload));
}

export function getResult() {
  return requestWithFallback(() => api.get('/api/assessment/result'), fallback.getResult);
}

export default {
  startAssessment,
  getQuestions,
  saveAnswer,
  submitAssessment,
  getResult,
};
