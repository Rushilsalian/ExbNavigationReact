import { useState } from 'react'
import useNavigationStore from '../store/navigationStore'
import useHallStore from '../store/hallStore'
import { useActiveHallQuery } from '../hooks/useHalls'
import { useBoothsQuery } from '../hooks/useBooths'
import useNavigationQuery from '../hooks/useNavigation'
import NodeEditor from '../components/navigation/NodeEditor'
import EdgeEditor from '../components/navigation/EdgeEditor'
import RoutePreview from '../components/navigation/RoutePreview'
import GraphCanvas from '../components/navigation/GraphCanvas'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { EDITOR_MODES } from '../hooks/useGraphEditing'
import { serializeGraph, computeDistanceMatrix } from '../utils/graphHelpers'
import useBoothStore from '../store/boothStore'
import { saveDistances } from '../services/navigationService'

function NavigationEditor() {
  const [editorMode, setEditorMode] = useState(EDITOR_MODES.SELECT)
  const [highlightedRoute, setHighlightedRoute] = useState(null)
  const [pendingNodeType, setPendingNodeType] = useState('walkway')
  const [distanceSaveState, setDistanceSaveState] = useState('idle') // idle | saving | saved | error

  const activeHallId = useHallStore(s => s.activeHallId)
  const halls = useHallStore(s => s.halls)
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const boothsMap = useBoothStore(s => s.boothsMap)
  useActiveHallQuery()
  useBoothsQuery()
  useNavigationQuery()
  const edgesMap = useNavigationStore(s => s.edgesMap)
  const nodes = Object.values(nodesMap)
  const activeHall = halls.find(h => h.id === activeHallId) ?? null

  const handleSaveDistances = async () => {
    const booths = Object.values(boothsMap)
    const matrix = computeDistanceMatrix(nodesMap, edgesMap, booths)
    if (!matrix) return
    setDistanceSaveState('saving')
    try {
      await saveDistances({
        hallId: activeHallId,
        boothToBooths: matrix.boothToBooths,
        boothToGates: matrix.boothToGates,
      })
      setDistanceSaveState('saved')
      setTimeout(() => setDistanceSaveState('idle'), 2500)
    } catch {
      setDistanceSaveState('error')
      setTimeout(() => setDistanceSaveState('idle'), 2500)
    }
  }

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
          <NodeEditor
            editorMode={editorMode}
            onEditorModeChange={setEditorMode}
            pendingNodeType={pendingNodeType}
            onPendingNodeTypeChange={setPendingNodeType}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Edges</h2>
          <EdgeEditor editorMode={editorMode} onEditorModeChange={setEditorMode} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Route Preview</h2>
          <RoutePreview onRouteHighlight={setHighlightedRoute} />
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Page-level toolbar: Export only */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-medium text-slate-600">Navigation Graph</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveDistances}
              disabled={distanceSaveState === 'saving' || nodes.length === 0 || Object.keys(boothsMap).length === 0}
            >
              {distanceSaveState === 'saving' ? 'Saving…'
                : distanceSaveState === 'saved' ? 'Saved!'
                : distanceSaveState === 'error' ? 'Error'
                : 'Save Distances'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport} disabled={nodes.length === 0}>
              Export JSON
            </Button>
          </div>
        </div>

        {activeHallId ? (
          <GraphCanvas
            editorMode={editorMode}
            onEditorModeChange={setEditorMode}
            highlightedRoute={highlightedRoute}
            pendingNodeType={pendingNodeType}
            onPendingNodeTypeChange={setPendingNodeType}
          />
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
