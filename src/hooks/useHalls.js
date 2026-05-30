import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchHalls, createHall, deleteHall } from '../services/hallService'
import useHallStore from '../store/hallStore'

// Fetches halls from the API and syncs them into the Zustand hall store.
export const useHallsQuery = () => {
  const setHalls = useHallStore(s => s.setHalls)

  return useQuery({
    queryKey: ['halls'],
    queryFn: async () => {
      const data = await fetchHalls()
      setHalls(data)
      return data
    },
  })
}

// Mutation to create a new hall via API, then syncs the result into the store.
export const useCreateHallMutation = () => {
  const queryClient = useQueryClient()
  const addHall = useHallStore(s => s.addHall)
  const setActiveHall = useHallStore(s => s.setActiveHall)

  return useMutation({
    mutationFn: (payload) => createHall(payload),
    onSuccess: (data) => {
      addHall(data)
      setActiveHall(data.id)
      queryClient.invalidateQueries({ queryKey: ['halls'] })
    },
  })
}

// Mutation to delete a hall via API, then removes it from the store.
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
