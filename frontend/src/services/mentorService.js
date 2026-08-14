import api from './api';

const get = (request) => request.then(({ data }) => data);

export const mentorService = {
  getDashboard:   ()       => get(api.get('/api/mentor/dashboard')),
  getStudents:    (params) => get(api.get('/api/mentor/students', { params })),
  getStudent:     (id)     => get(api.get(`/api/mentor/students/${id}`)),   // fixed: singular → plural
  getStudentResume:(id)    => get(api.get(`/api/mentor/students/${id}/resume`)),
  submitFeedback: (feedback) => get(api.post('/api/mentor/feedback', feedback)),
};
