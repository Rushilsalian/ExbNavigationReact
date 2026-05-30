import { useNavigate } from 'react-router-dom'
import useHallStore from '../store/hallStore'
import useBoothStore from '../store/boothStore'
import useNavigationStore from '../store/navigationStore'
import Button from '../components/common/Button'

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, to, label }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={() => navigate(to)}>
        {label}
      </Button>
    </div>
  )
}

function Dashboard() {
  const halls = useHallStore(s => s.halls)
  const getAllBooths = useBoothStore(s => s.getAllBooths)
  const getAllNodes = useNavigationStore(s => s.getAllNodes)
  const getAllEdges = useNavigationStore(s => s.getAllEdges)

  const booths = getAllBooths()
  const nodes = getAllNodes()
  const edges = getAllEdges()

  const stats = [
    {
      label: 'Total Halls',
      value: halls.length,
      color: 'bg-indigo-100 text-indigo-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Total Booths',
      value: booths.length,
      color: 'bg-emerald-100 text-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      label: 'Navigation Nodes',
      value: nodes.length,
      color: 'bg-amber-100 text-amber-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Graph Edges',
      value: edges.length,
      color: 'bg-rose-100 text-rose-600',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s an overview of your exhibition setup.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickActionCard
            title="Upload Hall SVG"
            description="Import a floor plan to start configuring your exhibition."
            to="/hall-upload"
            label="Go to Hall Upload"
          />
          <QuickActionCard
            title="Map Booths"
            description="Place and label exhibitor booths on your floor plan."
            to="/booth-mapping"
            label="Open Booth Mapping"
          />
          <QuickActionCard
            title="Edit Navigation"
            description="Build the graph used for indoor wayfinding."
            to="/navigation-editor"
            label="Open Navigation Editor"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Setup Checklist</h3>
        <ul className="space-y-3">
          {[
            { label: 'Upload a hall SVG floor plan', done: halls.length > 0 },
            { label: 'Add booths to the floor plan', done: booths.length > 0 },
            { label: 'Create navigation nodes', done: nodes.length > 0 },
            { label: 'Connect nodes with edges', done: edges.length > 0 },
          ].map(({ label, done }) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                {done && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className={done ? 'text-slate-400 line-through' : 'text-slate-600'}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
