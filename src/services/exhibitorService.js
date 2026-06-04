import api from './api'

export const fetchExhibitors = ({ exhibitionId, hallId, search } = {}) =>
  api.get('/exhibitors', { params: { exhibitionId, hallId, search } }).then(r => r.data.data.exhibitors)
