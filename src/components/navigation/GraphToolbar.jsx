import { EDITOR_MODES } from '../../hooks/useGraphEditing'
import { NODE_TYPE_CONFIG } from '../../utils/nodeTypeConfig'
import Button from '../common/Button'

const MODE_ICONS = {
  [EDITOR_MODES.SELECT]: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  ),
  [EDITOR_MODES.ADD_NODE]: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  [EDITOR_MODES.CONNECT]: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  [EDITOR_MODES.DELETE]: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
}

const HINT_TEXT = {
  [EDITOR_MODES.SELECT]: 'Click to select · Drag nodes · Scroll to zoom',
  [EDITOR_MODES.ADD_NODE]: 'Click canvas to place node',
  [EDITOR_MODES.CONNECT]: null,
  [EDITOR_MODES.DELETE]: 'Click node or edge to delete',
}

export default function GraphToolbar({
  editorMode,
  onEditorModeChange,
  pendingNodeType,
  onPendingNodeTypeChange,
  connectSourceId,
  stageScale,
  zoomIn,
  zoomOut,
  resetView,
  nodeCount,
  edgeCount,
}) {
  const hint = editorMode === EDITOR_MODES.CONNECT
    ? connectSourceId ? 'Now click the target node' : 'Click source node on canvas'
    : HINT_TEXT[editorMode]

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white flex-wrap">
      {/* Mode buttons */}
      <div className="flex items-center gap-1">
        {Object.values(EDITOR_MODES).map(mode => (
          <Button
            key={mode}
            variant={editorMode === mode ? 'primary' : 'secondary'}
            size="sm"
            icon={MODE_ICONS[mode]}
            onClick={() => onEditorModeChange(mode)}
            title={mode.charAt(0) + mode.slice(1).toLowerCase().replace('_', ' ')}
          >
            {mode === EDITOR_MODES.SELECT ? 'Select'
              : mode === EDITOR_MODES.ADD_NODE ? 'Add Node'
              : mode === EDITOR_MODES.CONNECT ? 'Connect'
              : 'Delete'}
          </Button>
        ))}
      </div>

      {/* Node type picker (only in ADD_NODE mode) */}
      {editorMode === EDITOR_MODES.ADD_NODE && (
        <select
          value={pendingNodeType}
          onChange={e => onPendingNodeTypeChange(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Object.entries(NODE_TYPE_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      )}

      <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" onClick={zoomOut} title="Zoom out">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </Button>
        <span className="text-xs text-slate-500 w-10 text-center tabular-nums">
          {Math.round(stageScale * 100)}%
        </span>
        <Button variant="secondary" size="sm" onClick={zoomIn} title="Zoom in">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Button>
        <Button variant="secondary" size="sm" onClick={resetView} title="Reset view">
          Reset
        </Button>
      </div>

      <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

      {/* Counts */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span><strong className="text-slate-700">{nodeCount}</strong> nodes</span>
        <span><strong className="text-slate-700">{edgeCount}</strong> edges</span>
      </div>

      {/* Hint */}
      {hint && (
        <span className="ml-auto text-xs text-slate-400 hidden lg:block">{hint}</span>
      )}
    </div>
  )
}
