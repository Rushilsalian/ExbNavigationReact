import api from './api'

export const createNode = ({ hallId, label, x, y, nodeType }) =>
  api.post('/navigation/node', { hallId, label, x, y, nodeType }).then(r => r.data.data)

export const createEdge = ({ fromId, toId, weight, bidirectional }) =>
  api.post('/navigation/edge', { fromId, toId, weight, bidirectional }).then(r => r.data.data)

export const computeRoute = ({ fromNodeId, toNodeId }) =>
  api.post('/navigation/route', { fromNodeId, toNodeId }).then(r => r.data.data)
