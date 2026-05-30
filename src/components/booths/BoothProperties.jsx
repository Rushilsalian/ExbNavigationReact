import useBoothStore from '../../store/boothStore'
import useBoothSelection from '../../hooks/useBoothSelection'
import Input from '../common/Input'
import Button from '../common/Button'

function BoothProperties() {
  const isEditing = useBoothStore(s => s.isEditing)
  const editDraft = useBoothStore(s => s.editDraft)
  const startEdit = useBoothStore(s => s.startEdit)
  const cancelEdit = useBoothStore(s => s.cancelEdit)
  const commitEdit = useBoothStore(s => s.commitEdit)
  const updateEditDraft = useBoothStore(s => s.updateEditDraft)
  const removeBooth = useBoothStore(s => s.removeBooth)

  const { selectedBooth, deselectBooth } = useBoothSelection()

  if (!selectedBooth) return null

  const handleDelete = () => {
    removeBooth(selectedBooth.id)
    deselectBooth()
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
          <div className="flex gap-2 pt-2">
            <Button variant="primary" size="sm" className="flex-1" onClick={commitEdit}>Save</Button>
            <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {[
            { label: 'Name', value: displayBooth?.name },
            { label: 'Number', value: displayBooth?.number },
            { label: 'Category', value: displayBooth?.category },
            { label: 'Position', value: `(${displayBooth?.x ?? 0}, ${displayBooth?.y ?? 0})` },
            { label: 'Size', value: `${displayBooth?.width ?? 0} × ${displayBooth?.height ?? 0}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="text-sm text-slate-800 mt-0.5">{value}</p>
            </div>
          ))}

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <Button variant="secondary" size="sm" className="flex-1" onClick={startEdit}>Edit</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BoothProperties
