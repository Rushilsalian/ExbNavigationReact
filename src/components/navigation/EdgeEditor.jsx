import { useState } from 'react'
import useNavigationStore from '../../store/navigationStore'
import useHallStore from '../../store/hallStore'
import Input from '../common/Input'
import Button from '../common/Button'
import { generateId } from '../../utils/graphHelpers'
import EmptyState from '../common/EmptyState'

function EdgeEditor() {
  const [sourceId, setSourceId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [weight, setWeight] = useState('1')
  const [directed, setDirected] = useState(false)
  const [errors, setErrors] = useState({})

  const addEdge = useNavigationStore(s => s.addEdge)
  const getAllNodes = useNavigationStore(s => s.getAllNodes)
  const activeHallId = useHallStore(s => s.activeHallId)

  const nodes = getAllNodes()

  const validate = () => {
    const e = {}
    if (!sourceId) e.source = 'Select a source node.'
    if (!targetId) e.target = 'Select a target node.'
    if (sourceId === targetId && sourceId) e.target = 'Source and target must differ.'
    if (isNaN(Number(weight)) || Number(weight) <= 0) e.weight = 'Must be a positive number.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    addEdge({
      id: generateId('edge'),
      hallId: activeHallId,
      sourceId,
      targetId,
      weight: Number(weight),
      directed,
      createdAt: new Date().toISOString(),
    })

    setSourceId('')
    setTargetId('')
    setWeight('1')
    setDirected(false)
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
        <label className="text-sm font-medium text-slate-700">Source Node</label>
        <select
          value={sourceId}
          onChange={e => setSourceId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select source...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        {errors.source && <p className="text-xs text-red-600">{errors.source}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Target Node</label>
        <select
          value={targetId}
          onChange={e => setTargetId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select target...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        {errors.target && <p className="text-xs text-red-600">{errors.target}</p>}
      </div>

      <Input
        label="Weight"
        type="number"
        min="0.1"
        step="0.1"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        error={errors.weight}
        hint="Distance or traversal cost"
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={directed}
          onChange={e => setDirected(e.target.checked)}
          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-slate-700">Directed edge (one-way)</span>
      </label>

      <Button type="submit" variant="primary" size="sm" className="w-full">
        Add Edge
      </Button>
    </form>
  )
}

export default EdgeEditor
