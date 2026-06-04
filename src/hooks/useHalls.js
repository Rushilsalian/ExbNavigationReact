import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHalls, deleteHall } from '../services/hallService'
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
