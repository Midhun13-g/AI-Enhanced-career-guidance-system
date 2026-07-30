import api from './api';
const data = (r) => r.then(({ data }) => data);
export const mentorVerificationService = {
  register: (payload) => data(api.post('/api/mentors/register', payload)), upload: (file, type) => { const body = new FormData(); body.append('file', file); body.append('type', type); return data(api.post('/api/mentors/upload', body)); },
  me: () => data(api.get('/api/mentors/me')), update: (payload) => data(api.put('/api/mentors/profile', payload)),
  list: (params) => data(api.get('/api/admin/mentors', { params })), detail: (id) => data(api.get(`/api/admin/mentors/${id}`)), approve: (id) => data(api.put(`/api/admin/mentors/${id}/approve`)), reject: (id, reason) => data(api.put(`/api/admin/mentors/${id}/reject`, { reason })), requestInfo: (id, reason) => data(api.put(`/api/admin/mentors/${id}/request-info`, { reason })), suspend: (id, reason) => data(api.put(`/api/admin/mentors/${id}/suspend`, { reason })),
};
