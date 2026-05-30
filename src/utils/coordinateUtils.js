export const svgToScreen = (svgX, svgY, { scale, offsetX, offsetY }) => ({
  x: svgX * scale + offsetX,
  y: svgY * scale + offsetY,
})

export const screenToSvg = (screenX, screenY, { scale, offsetX, offsetY }) => ({
  x: (screenX - offsetX) / scale,
  y: (screenY - offsetY) / scale,
})

export const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

// Snaps a value to the nearest grid point — useful for Phase 3 booth placement
export const snapToGrid = (value, gridSize) =>
  Math.round(value / gridSize) * gridSize

export const getBoundingBox = (points) => {
  if (!points || points.length === 0) return { x: 0, y: 0, width: 0, height: 0 }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  points.forEach(({ x, y }) => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  })

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}
