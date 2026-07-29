import api from './api';

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const previewResume = (id) => api.get(`/api/resume/${id}`);
export const parseResume = (id) => api.post(`/api/resume/parse/${id}`);
export const getExtractedData = (id) => api.get(`/api/resume/${id}`);
export const updateResume = (id, data) => api.put(`/api/resume/update/${id}`, data);
export const getResumeAnalysis = (id) => api.get(`/api/resume/analysis/${id}`);
export const getResumeHistory = () => api.get('/api/resume/history');
export const deleteResume = (id) => api.delete(`/api/resume/${id}`);
