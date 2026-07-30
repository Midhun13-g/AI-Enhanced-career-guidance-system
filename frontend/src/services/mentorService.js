import api from './api';
const get = (request) => request.then(({ data }) => data);
export const mentorService = {
  getDashboard: () => get(api.get('/api/mentor/dashboard')),
  getStudents: (params) => get(api.get('/api/mentor/students', { params })),
  getStudent: (id) => get(api.get(`/api/mentor/student/${id}`)),
  getAssessment: (studentId) => get(api.get(`/api/mentor/assessment/${studentId}`)),
  getResume: (studentId) => get(api.get(`/api/mentor/resume/${studentId}`)),
  submitFeedback: (feedback) => get(api.post('/api/mentor/feedback', feedback)),
};
