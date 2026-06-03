import { useState } from 'react'
import useNavigationStore from '../../store/navigationStore'
import { createEdge } from '../../services/navigationService'
import Input from '../common/Input'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'

function EdgeEditor() {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [weight, setWeight] = useState('')
  const [bidirectional, setBidirectional] = useState(true)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const addEdge = useNavigationStore(s => s.addEdge)
  const getAllNodes = useNavigationStore(s => s.getAllNodes)

  const nodes = getAllNodes()

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

      // result.edges is an array of created edge(s)
      for (const edge of result.edges) {
        addEdge({
          id: edge.id,
          sourceId: edge.fromId,
          targetId: edge.toId,
          weight: edge.weight,
          directed: !bidirectional,
        })
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
    return (
      <EmptyState
        title="Add Nodes First"
        description="You need at least 2 nodes to create an edge."
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
  )
}

export default EdgeEditor
