import api from './api'

export const fetchNavGraph = (hallId) => api.get(`/halls/${hallId}/navigation`).then(r => r.data)

export const saveNavGraph = (hallId, graph) =>
  api.put(`/halls/${hallId}/navigation`, graph).then(r => r.data)

export const createNode = (hallId, node) =>
  api.post(`/halls/${hallId}/navigation/nodes`, node).then(r => r.data)

export const updateNode = (hallId, nodeId, payload) =>
  api.patch(`/halls/${hallId}/navigation/nodes/${nodeId}`, payload).then(r => r.data)

export const deleteNode = (hallId, nodeId) =>
  api.delete(`/halls/${hallId}/navigation/nodes/${nodeId}`).then(r => r.data)

export const createEdge = (hallId, edge) =>
  api.post(`/halls/${hallId}/navigation/edges`, edge).then(r => r.data)

export const deleteEdge = (hallId, edgeId) =>
  api.delete(`/halls/${hallId}/navigation/edges/${edgeId}`).then(r => r.data)
