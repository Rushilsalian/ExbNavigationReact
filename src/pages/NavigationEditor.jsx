import useNavigationStore from '../store/navigationStore'
import useHallStore from '../store/hallStore'
import NodeEditor from '../components/navigation/NodeEditor'
import EdgeEditor from '../components/navigation/EdgeEditor'
import RoutePreview from '../components/navigation/RoutePreview'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { serializeGraph } from '../utils/graphHelpers'

function NavigationEditor() {
  const activeHallId = useHallStore(s => s.activeHallId)
  const halls = useHallStore(s => s.halls)
  const getAllNodes = useNavigationStore(s => s.getAllNodes)
  const getAllEdges = useNavigationStore(s => s.getAllEdges)
  const isConnectMode = useNavigationStore(s => s.isConnectMode)
  const toggleConnectMode = useNavigationStore(s => s.toggleConnectMode)
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const edgesMap = useNavigationStore(s => s.edgesMap)

  const nodes = getAllNodes()
  const edges = getAllEdges()
  const activeHall = halls.find(h => h.id === activeHallId) ?? null

  const handleExport = () => {
    const graph = serializeGraph(nodesMap, edgesMap)
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nav-graph-${activeHallId || 'export'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full gap-4 min-h-0" style={{ height: 'calc(100vh - 128px)' }}>
      {/* Left panel */}
      <div className="w-72 shrink-0 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Nodes
            {activeHall && <span className="ml-1 text-indigo-600">— {activeHall.name}</span>}
          </h2>
          <NodeEditor />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Edges</h2>
          <EdgeEditor />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Route Preview</h2>
          <RoutePreview />
        </div>
      </div>

      {/* Canvas / graph area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Button
            variant={isConnectMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleConnectMode}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          >
            {isConnectMode ? 'Connect Mode ON' : 'Connect Mode'}
          </Button>

          <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
            <span><strong className="text-slate-700">{nodes.length}</strong> nodes</span>
            <span><strong className="text-slate-700">{edges.length}</strong> edges</span>
          </div>

          <Button variant="secondary" size="sm" onClick={handleExport} disabled={nodes.length === 0}>
            Export JSON
          </Button>
        </div>

        {/* Canvas placeholder */}
        {activeHallId ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-2">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-indigo-100">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">React-Konva Canvas</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Interactive graph canvas integrates in Phase 3.<br />
                Use the forms on the left to add nodes and edges now.
              </p>
              {nodes.length > 0 && (
                <p className="text-xs text-indigo-600 font-medium">{nodes.length} nodes · {edges.length} edges in graph</p>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Hall Selected"
            description="Select a hall from Hall Upload before building the navigation graph."
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  )
}

export default NavigationEditor
