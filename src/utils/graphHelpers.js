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

// Kruskal's MST — returns [{fromId, toId}] pairs not already in existingEdgeSet.
// existingEdgeSet: Set of "minId-maxId" strings for already-present edges.
export const mstEdgePairs = (nodes, existingEdgeSet = new Set()) => {
  if (nodes.length < 2) return []

  const idToIdx = Object.fromEntries(nodes.map((n, i) => [n.id, i]))
  const parent = nodes.map((_, i) => i)
  const rank = new Array(nodes.length).fill(0)

  const find = (x) => { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x] }
  const union = (x, y) => {
    const px = find(x), py = find(y)
    if (px === py) return false
    if (rank[px] < rank[py]) parent[px] = py
    else if (rank[px] > rank[py]) parent[py] = px
    else { parent[py] = px; rank[px]++ }
    return true
  }

  // Pre-union existing edges so MST only adds what's truly missing
  existingEdgeSet.forEach(key => {
    const [a, b] = key.split('-').map(Number)
    const ai = idToIdx[a], bi = idToIdx[b]
    if (ai !== undefined && bi !== undefined) union(ai, bi)
  })

  // Build all candidate edges sorted by Euclidean distance
  const candidates = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      candidates.push({
        i, j,
        fromId: nodes[i].id,
        toId: nodes[j].id,
        dist: Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y),
      })
    }
  }
  candidates.sort((a, b) => a.dist - b.dist)

  const result = []
  for (const e of candidates) {
    const key = `${Math.min(e.fromId, e.toId)}-${Math.max(e.fromId, e.toId)}`
    if (!existingEdgeSet.has(key) && union(e.i, e.j)) {
      result.push({ fromId: e.fromId, toId: e.toId })
    }
  }
  return result
}

export const serializeGraph = (nodesMap, edgesMap) => ({
  nodes: Object.values(nodesMap),
  edges: Object.values(edgesMap),
})

// Single-source Dijkstra returning a dist map: nodeId → shortest total weight from startId.
// Treats all edges as bidirectional so distances are symmetric.
function dijkstraFrom(nodesMap, edgesMap, startId) {
  const dist = {}
  Object.keys(nodesMap).forEach(id => (dist[id] = Infinity))
  dist[startId] = 0

  // Build undirected adjacency on the fly (edges may be stored as directed)
  const adj = {}
  Object.keys(nodesMap).forEach(id => (adj[id] = []))
  Object.values(edgesMap).forEach(edge => {
    const w = edge.weight ?? 1
    if (adj[edge.sourceId]) adj[edge.sourceId].push({ nodeId: edge.targetId, weight: w })
    if (adj[edge.targetId]) adj[edge.targetId].push({ nodeId: edge.sourceId, weight: w })
  })

  const visited = new Set()
  const remaining = new Set(Object.keys(nodesMap))

  while (remaining.size > 0) {
    let current = null
    remaining.forEach(id => {
      if (!visited.has(id) && (current === null || dist[id] < dist[current])) current = id
    })
    if (!current || dist[current] === Infinity) break
    visited.add(current)
    remaining.delete(current)
    adj[current]?.forEach(({ nodeId, weight }) => {
      const alt = dist[current] + weight
      if (alt < dist[nodeId]) dist[nodeId] = alt
    })
  }

  return dist
}

// Returns a structured distance matrix between all booths and all entry/exit nodes.
// Booth position is snapped to the nearest nav node; snap distance is added to graph distance.
export const computeDistanceMatrix = (nodesMap, edgesMap, booths) => {
  const nodes = Object.values(nodesMap)
  if (nodes.length === 0 || booths.length === 0) return null

  const snapToNearest = (cx, cy) => {
    let nearest = null, minD = Infinity
    nodes.forEach(n => {
      const d = Math.sqrt((n.x - cx) ** 2 + (n.y - cy) ** 2)
      if (d < minD) { minD = d; nearest = n }
    })
    return { node: nearest, snapDist: minD }
  }

  // Attach nearest nav node to each booth
  const boothMeta = booths.map(b => {
    const cx = b.x + (b.width ?? 0) / 2
    const cy = b.y + (b.height ?? 0) / 2
    const { node, snapDist } = snapToNearest(cx, cy)
    return { booth: b, nearestNodeId: node?.id ?? null, snapDist }
  })

  // Run Dijkstra once per unique source nav node (booths sharing same nearest node share the result)
  const sourceIds = [...new Set(boothMeta.map(m => m.nearestNodeId).filter(Boolean))]
  const distFrom = {}
  sourceIds.forEach(id => { distFrom[id] = dijkstraFrom(nodesMap, edgesMap, id) })

  const totalDist = (fromMeta, toNodeId, toSnapDist = 0) => {
    if (!fromMeta.nearestNodeId) return null
    const g = distFrom[fromMeta.nearestNodeId]?.[toNodeId] ?? Infinity
    if (g === Infinity) return null
    return Math.round((g + fromMeta.snapDist + toSnapDist) * 100) / 100
  }

  // Booth-to-booth
  const boothToBooths = []
  for (let i = 0; i < boothMeta.length; i++) {
    for (let j = 0; j < boothMeta.length; j++) {
      if (i === j) continue
      const from = boothMeta[i], to = boothMeta[j]
      const d = totalDist(from, to.nearestNodeId, to.snapDist)
      boothToBooths.push({
        from: { id: from.booth.id, name: from.booth.name, number: from.booth.number },
        to: { id: to.booth.id, name: to.booth.name, number: to.booth.number },
        distance: d,
        reachable: d !== null,
      })
    }
  }

  // Booth-to-entry/exit
  const gateNodes = nodes.filter(n => n.nodeType === 'entry' || n.nodeType === 'exit')
  const boothToGates = []
  boothMeta.forEach(meta => {
    gateNodes.forEach(gate => {
      const d = totalDist(meta, gate.id)
      boothToGates.push({
        booth: { id: meta.booth.id, name: meta.booth.name, number: meta.booth.number },
        gate: { id: gate.id, label: gate.label, type: gate.nodeType },
        distance: d,
        reachable: d !== null,
      })
    })
  })

  return {
    generatedAt: new Date().toISOString(),
    summary: { totalBooths: booths.length, totalGates: gateNodes.length, totalNavNodes: nodes.length },
    boothToBooths,
    boothToGates,
  }
}
