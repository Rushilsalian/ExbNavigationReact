import { useState } from 'react'
import useNavigationStore from '../../store/navigationStore'
import { computeRoute } from '../../services/navigationService'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'

function RoutePreview() {
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const getAllNodes = useNavigationStore(s => s.getAllNodes)
  const nodes = getAllNodes()

  if (nodes.length < 2) {
    return (
      <EmptyState
        title="Route Preview"
        description="Add at least 2 connected nodes to calculate a route."
        icon={
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        }
      />
    )
  }

  const handleFind = async (e) => {
    e.preventDefault()
    if (!fromId || !toId || fromId === toId) return
    setApiError(null)
    setRoute(null)
    setLoading(true)
    try {
      const result = await computeRoute({ fromNodeId: Number(fromId), toNodeId: Number(toId) })
      setRoute(result)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleFind} className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">From</label>
          <select
            value={fromId}
            onChange={e => { setFromId(e.target.value); setRoute(null) }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select start node…</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">To</label>
          <select
            value={toId}
            onChange={e => { setToId(e.target.value); setRoute(null) }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select end node…</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full"
          disabled={!fromId || !toId || fromId === toId || loading}
        >
          {loading ? 'Calculating…' : 'Find Route'}
        </Button>
      </form>

      {apiError && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
      )}

      {route && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Shortest Path</span>
            <span className="text-xs text-indigo-600 font-medium">
              {route.totalDistance} units · {route.path.length} stops
            </span>
          </div>

          <ol className="space-y-1">
            {route.coordinates.map((coord, i) => (
              <li key={coord.nodeId} className="flex items-center gap-2">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  i === 0 ? 'bg-green-100 text-green-700' :
                  i === route.coordinates.length - 1 ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {i + 1}
                </span>
                <span className="text-xs text-slate-700 truncate flex-1">{coord.label ?? `Node ${coord.nodeId}`}</span>
                <span className="text-[10px] text-slate-400 shrink-0">({coord.x}, {coord.y})</span>
              </li>
            ))}
          </ol>

          {route.halls.length > 1 && (
            <p className="text-[10px] text-slate-500 bg-slate-50 rounded px-2 py-1">
              Crosses {route.halls.length} halls: {route.halls.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default RoutePreview
