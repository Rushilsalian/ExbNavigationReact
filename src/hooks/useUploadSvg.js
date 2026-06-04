import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadHallWithSvg } from '../services/hallService'
import useHallStore from '../store/hallStore'

const useUploadSvg = () => {
  const setUploadProgress = useHallStore(s => s.setUploadProgress)
  const setIsUploading = useHallStore(s => s.setIsUploading)
  const exhibitionId = useHallStore(s => s.exhibitionId)
  const addHall = useHallStore(s => s.addHall)
  const setActiveHall = useHallStore(s => s.setActiveHall)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ file, hallName }) => {
      const onUploadProgress = (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          setUploadProgress(pct)
        }
      }
      return uploadHallWithSvg(exhibitionId, hallName, file, onUploadProgress)
    },
    onMutate: () => {
      setIsUploading(true)
      setUploadProgress(0)
    },
    onSuccess: (data) => {
      // data = { hall, boothsExtracted, boothsSample }
      addHall(data.hall)
      setActiveHall(data.hall.id)
      queryClient.invalidateQueries({ queryKey: ['halls'] })
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  const upload = (file, hallName) => mutation.mutate({ file, hallName })

  return {
    upload,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  }
}

export default useUploadSvg
