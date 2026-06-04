import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchExhibitions, createExhibition } from '../services/exhibitionService'
import useHallStore from '../store/hallStore'

export const useExhibitionsQuery = () =>
  useQuery({
    queryKey: ['exhibitions'],
    queryFn: fetchExhibitions,
    staleTime: 60_000,
  })

export const useCreateExhibitionMutation = () => {
  const queryClient = useQueryClient()
  const setExhibitionId = useHallStore(s => s.setExhibitionId)

  return useMutation({
    mutationFn: createExhibition,
    onSuccess: (exhibition) => {
      queryClient.invalidateQueries({ queryKey: ['exhibitions'] })
      setExhibitionId(exhibition.id)
    },
  })
}
