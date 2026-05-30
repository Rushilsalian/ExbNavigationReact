import { useState } from 'react'
import useNavigationStore, { NODE_TYPES } from '../../store/navigationStore'
import useHallStore from '../../store/hallStore'
import Input from '../common/Input'
import Button from '../common/Button'
import { generateId } from '../../utils/graphHelpers'

function NodeEditor() {
  const [label, setLabel] = useState('')
  const [type, setType] = useState(NODE_TYPES.WALKWAY)
  const [x, setX] = useState('0')
  const [y, setY] = useState('0')
  const [errors, setErrors] = useState({})

  const addNode = useNavigationStore(s => s.addNode)
  const activeHallId = useHallStore(s => s.activeHallId)

  const validate = () => {
    const e = {}
    if (!label.trim()) e.label = 'Node label is required.'
    if (isNaN(Number(x))) e.x = 'Must be a number.'
    if (isNaN(Number(y))) e.y = 'Must be a number.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    addNode({
      id: generateId('node'),
      hallId: activeHallId,
      label: label.trim(),
      type,
      x: Number(x),
      y: Number(y),
      createdAt: new Date().toISOString(),
    })

    setLabel('')
    setX('0')
    setY('0')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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

      <Button type="submit" variant="primary" size="sm" className="w-full">
        Add Node
      </Button>
    </form>
  )
}

export default NodeEditor
