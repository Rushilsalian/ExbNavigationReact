import api from './api'

export const fetchHalls = (exhibitionId) =>
  api.get('/halls', { params: { exhibitionId } }).then(r => r.data.data.halls)

export const fetchHallById = (hallId) =>
  api.get(`/halls/${hallId}`).then(r => r.data.data.hall)

export const deleteHall = (hallId) =>
  api.delete(`/halls/${hallId}`).then(r => r.data)

export const uploadHallWithSvg = (exhibitionId, hallName, file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('svg', file)
  formData.append('exhibitionId', String(exhibitionId))
  formData.append('hallName', hallName)
  return api.post('/svg/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  }).then(r => r.data.data)
}
