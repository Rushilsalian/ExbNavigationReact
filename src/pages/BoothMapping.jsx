import useBoothStore from '../store/boothStore'
import useHallStore from '../store/hallStore'
import { useBoothsQuery } from '../hooks/useBooths'
import { useActiveHallQuery } from '../hooks/useHalls'
import useNavigationQuery from '../hooks/useNavigation'
import BoothList from '../components/booths/BoothList'
import BoothEditor from '../components/booths/BoothEditor'
import BoothProperties from '../components/booths/BoothProperties'
import EmptyState from '../components/common/EmptyState'
import BoothCanvas from '../components/booths/BoothCanvas'
import Loader from '../components/common/Loader'

function BoothMapping() {
  const activeHallId = useHallStore(s => s.activeHallId)
  const halls = useHallStore(s => s.halls)
  const setActiveHall = useHallStore(s => s.setActiveHall)
  const selectedBoothId = useBoothStore(s => s.selectedBoothId)

  const { isLoading: boothsLoading, isError: boothsError } = useBoothsQuery()
  useActiveHallQuery()
  useNavigationQuery()

  const activeHall = halls.find(h => h.id === activeHallId) ?? null

  return (
    <div className="flex h-full gap-4 min-h-0" style={{ height: 'calc(100vh - 128px)' }}>
      {/* Left panel */}
      <div className="w-72 shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 overflow-hidden flex-1">
          <div className="shrink-0 flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-slate-800">Booths</h2>
            <select
              value={activeHallId ?? ''}
              onChange={e => setActiveHall(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a hall…</option>
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>{hall.name}</option>
              ))}
            </select>
          </div>
          <BoothEditor />
          <BoothList />
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {activeHallId ? (
          boothsLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader size="md" label="Loading booths…" />
            </div>
          ) : boothsError ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-amber-600">Could not load booths from server.</p>
            </div>
          ) : (
            <BoothCanvas />
          )
        ) : (
          <EmptyState
            title="No Hall Selected"
            description="Go to Hall Upload to create or select a hall first."
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            }
          />
        )}
      </div>

      {/* Right panel */}
      <div className="w-72 shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {selectedBoothId ? (
          <BoothProperties />
        ) : (
          <EmptyState
            title="No Booth Selected"
            description="Click a booth in the list or on the canvas to view its properties."
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  )
}

export default BoothMapping
