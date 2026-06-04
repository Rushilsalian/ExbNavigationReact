import { useState } from 'react'
import { useCreateBoothMutation } from '../../hooks/useBooths'
import useHallStore from '../../store/hallStore'
import Input from '../common/Input'
import Button from '../common/Button'

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
  const [apiError, setApiError] = useState(null)

  const activeHallId = useHallStore(s => s.activeHallId)
  const createBoothMutation = useCreateBoothMutation()

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Booth name is required.'
    if (!number.trim()) e.number = 'Booth number is required.'
    if (!activeHallId) e.hall = 'Select a hall first.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setApiError(null)

    try {
      await createBoothMutation.mutateAsync({
        name: name.trim(),
        number: number.trim(),
        category,
        shapeType,
        x: 100,
        y: 100,
        width: 80,
        height: 60,
        rotation: 0,
      })
      setName('')
      setNumber('')
      setCategory('General')
      setShapeType('rect')
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pb-3 border-b border-slate-200">
      {errors.hall && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">{errors.hall}</p>
      )}
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
      {apiError && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="w-full"
        loading={createBoothMutation.isPending}
        disabled={!activeHallId}
      >
        Add Booth
      </Button>
    </form>
  )
}

export default BoothEditor
