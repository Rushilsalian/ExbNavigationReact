import api from './api'

export const fetchHalls = () => api.get('/halls').then(r => r.data)

export const fetchHallById = (hallId) => api.get(`/halls/${hallId}`).then(r => r.data)

export const createHall = (payload) => api.post('/halls', payload).then(r => r.data)

export const updateHall = (hallId, payload) => api.patch(`/halls/${hallId}`, payload).then(r => r.data)

export const deleteHall = (hallId) => api.delete(`/halls/${hallId}`).then(r => r.data)

export const uploadHallSvg = (hallId, formData, onUploadProgress) =>
  api.post(`/halls/${hallId}/svg`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  }).then(r => r.data)

export const fetchDashboardStats = () => api.get('/dashboard/stats').then(r => r.data)
