import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useNavigationStore from '../store/navigationStore'
import useHallStore from '../store/hallStore'
import { fetchGraph } from '../services/navigationService'

function fromDb(nodes, edges) {
  return {
    nodes: nodes.map(n => ({
      id: n.id,
      hallId: n.hallId,
      label: n.label ?? '',
      x: n.x,
      y: n.y,
      nodeType: n.nodeType.toLowerCase(),
    })),
    edges: edges.map(e => ({
      id: e.id,
      sourceId: e.fromId,
      targetId: e.toId,
      weight: e.weight,
      directed: true,
    })),
  }
}

export default function useNavigationQuery() {
  const activeHallId = useHallStore(s => s.activeHallId)
  const setGraph = useNavigationStore(s => s.setGraph)
  const clearGraph = useNavigationStore(s => s.clearGraph)
  const setActiveGraphHall = useNavigationStore(s => s.setActiveGraphHall)

  useEffect(() => {
    setActiveGraphHall(activeHallId)
    if (!activeHallId) clearGraph()
  }, [activeHallId, setActiveGraphHall, clearGraph])

  return useQuery({
    queryKey: ['navigation', activeHallId],
    queryFn: async () => {
      const { nodes, edges } = await fetchGraph(activeHallId)
      const mapped = fromDb(nodes, edges)
      setGraph(mapped)
      return mapped
    },
    enabled: !!activeHallId,
    staleTime: 30_000,
  })
}
