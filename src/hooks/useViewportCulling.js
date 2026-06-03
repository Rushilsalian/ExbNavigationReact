import { useMemo } from 'react'
import { getBoundingBox } from '../utils/coordinateUtils'

function getBoothAABB(booth) {
  if (!booth.rotation) {
    return { x: booth.x, y: booth.y, width: booth.width, height: booth.height }
  }
  // For rotated booths, compute axis-aligned bounding box from rotated corners
  const cx = booth.x + booth.width / 2
  const cy = booth.y + booth.height / 2
  const rad = (booth.rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const hw = booth.width / 2
  const hh = booth.height / 2
  const corners = [
    { x: cx + (-hw) * cos - (-hh) * sin, y: cy + (-hw) * sin + (-hh) * cos },
    { x: cx + hw * cos - (-hh) * sin,     y: cy + hw * sin + (-hh) * cos },
    { x: cx + hw * cos - hh * sin,         y: cy + hw * sin + hh * cos },
    { x: cx + (-hw) * cos - hh * sin,      y: cy + (-hw) * sin + hh * cos },
  ]
  const bb = getBoundingBox(corners)
  return bb
}

function intersects(aabb, rect) {
  return (
    aabb.x < rect.x + rect.width &&
    aabb.x + aabb.width > rect.x &&
    aabb.y < rect.y + rect.height &&
    aabb.y + aabb.height > rect.y
  )
}

export default function useViewportCulling(booths, stageScale, stagePos, containerSize, selectedBoothId) {
  return useMemo(() => {
    if (!booths.length) return []

    const visibleRect = {
      x: -stagePos.x / stageScale,
      y: -stagePos.y / stageScale,
      width: containerSize.width / stageScale,
      height: containerSize.height / stageScale,
    }

    return booths.filter(booth => {
      if (booth.id === selectedBoothId) return true
      const aabb = getBoothAABB(booth)
      return intersects(aabb, visibleRect)
    })
  }, [booths, stageScale, stagePos, containerSize, selectedBoothId])
}
