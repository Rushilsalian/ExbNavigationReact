import api from './api'

export const fetchGraph = (hallId) =>
  api.get('/navigation/graph', { params: { hallId } }).then(r => r.data.data)

export const createNode = ({ hallId, label, x, y, nodeType }) =>
  api.post('/navigation/node', { hallId, label, x, y, nodeType }).then(r => r.data.data)

export const updateNode = (nodeId, updates) =>
  api.put(`/navigation/node/${nodeId}`, updates).then(r => r.data.data)

export const deleteNode = (nodeId) =>
  api.delete(`/navigation/node/${nodeId}`)

export const createEdge = ({ fromId, toId, weight, bidirectional }) =>
  api.post('/navigation/edge', { fromId, toId, weight, bidirectional }).then(r => r.data.data)

export const deleteEdge = (edgeId) =>
  api.delete(`/navigation/edge/${edgeId}`)

export const computeRoute = ({ fromNodeId, toNodeId }) =>
  api.post('/navigation/route', { fromNodeId, toNodeId }).then(r => r.data.data)

export const batchCreateNodes = ({ hallId, nodes }) =>
  api.post('/navigation/nodes/batch', { hallId, nodes }).then(r => r.data.data)

export const batchCreateEdges = ({ pairs }) =>
  api.post('/navigation/edges/batch', { pairs }).then(r => r.data.data)

export const saveDistances = ({ hallId, boothToBooths, boothToGates }) =>
  api.post('/navigation/distances', { hallId, boothToBooths, boothToGates }, { timeout: 120_000 }).then(r => r.data.data)

export const fetchDistances = (hallId) =>
  api.get('/navigation/distances', { params: { hallId } }).then(r => r.data.data)
