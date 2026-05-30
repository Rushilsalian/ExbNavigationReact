import useZoomPan from '../../hooks/useZoomPan'
import Button from '../common/Button'

/**
 * Zoom controls for the SVG canvas.
 * Accepts an optional zoomPan object so it shares state with SvgPreview.
 * Falls back to an internal instance when rendered standalone.
 */
function SvgToolbar({ zoomPan }) {
  const internal = useZoomPan(1)
  const { scale, zoomIn, zoomOut, resetView } = zoomPan ?? internal

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={zoomOut}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </Button>

      <span className="text-xs text-slate-600 w-12 text-center font-mono">
        {Math.round(scale * 100)}%
      </span>

      <Button variant="secondary" size="sm" onClick={zoomIn}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Button>

      <Button variant="ghost" size="sm" onClick={resetView}>
        Reset View
      </Button>
    </div>
  )
}

export default SvgToolbar
