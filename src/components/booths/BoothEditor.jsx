import { useState } from 'react'
import useBoothStore from '../../store/boothStore'
import useHallStore from '../../store/hallStore'
import Input from '../common/Input'
import Button from '../common/Button'
import { generateId } from '../../utils/graphHelpers'

const CATEGORIES = ['General', 'Food & Beverage', 'Technology', 'Fashion', 'Art', 'Services', 'Other']
const SHAPE_TYPES = [
  { value: 'rect', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'polygon', label: 'Hexagon' },
]

function BoothEditor() {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [category, setCategory] = useState('General')
  const [shapeType, setShapeType] = useState('rect')
  const [errors, setErrors] = useState({})

  const addBooth = useBoothStore(s => s.addBooth)
  const activeHallId = useHallStore(s => s.activeHallId)

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Booth name is required.'
    if (!number.trim()) e.number = 'Booth number is required.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})

    addBooth({
      id: generateId('booth'),
      hallId: activeHallId,
      name: name.trim(),
      number: number.trim(),
      category,
      shapeType,
      x: 100, y: 100, width: 80, height: 60,
      rotation: 0,
      createdAt: new Date().toISOString(),
    })

    setName('')
    setNumber('')
    setCategory('General')
    setShapeType('rect')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pb-3 border-b border-slate-200">
      <Input
        label="Booth Name"
        placeholder="e.g. Tech Innovations"
        value={name}
        onChange={e => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Booth Number"
        placeholder="e.g. A-101"
        value={number}
        onChange={e => setNumber(e.target.value)}
        error={errors.number}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Shape</label>
        <select
          value={shapeType}
          onChange={e => setShapeType(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {SHAPE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <Button type="submit" variant="primary" size="sm" className="w-full">
        Add Booth
      </Button>
    </form>
  )
}

export default BoothEditor
