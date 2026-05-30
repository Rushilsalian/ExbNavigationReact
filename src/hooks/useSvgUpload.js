import { useState, useCallback } from 'react'
import useHallStore from '../store/hallStore'
import { isSvgFile, readFileAsText, extractSvgDimensions, sanitizeSvg } from '../utils/svgHelpers'

const useSvgUpload = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  // Tracks selected file's name and size for display in the UI
  const [fileInfo, setFileInfo] = useState(null)

  const setSvgContent = useHallStore(s => s.setSvgContent)
  const setSvgDimensions = useHallStore(s => s.setSvgDimensions)
  const clearSvgStore = useHallStore(s => s.clearSvg)

  const processFile = useCallback(async (file) => {
    setError(null)

    if (!isSvgFile(file)) {
      setError('Please upload a valid SVG file.')
      return
    }

    // Store file metadata before the async read so it's available immediately
    setFileInfo({ name: file.name, size: file.size })

    try {
      const raw = await readFileAsText(file)
      const clean = sanitizeSvg(raw)
      const dimensions = extractSvgDimensions(clean)
      setSvgContent(clean)
      setSvgDimensions(dimensions)
    } catch {
      setFileInfo(null)
      setError('Failed to process the SVG file.')
    }
  }, [setSvgContent, setSvgDimensions])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  // Wraps the Zustand clearSvg so local state (fileInfo, error) is also reset
  const clearSvg = useCallback(() => {
    clearSvgStore()
    setFileInfo(null)
    setError(null)
  }, [clearSvgStore])

  return {
    isDragging,
    error,
    fileInfo,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    clearSvg,
  }
}

export default useSvgUpload
