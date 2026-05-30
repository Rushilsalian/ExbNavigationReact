export const generateId = (prefix = 'id') =>
  `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`

export const buildAdjacencyList = (nodesMap, edgesMap) => {
  const list = {}
  Object.keys(nodesMap).forEach(id => (list[id] = []))

  Object.values(edgesMap).forEach(edge => {
    const weight = edge.weight ?? 1
    if (list[edge.sourceId]) {
      list[edge.sourceId].push({ nodeId: edge.targetId, edgeId: edge.id, weight })
    }
    if (!edge.directed && list[edge.targetId]) {
      list[edge.targetId].push({ nodeId: edge.sourceId, edgeId: edge.id, weight })
    }
  })

  return list
}

export const nodeDistance = (nodeA, nodeB) => {
  const dx = nodeA.x - nodeB.x
  const dy = nodeA.y - nodeB.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Dijkstra's shortest path — returns nodeId[] from start to end, or null if unreachable
export const findShortestPath = (adjacencyList, startId, endId) => {
  const dist = {}
  const prev = {}
  const visited = new Set()

  Object.keys(adjacencyList).forEach(id => (dist[id] = Infinity))
  dist[startId] = 0

  const remaining = new Set(Object.keys(adjacencyList))

  while (remaining.size > 0) {
    let current = null
    remaining.forEach(id => {
      if (!visited.has(id) && (current === null || dist[id] < dist[current])) {
        current = id
      }
    })

    if (current === null || dist[current] === Infinity) break
    if (current === endId) break

    visited.add(current)
    remaining.delete(current)

    adjacencyList[current]?.forEach(({ nodeId, weight }) => {
      const alt = dist[current] + weight
      if (alt < dist[nodeId]) {
        dist[nodeId] = alt
        prev[nodeId] = current
      }
    })
  }

  if (dist[endId] === Infinity) return null

  const path = []
  let cur = endId
  while (cur) { path.unshift(cur); cur = prev[cur] }
  return path
}

export const serializeGraph = (nodesMap, edgesMap) => ({
  nodes: Object.values(nodesMap),
  edges: Object.values(edgesMap),
})
