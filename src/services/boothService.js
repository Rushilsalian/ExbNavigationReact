import api from './api'

// Map DB row → frontend booth shape
const fromDb = (b) => ({
  id: b.id,
  hallId: b.hallId,
  name: b.exhibitorName ?? b.boothNumber,
  number: b.boothNumber,
  category: b.exhibitorInfo ?? 'General',
  shapeType: b.shape ?? 'rect',
  x: b.x,
  y: b.y,
  width: b.width ?? 80,
  height: b.height ?? 60,
  rotation: b.rotation ?? 0,
})

// Map frontend booth → DB payload
const toDb = (booth) => ({
  boothNumber: booth.number,
  x: booth.x,
  y: booth.y,
  width: booth.width,
  height: booth.height,
  shape: booth.shapeType,
  rotation: booth.rotation ?? 0,
  exhibitorName: booth.name,
  exhibitorInfo: booth.category,
})

export const fetchBooths = (hallId) =>
  api.get('/booths', { params: { hallId } })
    .then(r => r.data.data.booths.map(fromDb))

export const searchBooths = ({ hallId, exhibitionId, search, isActive } = {}) =>
  api.get('/booths', { params: { hallId, exhibitionId, search, isActive } })
    .then(r => r.data.data.booths.map(fromDb))

export const createBooth = (hallId, booth) =>
  api.post('/booths', { hallId, ...toDb(booth) })
    .then(r => fromDb(r.data.data.booth))

export const updateBooth = (boothId, updates) =>
  api.patch(`/booths/${boothId}`, {
    ...(updates.number !== undefined && { boothNumber: updates.number }),
    ...(updates.x !== undefined && { x: updates.x }),
    ...(updates.y !== undefined && { y: updates.y }),
    ...(updates.width !== undefined && { width: updates.width }),
    ...(updates.height !== undefined && { height: updates.height }),
    ...(updates.shapeType !== undefined && { shape: updates.shapeType }),
    ...(updates.rotation !== undefined && { rotation: updates.rotation }),
    ...(updates.name !== undefined && { exhibitorName: updates.name }),
    ...(updates.category !== undefined && { exhibitorInfo: updates.category }),
  }).then(r => fromDb(r.data.data.booth))

export const deleteBooth = (boothId) =>
  api.delete(`/booths/${boothId}`).then(r => r.data)
