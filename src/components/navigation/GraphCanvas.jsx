import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useHallStore from '../../store/hallStore'
import useNavigationStore from '../../store/navigationStore'
import useKonvaZoomPan from '../../hooks/useKonvaZoomPan'
import useSvgBackground from '../../hooks/useSvgBackground'
import useGraphEditing from '../../hooks/useGraphEditing'
import GraphLayer from './GraphLayer'
import BoothReferenceLayer from './BoothReferenceLayer'
import GraphToolbar from './GraphToolbar'
import EmptyState from '../common/EmptyState'

const CURSOR_MAP = {
  SELECT: 'default',
  ADD_NODE: 'crosshair',
  CONNECT: 'cell',
  DELETE: 'not-allowed',
}

export default function GraphCanvas({
  editorMode,
  onEditorModeChange,
  highlightedRoute,
  pendingNodeType,
  onPendingNodeTypeChange,
}) {
  const svgContent = useHallStore(s => s.svgContent)
  const svgDimensions = useHallStore(s => s.svgDimensions)
  const activeGraphHallId = useNavigationStore(s => s.activeGraphHallId)
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const edgesMap = useNavigationStore(s => s.edgesMap)

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

  const {
    connectSourceId,
    handleStageClick,
    handleNodeClick,
    handleEdgeClick,
    handleNodeDragEnd,
  } = useGraphEditing({
    editorMode,
    activeGraphHallId,
    stageRef,
    stageScale,
    stagePos,
    pendingNodeType,
  })

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

  const nodeCount = Object.keys(nodesMap).length
  const edgeCount = Object.keys(edgesMap).length

  if (!svgContent) {
    return (
      <div className="flex flex-col h-full">
        <GraphToolbar
          editorMode={editorMode}
          onEditorModeChange={onEditorModeChange}
          pendingNodeType={pendingNodeType}
          onPendingNodeTypeChange={onPendingNodeTypeChange}
          connectSourceId={connectSourceId}
          stageScale={stageScale}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetView={resetView}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
        />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <EmptyState
            title="No Floor Plan"
            description="Upload an SVG floor plan in Hall Upload to start building the navigation graph."
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <GraphToolbar
        editorMode={editorMode}
        onEditorModeChange={onEditorModeChange}
        pendingNodeType={pendingNodeType}
        onPendingNodeTypeChange={onPendingNodeTypeChange}
        connectSourceId={connectSourceId}
        stageScale={stageScale}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetView={resetView}
        nodeCount={nodeCount}
        edgeCount={edgeCount}
      />

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-slate-100 relative"
        style={{ cursor: CURSOR_MAP[editorMode] ?? 'default' }}
      >
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
          draggable={editorMode === 'SELECT'}
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

          <BoothReferenceLayer />

          <GraphLayer
            editorMode={editorMode}
            highlightedRoute={highlightedRoute}
            connectSourceId={connectSourceId}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onNodeDragEnd={handleNodeDragEnd}
          />
        </Stage>
      </div>
    </div>
  )
}
