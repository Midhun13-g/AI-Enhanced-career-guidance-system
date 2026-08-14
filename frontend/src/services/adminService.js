import api from './api';

const unwrap = (promise) => promise.then((response) => response.data);

export const adminService = {
  // Dashboard
  getDashboard: () => unwrap(api.get('/api/admin/dashboard')),
  generateAssessmentPlan: (data) => unwrap(api.post('/api/admin/ai/assessments/plan', data)),
  createAssessment: (data) => unwrap(api.post('/api/admin/assessments', data)),
  getAssessments: () => unwrap(api.get('/api/admin/assessments')),

  // Accounts
  getUsers: (params) => unwrap(api.get('/api/admin/users', { params })),
  activateUser: (id) => unwrap(api.patch(`/api/admin/users/${id}/activate`)),
  deactivateUser: (id) => unwrap(api.patch(`/api/admin/users/${id}/deactivate`)),

  // Mentors
  getMentors: () => unwrap(api.get('/api/admin/mentors')),
  activateMentor: (id) => unwrap(api.patch(`/api/admin/mentors/${id}/activate`)),
  deactivateMentor: (id) => unwrap(api.patch(`/api/admin/mentors/${id}/deactivate`)),

  // Students — backend: /api/admin/students
  getStudents:   (params) => unwrap(api.get('/api/admin/students', { params })),
  getStudent:    (id)     => unwrap(api.get(`/api/admin/students/${id}`)),
  updateStudent: (id, data) => unwrap(api.put(`/api/admin/students/${id}`, data)),
  deleteStudent: (id)     => unwrap(api.delete(`/api/admin/students/${id}`)),

  // Assessment question bank
  getQuestions:    (params) => unwrap(api.get('/api/admin/questions', { params })),
  createQuestion:  (data)   => unwrap(api.post('/api/admin/questions', data)),
  updateQuestion:  (id, data) => unwrap(api.put(`/api/admin/questions/${id}`, data)),
  deleteQuestion:  (id)     => unwrap(api.delete(`/api/admin/questions/${id}`)),

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
