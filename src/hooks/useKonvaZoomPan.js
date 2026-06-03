import { useState, useEffect, useRef, useCallback } from 'react'

const MIN_SCALE = 0.1
const MAX_SCALE = 10
const ZOOM_FACTOR = 1.12

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export default function useKonvaZoomPan(stageRef) {
  const [stageScale, setStageScale] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const lastTouchDist = useRef(null)
  const lastTouchMidpoint = useRef(null)

  const zoomAt = useCallback((newScale, pointer, currentScale, currentPos) => {
    const clampedScale = clamp(newScale, MIN_SCALE, MAX_SCALE)
    const mousePointTo = {
      x: (pointer.x - currentPos.x) / currentScale,
      y: (pointer.y - currentPos.y) / currentScale,
    }
    setStageScale(clampedScale)
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }, [])

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault()
    const stage = stageRef.current
    if (!stage) return
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    const direction = e.evt.deltaY < 0 ? 1 : -1
    const newScale = direction > 0 ? oldScale * ZOOM_FACTOR : oldScale / ZOOM_FACTOR
    zoomAt(newScale, pointer, oldScale, { x: stage.x(), y: stage.y() })
  }, [stageRef, zoomAt])

  const handleStageDragEnd = useCallback((e) => {
    if (e.target === stageRef.current) {
      setStagePos({ x: e.target.x(), y: e.target.y() })
    }
  }, [stageRef])

  const handleTouchMove = useCallback((e) => {
    const touches = e.evt.touches
    if (touches.length !== 2) return
    e.evt.preventDefault()

    const t1 = touches[0]
    const t2 = touches[1]
    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
    const midpoint = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    }

    if (lastTouchDist.current === null) {
      lastTouchDist.current = dist
      lastTouchMidpoint.current = midpoint
      return
    }

    const stage = stageRef.current
    if (!stage) return
    const oldScale = stage.scaleX()
    const scaleBy = dist / lastTouchDist.current
    const newScale = oldScale * scaleBy
    zoomAt(newScale, midpoint, oldScale, { x: stage.x(), y: stage.y() })

    lastTouchDist.current = dist
    lastTouchMidpoint.current = midpoint
  }, [stageRef, zoomAt])

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = null
    lastTouchMidpoint.current = null
  }, [])

  const zoomIn = useCallback(() => {
    setStageScale(s => clamp(s * ZOOM_FACTOR, MIN_SCALE, MAX_SCALE))
  }, [])

  const zoomOut = useCallback(() => {
    setStageScale(s => clamp(s / ZOOM_FACTOR, MIN_SCALE, MAX_SCALE))
  }, [])

  const resetView = useCallback(() => {
    setStageScale(1)
    setStagePos({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-') zoomOut()
      else if (e.key === '0') resetView()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [zoomIn, zoomOut, resetView])

  return {
    stageScale,
    stagePos,
    MIN_SCALE,
    MAX_SCALE,
    handleWheel,
    handleStageDragEnd,
    handleTouchMove,
    handleTouchEnd,
    zoomIn,
    zoomOut,
    resetView,
  }
}
