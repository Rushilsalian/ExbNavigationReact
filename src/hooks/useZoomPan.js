import { useState, useCallback, useRef, useEffect } from 'react'
import { clampValue } from '../utils/coordinateUtils'

const MIN_SCALE = 0.2
const MAX_SCALE = 5
const ZOOM_STEP = 0.1

const useZoomPan = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchPos = useRef({ x: 0, y: 0 })

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setScale(prev => clampValue(prev + delta, MIN_SCALE, MAX_SCALE))
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffsetX(prev => prev + dx)
    setOffsetY(prev => prev + dy)
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const resetView = useCallback(() => {
    setScale(initialScale)
    setOffsetX(0)
    setOffsetY(0)
  }, [initialScale])

  const zoomIn = useCallback(() => {
    setScale(prev => clampValue(prev + ZOOM_STEP, MIN_SCALE, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setScale(prev => clampValue(prev - ZOOM_STEP, MIN_SCALE, MAX_SCALE))
  }, [])

  // Touch handlers for single-finger pan (multi-touch ignored to avoid pinch conflicts)
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return
    lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  // Note: e.preventDefault() here requires a non-passive listener — SvgPreview attaches
  // this handler natively with { passive: false } instead of using the onTouchMove prop.
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return
    e.preventDefault()
    const dx = e.touches[0].clientX - lastTouchPos.current.x
    const dy = e.touches[0].clientY - lastTouchPos.current.y
    lastTouchPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setOffsetX(prev => prev + dx)
    setOffsetY(prev => prev + dy)
  }, [])

  const handleTouchEnd = useCallback(() => {}, [])

  // Keyboard shortcuts: +/= zoom in, - zoom out, 0 reset. Guards against input fields.
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn() }
      else if (e.key === '-')             { e.preventDefault(); zoomOut() }
      else if (e.key === '0')             { e.preventDefault(); resetView() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [zoomIn, zoomOut, resetView])

  return {
    scale,
    offsetX,
    offsetY,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetView,
    zoomIn,
    zoomOut,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}

export default useZoomPan
