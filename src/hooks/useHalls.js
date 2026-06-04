import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHalls, fetchHallById, deleteHall } from '../services/hallService'
import useHallStore from '../store/hallStore'

export const useHallsQuery = () => {
  const setHalls = useHallStore(s => s.setHalls)
  const exhibitionId = useHallStore(s => s.exhibitionId)

  return useQuery({
    queryKey: ['halls', exhibitionId],
    queryFn: async () => {
      const halls = await fetchHalls(exhibitionId)
      setHalls(halls)
      return halls
    },
    enabled: !!exhibitionId,
  })
}

// Fetches the active hall's full data (including svgContent) and syncs it to the store.
// Call this once in BoothMapping and NavigationEditor so the canvas has SVG to render.
export const useActiveHallQuery = () => {
  const activeHallId = useHallStore(s => s.activeHallId)
  const setSvgContent = useHallStore(s => s.setSvgContent)
  const setSvgDimensions = useHallStore(s => s.setSvgDimensions)
  const clearSvg = useHallStore(s => s.clearSvg)

  return useQuery({
    queryKey: ['hall', activeHallId],
    queryFn: async () => {
      if (!activeHallId) { clearSvg(); return null }
      const hall = await fetchHallById(activeHallId)
      if (hall?.svgContent) {
        setSvgContent(hall.svgContent)
        setSvgDimensions({ width: hall.width ?? 0, height: hall.height ?? 0 })
      } else {
        clearSvg()
      }
      return hall
    },
    enabled: !!activeHallId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useDeleteHallMutation = () => {
  const queryClient = useQueryClient()
  const removeHall = useHallStore(s => s.removeHall)

  return useMutation({
    mutationFn: (hallId) => deleteHall(hallId),
    onSuccess: (_, hallId) => {
      removeHall(hallId)
      queryClient.invalidateQueries({ queryKey: ['halls'] })
    },
  })
}
