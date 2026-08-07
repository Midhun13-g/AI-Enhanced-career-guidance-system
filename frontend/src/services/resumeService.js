import api from './api';

// ── Core resume CRUD (matches /api/resumes/*) ──────────────────────────────
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file); // backend expects @RequestPart("resume")
  return api.post('/api/resumes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const getResumeHistory = ()         => api.get('/api/resumes');
export const getResume        = (id)       => api.get(`/api/resumes/${id}`);
export const parseResume      = (id)       => api.post(`/api/resumes/${id}/parse`);
export const getResumeAnalysis= (id)       => api.get(`/api/resumes/${id}/analysis`);
export const updateResume     = (id, data) => api.put(`/api/resumes/${id}`, data);
export const deleteResume     = (id)       => api.delete(`/api/resumes/${id}`);
export const downloadResume   = (id)       => api.get(`/api/resumes/${id}/download`, { responseType: 'blob' });

// ── Module 3 NLP pipeline (matches /api/student/resume/*) ─────────────────
export const processResume    = (id) => api.post(`/api/student/resume/process/${id}`);
export const getResumeReport  = (id) => api.get(`/api/student/resume/report/${id}`);
export const getResumeEntities= (id) => api.get(`/api/student/resume/entities/${id}`);
export const getStudentSkills = ()   => api.get('/api/student/resume/skills');
export const getProfileImpact = ()   => api.get('/api/student/resume/profile-impact');
