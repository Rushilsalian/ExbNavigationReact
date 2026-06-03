import Button from '../common/Button'

export default function KonvaToolbar({ stageScale, zoomIn, zoomOut, resetView }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white shrink-0">
      <Button variant="secondary" size="sm" onClick={zoomOut}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </Button>

      <span className="text-xs text-slate-600 w-12 text-center font-mono">
        {Math.round(stageScale * 100)}%
      </span>

      <Button variant="secondary" size="sm" onClick={zoomIn}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Button>

      <Button variant="ghost" size="sm" onClick={resetView}>
        Reset View
      </Button>

      <span className="ml-auto text-xs text-slate-400 select-none">
        Drag to pan · Scroll to zoom · +/- keys
      </span>
    </div>
  )
}
