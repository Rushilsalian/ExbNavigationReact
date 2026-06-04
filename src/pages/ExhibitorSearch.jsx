import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchExhibitors } from '../services/exhibitorService'
import useHallStore from '../store/hallStore'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'

function ExhibitorSearch() {
  const storedExhibitionId = useHallStore(s => s.exhibitionId)
  const halls = useHallStore(s => s.halls)

  const [exhibitionInput, setExhibitionInput] = useState(String(storedExhibitionId))
  const [exhibitionId, setExhibitionId] = useState(storedExhibitionId)
  const [hallId, setHallId] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data: exhibitors = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['exhibitors', exhibitionId, hallId || null, search || null],
    queryFn: () => fetchExhibitors({
      exhibitionId,
      hallId: hallId ? parseInt(hallId) : undefined,
      search: search || undefined,
    }),
    enabled: !!exhibitionId,
  })

  const handleSearch = () => {
    const parsed = parseInt(exhibitionInput)
    if (!isNaN(parsed) && parsed > 0) setExhibitionId(parsed)
    setSearch(searchInput)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Exhibitor Search</h2>
        <p className="text-sm text-slate-500 mt-1">Search and browse exhibitors across all halls.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Filters</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="Exhibition ID"
            type="number"
            placeholder="e.g. 1"
            value={exhibitionInput}
            onChange={e => setExhibitionInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-36"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-600">Hall</label>
            <select
              value={hallId}
              onChange={e => setHallId(e.target.value)}
              className="h-9 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All halls</option>
              {halls.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Search by name"
            placeholder="Exhibitor name…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-56"
          />

          <Button variant="primary" size="md" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Results</h3>
          {!isLoading && !isError && (
            <span className="text-xs text-slate-400">{exhibitors.length} exhibitor{exhibitors.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader size="sm" label="Loading exhibitors…" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-red-600">{error?.message ?? 'Failed to load exhibitors.'}</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
          </div>
        ) : exhibitors.length === 0 ? (
          <div className="p-10 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <p className="text-sm text-slate-400">No exhibitors found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Exhibitor</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Booth</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Hall</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exhibitors.map(ex => (
                  <tr key={ex.boothId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-slate-800">
                        {ex.exhibitorName ?? <span className="text-slate-400 italic">—</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                        {ex.boothNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{ex.hallName}</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {ex.exhibitorInfo ?? <span className="italic text-slate-300">No info</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExhibitorSearch
