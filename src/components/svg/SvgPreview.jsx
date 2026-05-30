import { useRef, useEffect } from 'react'
import useZoomPan from '../../hooks/useZoomPan'

/**
 * Renders the SVG with mouse-driven pan, wheel zoom, touch pan, and keyboard shortcuts.
 * Accepts an optional zoomPan object from a parent so toolbar and canvas share the same
 * state. Falls back to an internal instance if not provided.
 *
 * Touch pan uses a native non-passive listener so e.preventDefault() actually blocks
 * page scroll — React's synthetic onTouchMove is passive and cannot do this.
 */
function SvgPreview({ svgContent, zoomPan }) {
  const internal = useZoomPan(1)
  const {
    scale, offsetX, offsetY,
    handleWheel, handleMouseDown, handleMouseMove, handleMouseUp,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = zoomPan ?? internal

  const containerRef = useRef(null)

  // Attach touchmove as non-passive so preventDefault() blocks page scroll during pan
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [handleTouchMove])

  if (!svgContent) return null

  return (
    <div
      ref={containerRef}
      className="canvas-container rounded-lg border border-slate-200 bg-slate-100 overflow-hidden select-none h-64 sm:h-96 md:h-[480px]"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  )
}

export default SvgPreview
