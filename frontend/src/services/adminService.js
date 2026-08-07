import api from './api';

const unwrap = (promise) => promise.then((response) => response.data);

export const adminService = {
  // Dashboard
  getDashboard: () => unwrap(api.get('/api/admin/dashboard')),

  // Students — backend: /api/admin/students
  getStudents:   (params) => unwrap(api.get('/api/admin/students', { params })),
  getStudent:    (id)     => unwrap(api.get(`/api/admin/students/${id}`)),
  updateStudent: (id, data) => unwrap(api.put(`/api/admin/students/${id}`, data)),
  deleteStudent: (id)     => unwrap(api.delete(`/api/admin/students/${id}`)),

  // Assessment questions — backend: /api/admin/assessments/questions
  getQuestions:    (params) => unwrap(api.get('/api/admin/assessments/questions', { params })),
  createQuestion:  (data)   => unwrap(api.post('/api/admin/assessments/questions', data)),
  updateQuestion:  (id, data) => unwrap(api.put(`/api/admin/assessments/questions/${id}`, data)),
  deleteQuestion:  (id)     => unwrap(api.delete(`/api/admin/assessments/questions/${id}`)),

  // Resumes — backend: /api/admin/resumes
  getResumes:  (params) => unwrap(api.get('/api/admin/resumes', { params })),
  getResume:   (id)     => unwrap(api.get(`/api/admin/resumes/${id}`)),
  deleteResume:(id)     => unwrap(api.delete(`/api/admin/resumes/${id}`)),

  // Skill taxonomy — backend: /api/admin/skills
  getSkills:    (params) => unwrap(api.get('/api/admin/skills', { params })),
  createSkill:  (data)   => unwrap(api.post('/api/admin/skills', data)),
  updateSkill:  (id, data) => unwrap(api.put(`/api/admin/skills/${id}`, data)),
  deleteSkill:  (id)     => unwrap(api.delete(`/api/admin/skills/${id}`)),

  // Resume statistics
  getResumeStatistics: () => unwrap(api.get('/api/admin/resume/statistics')),
};
