import api from './api'

export const fetchKioskSync = ({ exhibitionId, lastSyncAt } = {}) =>
  api.get('/kiosk/sync', { params: { exhibitionId, lastSyncAt: lastSyncAt || undefined } }).then(r => r.data.data)
