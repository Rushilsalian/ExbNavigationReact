import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchKioskSync } from '../services/kioskSyncService'
import useHallStore from '../store/hallStore'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'

function StatPill({ label, value, color }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {value} {label}
    </span>
  )
}

function HallCard({ hall }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-800 text-sm">{hall.name}</span>
          <div className="flex gap-1.5 flex-wrap">
            <StatPill label="booths" value={hall.booths.length} color="bg-emerald-50 text-emerald-700" />
            <StatPill label="nodes" value={hall.navigationNodes.length} color="bg-amber-50 text-amber-700" />
            <StatPill label="edges" value={hall.navigationEdges.length} color="bg-rose-50 text-rose-700" />
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 py-3 space-y-3 bg-white">
          {hall.width && (
            <p className="text-xs text-slate-500">
              Dimensions: <strong className="text-slate-700">{hall.width} × {hall.height} px</strong>
            </p>
          )}

          {hall.booths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">Booths</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-1.5 pr-4 text-left text-slate-400 font-medium">Booth</th>
                      <th className="py-1.5 pr-4 text-left text-slate-400 font-medium">Exhibitor</th>
                      <th className="py-1.5 pr-4 text-left text-slate-400 font-medium">Shape</th>
                      <th className="py-1.5 text-left text-slate-400 font-medium">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {hall.booths.slice(0, 10).map(b => (
                      <tr key={b.id}>
                        <td className="py-1.5 pr-4 font-medium text-slate-700">{b.boothNumber}</td>
                        <td className="py-1.5 pr-4 text-slate-500">{b.exhibitorName ?? '—'}</td>
                        <td className="py-1.5 pr-4 text-slate-400">{b.shape}</td>
                        <td className="py-1.5 text-slate-400">{Math.round(b.x)}, {Math.round(b.y)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hall.booths.length > 10 && (
                  <p className="text-xs text-slate-400 mt-1">…and {hall.booths.length - 10} more</p>
                )}
              </div>
            </div>
          )}

          {hall.navigationNodes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">Navigation Nodes</p>
              <div className="flex flex-wrap gap-1.5">
                {hall.navigationNodes.map(n => (
                  <span key={n.id} className="inline-flex items-center rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                    {n.label ?? `Node ${n.id}`}
                    <span className="ml-1 text-amber-400">({n.nodeType})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KioskSync() {
  const storedExhibitionId = useHallStore(s => s.exhibitionId)

  const [exhibitionInput, setExhibitionInput] = useState(String(storedExhibitionId))
  const [lastSyncAtInput, setLastSyncAtInput] = useState('')
  const [params, setParams] = useState({ exhibitionId: storedExhibitionId, lastSyncAt: '' })
  const [triggered, setTriggered] = useState(false)

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['kiosk-sync', params.exhibitionId, params.lastSyncAt || null],
    queryFn: () => fetchKioskSync({
      exhibitionId: params.exhibitionId,
      lastSyncAt: params.lastSyncAt || undefined,
    }),
    enabled: triggered && !!params.exhibitionId,
  })

  const handleFetch = () => {
    const parsed = parseInt(exhibitionInput)
    if (isNaN(parsed) || parsed <= 0) return
    setParams({ exhibitionId: parsed, lastSyncAt: lastSyncAtInput })
    setTriggered(true)
  }

  const handleDownload = () => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kiosk-sync-exhibition-${params.exhibitionId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalBooths = data?.halls?.reduce((sum, h) => sum + h.booths.length, 0) ?? 0
  const totalNodes = data?.halls?.reduce((sum, h) => sum + h.navigationNodes.length, 0) ?? 0
  const totalEdges = data?.halls?.reduce((sum, h) => sum + h.navigationEdges.length, 0) ?? 0

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Kiosk Sync</h2>
        <p className="text-sm text-slate-500 mt-1">Download offline-ready data bundles for Flutter kiosk devices.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Sync Parameters</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="Exhibition ID"
            type="number"
            placeholder="e.g. 1"
            value={exhibitionInput}
            onChange={e => setExhibitionInput(e.target.value)}
            className="w-36"
          />
          <Input
            label="Last Sync At (optional)"
            type="datetime-local"
            value={lastSyncAtInput}
            onChange={e => setLastSyncAtInput(e.target.value)}
            className="w-56"
          />
          <Button variant="primary" size="md" onClick={handleFetch} loading={isLoading}>
            Fetch Sync Data
          </Button>
          {data && (
            <Button variant="secondary" size="md" onClick={handleDownload}>
              Download JSON
            </Button>
          )}
        </div>
        {lastSyncAtInput && (
          <p className="mt-2 text-xs text-slate-500">
            Delta sync — only data updated after <strong>{new Date(lastSyncAtInput).toLocaleString()}</strong>.
          </p>
        )}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-slate-200 p-10 flex justify-center">
          <Loader size="sm" label="Fetching sync data…" />
        </div>
      )}

      {isError && (
        <div className="bg-white rounded-xl border border-red-200 p-6 text-center space-y-3">
          <p className="text-sm text-red-600">{error?.message ?? 'Failed to fetch sync data.'}</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {data && !isLoading && (
        <>
          {/* Exhibition summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{data.exhibition.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(data.exhibition.startDate).toLocaleDateString()} — {new Date(data.exhibition.endDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.exhibition.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {data.exhibition.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Halls', value: data.halls.length, color: 'bg-indigo-50 text-indigo-700' },
                { label: 'Booths', value: totalBooths, color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Nav Nodes', value: totalNodes, color: 'bg-amber-50 text-amber-700' },
                { label: 'Nav Edges', value: totalEdges, color: 'bg-rose-50 text-rose-700' },
              ].map(s => (
                <div key={s.label} className={`rounded-lg px-3 py-2.5 ${s.color}`}>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Synced at: {new Date(data.syncedAt).toLocaleString()}
              {data.hallConnections?.length > 0 && (
                <span className="ml-3">{data.hallConnections.length} cross-hall connection{data.hallConnections.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>

          {/* Hall breakdown */}
          {data.halls.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Hall Breakdown</h3>
              <div className="space-y-2">
                {data.halls.map(hall => (
                  <HallCard key={hall.id} hall={hall} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!triggered && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm text-slate-400">Enter an exhibition ID and click <strong>Fetch Sync Data</strong> to load the kiosk bundle.</p>
        </div>
      )}
    </div>
  )
}

export default KioskSync
