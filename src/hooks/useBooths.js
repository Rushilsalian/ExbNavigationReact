import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBooths, createBooth, updateBooth, deleteBooth } from '../services/boothService'
import useBoothStore from '../store/boothStore'
import useHallStore from '../store/hallStore'

export const useBoothsQuery = () => {
  const activeHallId = useHallStore(s => s.activeHallId)
  const setBooths = useBoothStore(s => s.setBooths)
  const clearBooths = useBoothStore(s => s.clearBooths)

  const query = useQuery({
    queryKey: ['booths', activeHallId],
    queryFn: () => fetchBooths(activeHallId),
    enabled: !!activeHallId,
    staleTime: 30_000,
  })

  // Sync store whenever data changes — covers both fresh fetches AND cached returns.
  // Without this, switching halls re-uses cached data without calling queryFn,
  // leaving the store stuck on the previous hall's booths.
  useEffect(() => {
    if (query.data) {
      setBooths(query.data)
    }
  }, [query.data]) // eslint-disable-line react-hooks/exhaustive-deps

  // Clear store immediately when hall changes so stale booths don't flash.
  useEffect(() => {
    if (!activeHallId) clearBooths()
  }, [activeHallId]) // eslint-disable-line react-hooks/exhaustive-deps

  return query
}

export const useCreateBoothMutation = () => {
  const queryClient = useQueryClient()
  const addBooth = useBoothStore(s => s.addBooth)
  const activeHallId = useHallStore(s => s.activeHallId)

  return useMutation({
    mutationFn: (booth) => createBooth(activeHallId, booth),
    onSuccess: (savedBooth) => {
      addBooth(savedBooth)
      queryClient.invalidateQueries({ queryKey: ['booths', activeHallId] })
    },
  })
}

export const useUpdateBoothMutation = () => {
  const queryClient = useQueryClient()
  const updateBoothStore = useBoothStore(s => s.updateBooth)
  const activeHallId = useHallStore(s => s.activeHallId)

  return useMutation({
    mutationFn: ({ boothId, updates }) => updateBooth(boothId, updates),
    onSuccess: (savedBooth) => {
      updateBoothStore(savedBooth.id, savedBooth)
      queryClient.invalidateQueries({ queryKey: ['booths', activeHallId] })
    },
  })
}

export const useDeleteBoothMutation = () => {
  const queryClient = useQueryClient()
  const removeBooth = useBoothStore(s => s.removeBooth)
  const deselectBooth = useBoothStore(s => s.deselectBooth)
  const activeHallId = useHallStore(s => s.activeHallId)

  return useMutation({
    mutationFn: (boothId) => deleteBooth(boothId),
    onSuccess: (_, boothId) => {
      removeBooth(boothId)
      deselectBooth()
      queryClient.invalidateQueries({ queryKey: ['booths', activeHallId] })
    },
  })
}
