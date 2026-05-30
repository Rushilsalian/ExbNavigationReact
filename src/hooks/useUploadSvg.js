import { useMutation } from '@tanstack/react-query'
import { uploadHallSvg } from '../services/hallService'
import useHallStore from '../store/hallStore'

/**
 * React Query mutation for uploading an SVG file to the backend.
 * Tracks upload progress via Zustand hallStore so any component can read it.
 *
 * @param {string} hallId - The hall to associate the SVG with
 * @returns {{ upload, isPending, isSuccess, error }}
 */
const useUploadSvg = (hallId) => {
  const setUploadProgress = useHallStore(s => s.setUploadProgress)
  const setIsUploading = useHallStore(s => s.setIsUploading)

  const mutation = useMutation({
    mutationFn: ({ file }) => {
      const formData = new FormData()
      formData.append('svg', file)

      // Axios onUploadProgress callback — updates Zustand store
      const onUploadProgress = (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          setUploadProgress(pct)
        }
      }

      return uploadHallSvg(hallId, formData, onUploadProgress)
    },
    onMutate: () => {
      setIsUploading(true)
      setUploadProgress(0)
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  // Convenience wrapper so callers just do upload(file)
  const upload = (file) => mutation.mutate({ file })

  return {
    upload,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  }
}

export default useUploadSvg
