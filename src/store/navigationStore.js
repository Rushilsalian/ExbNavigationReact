import { create } from 'zustand'

export const NODE_TYPES = {
  WALKWAY: 'walkway',
  ENTRY: 'entry',
  EXIT: 'exit',
  ESCALATOR: 'escalator',
  LIFT: 'lift',
  JUNCTION: 'junction',
}

const useNavigationStore = create((set, get) => ({
  nodesMap: {},
  edgesMap: {},
  selectedNodeId: null,
  selectedEdgeId: null,
  activeGraphHallId: null,
  isConnectMode: false,
  connectSource: null,

  getAllNodes: () => Object.values(get().nodesMap),
  getAllEdges: () => Object.values(get().edgesMap),
  getNodeById: (id) => get().nodesMap[id] ?? null,
  getEdgeById: (id) => get().edgesMap[id] ?? null,
  getEdgesForNode: (nodeId) =>
    Object.values(get().edgesMap).filter(
      e => e.sourceId === nodeId || e.targetId === nodeId
    ),

  setGraph: ({ nodes, edges }) => {
    const nodesMap = {}
    const edgesMap = {}
    nodes.forEach(n => (nodesMap[n.id] = n))
    edges.forEach(e => (edgesMap[e.id] = e))
    set({ nodesMap, edgesMap })
  },
  addNode: (node) =>
    set(state => ({ nodesMap: { ...state.nodesMap, [node.id]: node } })),
  updateNode: (nodeId, updates) =>
    set(state => ({
      nodesMap: { ...state.nodesMap, [nodeId]: { ...state.nodesMap[nodeId], ...updates } },
    })),
  removeNode: (nodeId) =>
    set(state => {
      const { [nodeId]: _removed, ...nodesMap } = state.nodesMap
      const edgesMap = Object.fromEntries(
        Object.entries(state.edgesMap).filter(
          ([, e]) => e.sourceId !== nodeId && e.targetId !== nodeId
        )
      )
      return {
        nodesMap,
        edgesMap,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      }
    }),
  addEdge: (edge) =>
    set(state => ({ edgesMap: { ...state.edgesMap, [edge.id]: edge } })),
  removeEdge: (edgeId) =>
    set(state => {
      const { [edgeId]: _removed, ...edgesMap } = state.edgesMap
      return {
        edgesMap,
        selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
      }
    }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),
  clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),
  setActiveGraphHall: (hallId) => set({ activeGraphHallId: hallId }),
  toggleConnectMode: () =>
    set(state => ({ isConnectMode: !state.isConnectMode, connectSource: null })),
  setConnectSource: (nodeId) => set({ connectSource: nodeId }),
  clearGraph: () =>
    set({ nodesMap: {}, edgesMap: {}, selectedNodeId: null, selectedEdgeId: null }),
}))

export default useNavigationStore
