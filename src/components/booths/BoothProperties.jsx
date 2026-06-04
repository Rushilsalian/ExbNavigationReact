import { useState } from 'react'
import useBoothStore from '../../store/boothStore'
import useBoothSelection from '../../hooks/useBoothSelection'
import { useUpdateBoothMutation, useDeleteBoothMutation } from '../../hooks/useBooths'
import Input from '../common/Input'
import Button from '../common/Button'

const SHAPE_TYPES = [
  { value: 'rect', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'polygon', label: 'Hexagon' },
]

function PropRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm text-slate-800 mt-0.5">{value}</p>
    </div>
  )
}

function NumericInput({ label, field, value, onChange }) {
  return (
    <Input
      label={label}
      type="number"
      value={value ?? ''}
      onChange={e => onChange(field, parseFloat(e.target.value) || 0)}
    />
  )
}

function BoothProperties() {
  const [apiError, setApiError] = useState(null)

  const isEditing = useBoothStore(s => s.isEditing)
  const editDraft = useBoothStore(s => s.editDraft)
  const startEdit = useBoothStore(s => s.startEdit)
  const cancelEdit = useBoothStore(s => s.cancelEdit)
  const updateEditDraft = useBoothStore(s => s.updateEditDraft)

  const { selectedBooth, deselectBooth } = useBoothSelection()

  const updateMutation = useUpdateBoothMutation()
  const deleteMutation = useDeleteBoothMutation()

  if (!selectedBooth) return null

  const handleSave = async () => {
    if (!editDraft) return
    setApiError(null)
    try {
      await updateMutation.mutateAsync({ boothId: selectedBooth.id, updates: editDraft })
      cancelEdit()
    } catch (err) {
      setApiError(err.message)
    }
  }

  const handleDelete = async () => {
    setApiError(null)
    try {
      await deleteMutation.mutateAsync(selectedBooth.id)
    } catch (err) {
      setApiError(err.message)
    }
  }

  const displayBooth = isEditing ? editDraft : selectedBooth

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800">Booth Properties</h3>
        <button onClick={deselectBooth} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3 flex-1">
          <Input
            label="Name"
            value={editDraft?.name || ''}
            onChange={e => updateEditDraft('name', e.target.value)}
          />
          <Input
            label="Number"
            value={editDraft?.number || ''}
            onChange={e => updateEditDraft('number', e.target.value)}
          />
          <Input
            label="Category"
            value={editDraft?.category || ''}
            onChange={e => updateEditDraft('category', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <NumericInput label="X" field="x" value={editDraft?.x} onChange={updateEditDraft} />
            <NumericInput label="Y" field="y" value={editDraft?.y} onChange={updateEditDraft} />
            <NumericInput label="Width" field="width" value={editDraft?.width} onChange={updateEditDraft} />
            <NumericInput label="Height" field="height" value={editDraft?.height} onChange={updateEditDraft} />
          </div>

          <NumericInput label="Rotation (°)" field="rotation" value={editDraft?.rotation} onChange={updateEditDraft} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Shape</label>
            <select
              value={editDraft?.shapeType || 'rect'}
              onChange={e => updateEditDraft('shapeType', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {SHAPE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {apiError && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleSave}
              loading={updateMutation.isPending}
            >
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          <PropRow label="Name" value={displayBooth?.name} />
          <PropRow label="Number" value={displayBooth?.number} />
          <PropRow label="Category" value={displayBooth?.category} />

          <div className="grid grid-cols-2 gap-3">
            <PropRow label="X" value={displayBooth?.x ?? 0} />
            <PropRow label="Y" value={displayBooth?.y ?? 0} />
            <PropRow label="Width" value={displayBooth?.width ?? 0} />
            <PropRow label="Height" value={displayBooth?.height ?? 0} />
          </div>

          <PropRow label="Rotation" value={`${displayBooth?.rotation ?? 0}°`} />
          <PropRow label="Shape" value={SHAPE_TYPES.find(s => s.value === displayBooth?.shapeType)?.label ?? 'Rectangle'} />

          {apiError && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
          )}

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <Button variant="secondary" size="sm" className="flex-1" onClick={startEdit}>Edit</Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BoothProperties
