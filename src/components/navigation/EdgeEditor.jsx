import { useState } from 'react'
import useNavigationStore from '../../store/navigationStore'
import { createEdge, batchCreateEdges } from '../../services/navigationService'
import { mstEdgePairs } from '../../utils/graphHelpers'
import Input from '../common/Input'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'

function EdgeEditor({ editorMode, onEditorModeChange }) {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [weight, setWeight] = useState('')
  const [bidirectional, setBidirectional] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [showManual, setShowManual] = useState(false)
  const [autoState, setAutoState] = useState('idle') // idle | loading | done | error
  const [autoCount, setAutoCount] = useState(0)

  const addEdge = useNavigationStore(s => s.addEdge)
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const edgesMap = useNavigationStore(s => s.edgesMap)
  const connectSource = useNavigationStore(s => s.connectSource)
  const getNodeById = useNavigationStore(s => s.getNodeById)

  const nodes = Object.values(nodesMap)
  const isConnectMode = editorMode === 'CONNECT'
  const sourceNode = connectSource ? getNodeById(connectSource) : null

  const handleAutoConnect = async () => {
    if (nodes.length < 2) return

    const existingEdgeSet = new Set(
      Object.values(edgesMap).map(e => `${Math.min(e.sourceId, e.targetId)}-${Math.max(e.sourceId, e.targetId)}`)
    )

    const pairs = mstEdgePairs(nodes, existingEdgeSet)
    if (pairs.length === 0) {
      setAutoState('done')
      setAutoCount(0)
      setTimeout(() => setAutoState('idle'), 2500)
      return
    }

    setAutoState('loading')
    try {
      const created = await batchCreateEdges({ pairs })
      // Each pair creates 2 DB edges (bidirectional); add all to store
      created.forEach(e => addEdge({
        id: e.id,
        sourceId: e.fromId,
        targetId: e.toId,
        weight: e.weight,
        directed: false,
      }))
      setAutoCount(pairs.length)
      setAutoState('done')
      setTimeout(() => setAutoState('idle'), 3000)
    } catch {
      setAutoState('error')
      setTimeout(() => setAutoState('idle'), 2500)
    }
  }

  const validate = () => {
    const e = {}
    if (!fromId) e.from = 'Select a source node.'
    if (!toId) e.to = 'Select a target node.'
    if (fromId && toId && fromId === toId) e.to = 'Source and target must differ.'
    if (weight !== '' && (isNaN(Number(weight)) || Number(weight) <= 0)) e.weight = 'Must be a positive number.'
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
      const result = await createEdge({
        fromId: Number(fromId),
        toId: Number(toId),
        weight: weight !== '' ? Number(weight) : undefined,
        bidirectional,
      })
      for (const edge of result.edges) {
        addEdge({ id: edge.id, sourceId: edge.fromId, targetId: edge.toId, weight: edge.weight, directed: !bidirectional })
      }
      setFromId('')
      setToId('')
      setWeight('')
      setBidirectional(true)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (nodes.length < 2) {
    return <EmptyState title="Add Nodes First" description="You need at least 2 nodes to create an edge." />
  }

  return (
    <div className="space-y-3">
      {/* Auto-connect */}
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="w-full"
        onClick={handleAutoConnect}
        disabled={autoState === 'loading' || nodes.length < 2}
      >
        {autoState === 'loading' ? 'Connecting…'
          : autoState === 'done' ? (autoCount > 0 ? `Connected ${autoCount} pairs` : 'Already connected')
          : autoState === 'error' ? 'Error — retry?'
          : 'Auto Connect Nodes (MST)'}
      </Button>

      {/* Canvas connect banner */}
      {isConnectMode ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-xs text-green-700 font-medium">
            {sourceNode ? `Source: ${sourceNode.label} — click target` : 'Click source node on canvas'}
          </span>
          <button
            type="button"
            onClick={() => onEditorModeChange('SELECT')}
            className="text-xs text-green-600 hover:text-green-800 underline"
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
          onClick={() => onEditorModeChange('CONNECT')}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        >
          Connect on Canvas
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">From Node</label>
            <select
              value={fromId}
              onChange={e => setFromId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select source…</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            {errors.from && <p className="text-xs text-red-600">{errors.from}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">To Node</label>
            <select
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select target…</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            {errors.to && <p className="text-xs text-red-600">{errors.to}</p>}
          </div>

          <Input
            label="Weight (optional)"
            type="number"
            min="0.1"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            error={errors.weight}
            hint="Leave blank to auto-calculate from coordinates"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={bidirectional}
              onChange={e => setBidirectional(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">Bidirectional (two-way)</span>
          </label>

          {apiError && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
          )}

          <Button type="submit" variant="primary" size="sm" className="w-full" disabled={loading}>
            {loading ? 'Saving…' : 'Add Edge'}
          </Button>
        </form>
      )}
    </div>
  )
}

export default EdgeEditor
