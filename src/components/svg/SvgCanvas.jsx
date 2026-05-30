import useHallStore from '../../store/hallStore'
import useZoomPan from '../../hooks/useZoomPan'
import SvgPreview from './SvgPreview'
import SvgToolbar from './SvgToolbar'
import EmptyState from '../common/EmptyState'

function SvgCanvas() {
  const svgContent = useHallStore(s => s.svgContent)
  // Shared zoom state passed to both toolbar and preview so controls are in sync
  const zoomPan = useZoomPan(1)

  return (
    <div className="flex flex-col h-full">
      {svgContent ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200">
            <SvgToolbar zoomPan={zoomPan} />
            <span className="ml-auto text-xs text-slate-400">
              React-Konva overlay connects in Phase 3
            </span>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <SvgPreview svgContent={svgContent} zoomPan={zoomPan} />
          </div>
        </>
      ) : (
        <EmptyState
          title="No Floor Plan Loaded"
          description="Upload an SVG floor plan from the Hall Upload page first."
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      )}
    </div>
  )
}

export default SvgCanvas
