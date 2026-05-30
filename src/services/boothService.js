import api from './api'

export const fetchBooths = (hallId) => api.get(`/halls/${hallId}/booths`).then(r => r.data)

export const fetchBoothById = (hallId, boothId) =>
  api.get(`/halls/${hallId}/booths/${boothId}`).then(r => r.data)

export const createBooth = (hallId, payload) =>
  api.post(`/halls/${hallId}/booths`, payload).then(r => r.data)

export const updateBooth = (hallId, boothId, payload) =>
  api.patch(`/halls/${hallId}/booths/${boothId}`, payload).then(r => r.data)

export const deleteBooth = (hallId, boothId) =>
  api.delete(`/halls/${hallId}/booths/${boothId}`).then(r => r.data)

export const bulkUpdateBooths = (hallId, booths) =>
  api.put(`/halls/${hallId}/booths/bulk`, { booths }).then(r => r.data)
