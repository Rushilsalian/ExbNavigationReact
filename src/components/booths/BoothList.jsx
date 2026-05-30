import { useState } from 'react'
import useBoothStore from '../../store/boothStore'
import useBoothSelection from '../../hooks/useBoothSelection'
import EmptyState from '../common/EmptyState'

function BoothList() {
  const [search, setSearch] = useState('')
  const getAllBooths = useBoothStore(s => s.getAllBooths)
  const removeBooth = useBoothStore(s => s.removeBooth)
  const { selectedBoothId, selectBooth, deselectBooth, isSelected } = useBoothSelection()

  const booths = getAllBooths()
  const filtered = booths.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.number.toLowerCase().includes(search.toLowerCase())
  )

  if (booths.length === 0) {
    return (
      <EmptyState
        title="No Booths Yet"
        description="Add a booth using the form above."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2 overflow-hidden flex-1 min-h-0">
      <input
        type="search"
        placeholder="Search booths..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />

      <div className="overflow-y-auto space-y-1.5 custom-scrollbar flex-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No results for &ldquo;{search}&rdquo;</p>
        ) : (
          filtered.map(booth => (
            <div
              key={booth.id}
              onClick={() => isSelected(booth.id) ? deselectBooth() : selectBooth(booth.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                isSelected(booth.id)
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{booth.name}</p>
                <p className="text-xs text-slate-500">{booth.number} · {booth.category}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeBooth(booth.id) }}
                className="ml-2 shrink-0 text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BoothList
