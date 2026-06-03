import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useHallStore from '../../store/hallStore'
import useBoothStore from '../../store/boothStore'
import useKonvaZoomPan from '../../hooks/useKonvaZoomPan'
import useSvgBackground from '../../hooks/useSvgBackground'
import BoothLayer from './BoothLayer'
import KonvaToolbar from './KonvaToolbar'
import EmptyState from '../common/EmptyState'

export default function BoothCanvas() {
  const svgContent = useHallStore(s => s.svgContent)
  const svgDimensions = useHallStore(s => s.svgDimensions)
  const deselectBooth = useBoothStore(s => s.deselectBooth)

  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })

  const { bgImage, isLoading } = useSvgBackground(svgContent, svgDimensions)

  const {
    stageScale, stagePos,
    handleWheel, handleStageDragEnd,
    handleTouchMove, handleTouchEnd,
    zoomIn, zoomOut, resetView,
  } = useKonvaZoomPan(stageRef)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!svgContent) {
    return (
      <div className="flex flex-col h-full">
        <KonvaToolbar stageScale={stageScale} zoomIn={zoomIn} zoomOut={zoomOut} resetView={resetView} />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <EmptyState
            title="No Floor Plan"
            description="Upload an SVG floor plan in Hall Upload to start mapping booths."
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
            }
          />
        </div>
      </div>
    )
  }

  const handleStageClick = (e) => {
    if (e.target === stageRef.current) deselectBooth()
  }

  return (
    <div className="flex flex-col h-full">
      <KonvaToolbar stageScale={stageScale} zoomIn={zoomIn} zoomOut={zoomOut} resetView={resetView} />
      <div ref={containerRef} className="flex-1 overflow-hidden bg-slate-100 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-xs text-slate-400">Loading floor plan…</span>
          </div>
        )}
        <Stage
          ref={stageRef}
          width={containerSize.width}
          height={containerSize.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={handleStageDragEnd}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer listening={false}>
            {bgImage && (
              <KonvaImage
                image={bgImage}
                width={svgDimensions.width || bgImage.naturalWidth}
                height={svgDimensions.height || bgImage.naturalHeight}
              />
            )}
          </Layer>

          <BoothLayer
            stageScale={stageScale}
            stagePos={stagePos}
            containerSize={containerSize}
          />
        </Stage>
      </div>
    </div>
  )
}
