import api from './api';

const data = request => request.then(response => response.data);

export const assessmentService = {
  startAssessment: () => data(api.post('/api/assessment/start')),
  getQuestions: () => data(api.get('/api/assessment/questions')),
  saveAnswer: payload => data(api.post('/api/assessment/save-answer', payload)),
  updateAnswer: (answerId, payload) => data(api.put(`/api/assessment/update-answer/${answerId}`, payload)),
  submitAssessment: ({ sessionId }) => data(api.post('/api/assessment/submit', { sessionId })),
  getResult: sessionId => data(api.get(`/api/assessment/result/${sessionId}`)),
  getHistory: () => data(api.get('/api/assessment/history')),
};

export const startAssessment = assessmentService.startAssessment;
export const getQuestions = assessmentService.getQuestions;
export const saveAnswer = assessmentService.saveAnswer;
export const submitAssessment = assessmentService.submitAssessment;
export const getResult = assessmentService.getResult;
export default assessmentService;
