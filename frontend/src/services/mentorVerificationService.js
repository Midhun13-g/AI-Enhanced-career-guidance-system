import api from './api';
const data = (r) => r.then(({ data }) => data);
export const mentorVerificationService = {
  register: (payload) => data(api.post('/api/auth/register/mentor', payload)), upload: (file) => { const body = new FormData(); body.append('file', file); return data(api.post('/api/auth/mentor-documents', body)); },
  me: () => data(api.get('/api/mentors/me')), update: (payload) => data(api.put('/api/mentors/profile', payload)),
  list: () => data(api.get('/api/admin/mentors/pending')), detail: (id) => data(api.get(`/api/admin/mentors/${id}`)), approve: (id) => data(api.post(`/api/admin/mentors/${id}/approve`)), reject: (id, remarks) => data(api.post(`/api/admin/mentors/${id}/reject`, { remarks })), stats: () => data(api.get('/api/admin/mentors/statistics')),
};
