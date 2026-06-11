import { useState } from 'react'
import useNavigationStore, { NODE_TYPES } from '../../store/navigationStore'
import useHallStore from '../../store/hallStore'
import useBoothStore from '../../store/boothStore'
import { createNode, batchCreateNodes } from '../../services/navigationService'
import Input from '../common/Input'
import Button from '../common/Button'

const SNAP_THRESHOLD = 25

function NodeEditor({ editorMode, onEditorModeChange, pendingNodeType, onPendingNodeTypeChange }) {
  const [label, setLabel] = useState('')
  const type = pendingNodeType ?? NODE_TYPES.WALKWAY
  const setType = (val) => onPendingNodeTypeChange?.(val)
  const [x, setX] = useState('0')
  const [y, setY] = useState('0')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [showManual, setShowManual] = useState(false)
  const [autoState, setAutoState] = useState('idle') // idle | loading | done | error
  const [autoCount, setAutoCount] = useState(0)

  const addNode = useNavigationStore(s => s.addNode)
  const selectNode = useNavigationStore(s => s.selectNode)
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const activeHallId = useHallStore(s => s.activeHallId)
  const boothsMap = useBoothStore(s => s.boothsMap)

  const isAddNodeMode = editorMode === 'ADD_NODE'
  const existingNodes = Object.values(nodesMap)

  const handleAutoGenerate = async () => {
    const booths = Object.values(boothsMap)
    if (booths.length === 0) return

    const toCreate = booths
      .map(b => ({
        label: b.name || b.number || `Booth ${b.id}`,
        x: Math.round(b.x + (b.width ?? 0) / 2),
        y: Math.round(b.y + (b.height ?? 0) / 2),
        nodeType: 'WALKWAY',
      }))
      .filter(({ x, y }) =>
        !existingNodes.some(n => Math.hypot(n.x - x, n.y - y) < SNAP_THRESHOLD)
      )

    if (toCreate.length === 0) {
      setAutoState('done')
      setAutoCount(0)
      setTimeout(() => setAutoState('idle'), 2500)
      return
    }

    setAutoState('loading')
    try {
      const created = await batchCreateNodes({ hallId: activeHallId, nodes: toCreate })
      created.forEach(n => addNode({ ...n, nodeType: n.nodeType?.toLowerCase() ?? 'walkway' }))
      setAutoCount(created.length)
      setAutoState('done')
      setTimeout(() => setAutoState('idle'), 3000)
    } catch {
      setAutoState('error')
      setTimeout(() => setAutoState('idle'), 2500)
    }
  }

  const validate = () => {
    const e = {}
    if (!label.trim()) e.label = 'Node label is required.'
    if (isNaN(Number(x))) e.x = 'Must be a number.'
    if (isNaN(Number(y))) e.y = 'Must be a number.'
    if (!activeHallId) e.hall = 'Select a hall first.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setApiError(null)
    setLoading(true)
    try {
      const node = await createNode({
        hallId: activeHallId,
        label: label.trim(),
        x: Number(x),
        y: Number(y),
        nodeType: type.toUpperCase(),
      })
      addNode({ ...node, nodeType: node.nodeType?.toLowerCase() ?? type })
      selectNode(node.id)
      setLabel('')
      setX('0')
      setY('0')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const boothCount = Object.keys(boothsMap).length

  return (
    <div className="space-y-3">
      {/* Auto-generate */}
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="w-full"
        onClick={handleAutoGenerate}
        disabled={autoState === 'loading' || boothCount === 0 || !activeHallId}
      >
        {autoState === 'loading' ? 'Generating…'
          : autoState === 'done' ? (autoCount > 0 ? `Added ${autoCount} nodes` : 'Already up to date')
          : autoState === 'error' ? 'Error — retry?'
          : `Auto Generate from Booths${boothCount ? ` (${boothCount})` : ''}`}
      </Button>

      {/* Place on canvas */}
      {isAddNodeMode ? (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
          <span className="text-xs text-indigo-700 font-medium">Click canvas to place node</span>
          <button
            type="button"
            onClick={() => onEditorModeChange('SELECT')}
            className="text-xs text-indigo-500 hover:text-indigo-700 underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => onEditorModeChange('ADD_NODE')}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          }
        >
          Place on Canvas
        </Button>
      )}

      {/* Manual form (collapsible) */}
      <button
        type="button"
        onClick={() => setShowManual(v => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 w-full"
      >
        <svg
          className={`w-3 h-3 transition-transform ${showManual ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Add manually
      </button>

      {showManual && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {errors.hall && (
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{errors.hall}</p>
          )}
          <Input
            label="Label"
            placeholder="e.g. Entrance A"
            value={label}
            onChange={e => setLabel(e.target.value)}
            error={errors.label}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Object.entries(NODE_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="X" type="number" value={x} onChange={e => setX(e.target.value)} error={errors.x} />
            <Input label="Y" type="number" value={y} onChange={e => setY(e.target.value)} error={errors.y} />
          </div>
          {apiError && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
          )}
          <Button type="submit" variant="primary" size="sm" className="w-full" disabled={loading}>
            {loading ? 'Saving…' : 'Add Node'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default NodeEditor
