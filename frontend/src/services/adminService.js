import api from './api';

const unwrap = (promise) => promise.then((response) => response.data);

export const adminService = {
  getDashboard: () => unwrap(api.get('/api/admin/dashboard')),
  getStudents: (params) => unwrap(api.get('/api/admin/users', { params })),
  getStudent: (id) => unwrap(api.get(`/api/admin/student/${id}`)),
  updateStudent: (id, data) => unwrap(api.put(`/api/admin/student/${id}`, data)),
  deleteStudent: (id) => unwrap(api.delete(`/api/admin/student/${id}`)),
  getQuestions: (params) => unwrap(api.get('/api/admin/questions', { params })),
  createQuestion: (data) => unwrap(api.post('/api/admin/questions', data)),
  updateQuestion: (id, data) => unwrap(api.put(`/api/admin/questions/${id}`, data)),
  deleteQuestion: (id) => unwrap(api.delete(`/api/admin/questions/${id}`)),
  getResumes: (params) => unwrap(api.get('/api/admin/resumes', { params })),
  getResume: (id) => unwrap(api.get(`/api/admin/resume/${id}`)),
  deleteResume: (id) => unwrap(api.delete(`/api/admin/resume/${id}`)),
  downloadResume: (id) => api.get(`/api/admin/resume/${id}/download`, { responseType: 'blob' }),
};
