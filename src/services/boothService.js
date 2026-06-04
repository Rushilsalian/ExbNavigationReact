import api from './api'

export const fetchBooths = (hallId) =>
  api.get('/booths', { params: { hallId } }).then(r => r.data.data.booths)

export const searchBooths = ({ hallId, exhibitionId, search, isActive } = {}) =>
  api.get('/booths', { params: { hallId, exhibitionId, search, isActive } }).then(r => r.data.data.booths)
