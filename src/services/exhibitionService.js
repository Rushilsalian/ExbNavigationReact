import api from './api'

export const fetchExhibitions = () =>
  api.get('/exhibitions').then(r => r.data.data.exhibitions)

export const createExhibition = (payload) =>
  api.post('/exhibitions', payload).then(r => r.data.data.exhibition)
