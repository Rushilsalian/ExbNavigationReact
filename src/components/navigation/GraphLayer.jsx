import { useMemo } from 'react'
import { Layer } from 'react-konva'
import useNavigationStore from '../../store/navigationStore'
import NodeShape from './NodeShape'
import EdgeShape from './EdgeShape'

export default function GraphLayer({
  editorMode,
  highlightedRoute,
  onNodeClick,
  onEdgeClick,
  onNodeDragEnd,
  connectSourceId,
}) {
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const edgesMap = useNavigationStore(s => s.edgesMap)
  const selectedNodeId = useNavigationStore(s => s.selectedNodeId)
  const selectedEdgeId = useNavigationStore(s => s.selectedEdgeId)
  const activeGraphHallId = useNavigationStore(s => s.activeGraphHallId)

  const hallNodes = useMemo(
    () => Object.values(nodesMap).filter(n => n.hallId === activeGraphHallId),
    [nodesMap, activeGraphHallId]
  )

  const hallNodeIds = useMemo(
    () => new Set(hallNodes.map(n => n.id)),
    [hallNodes]
  )

  const hallEdges = useMemo(
    () => Object.values(edgesMap).filter(
      e => hallNodeIds.has(e.sourceId) && hallNodeIds.has(e.targetId)
    ),
    [edgesMap, hallNodeIds]
  )

  return (
    <Layer>
      {hallEdges.map(edge => (
        <EdgeShape
          key={edge.id}
          edge={edge}
          sourceNode={nodesMap[edge.sourceId]}
          targetNode={nodesMap[edge.targetId]}
          isSelected={edge.id === selectedEdgeId}
          isOnRoute={highlightedRoute?.edgeIds.has(edge.id) ?? false}
          onEdgeClick={onEdgeClick}
        />
      ))}

      {hallNodes.map(node => (
        <NodeShape
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          isOnRoute={highlightedRoute?.nodeIds.has(String(node.id)) ?? false}
          isConnectSource={node.id === connectSourceId}
          editorMode={editorMode}
          onNodeClick={onNodeClick}
          onNodeDragEnd={onNodeDragEnd}
        />
      ))}
    </Layer>
  )
}
