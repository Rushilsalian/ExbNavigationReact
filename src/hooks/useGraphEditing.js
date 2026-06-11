import { useState, useCallback } from 'react'
import useNavigationStore from '../store/navigationStore'
import { createNode, createEdge, updateNode as updateNodeApi, deleteNode as deleteNodeApi, deleteEdge as deleteEdgeApi } from '../services/navigationService'
import { screenToSvg } from '../utils/coordinateUtils'
import { NODE_TYPE_CONFIG } from '../utils/nodeTypeConfig'

export const EDITOR_MODES = {
  SELECT: 'SELECT',
  ADD_NODE: 'ADD_NODE',
  CONNECT: 'CONNECT',
  DELETE: 'DELETE',
}

export default function useGraphEditing({
  editorMode,
  activeGraphHallId,
  stageRef,
  stageScale,
  stagePos,
  pendingNodeType,
}) {
  const [connectSourceId, setConnectSourceId] = useState(null)

  const nodesMap = useNavigationStore(s => s.nodesMap)
  const addNode = useNavigationStore(s => s.addNode)
  const updateNode = useNavigationStore(s => s.updateNode)
  const removeNode = useNavigationStore(s => s.removeNode)
  const addEdge = useNavigationStore(s => s.addEdge)
  const removeEdge = useNavigationStore(s => s.removeEdge)
  const selectNode = useNavigationStore(s => s.selectNode)
  const selectEdge = useNavigationStore(s => s.selectEdge)
  const clearSelection = useNavigationStore(s => s.clearSelection)
  const setConnectSource = useNavigationStore(s => s.setConnectSource)
  const getNodeById = useNavigationStore(s => s.getNodeById)

  const handleStageClick = useCallback(async (e) => {
    if (e.target !== stageRef.current) return

    if (editorMode === EDITOR_MODES.ADD_NODE) {
      if (!activeGraphHallId) return
      const stage = stageRef.current
      const pointer = stage.getPointerPosition()
      const { x, y } = screenToSvg(pointer.x, pointer.y, {
        scale: stageScale,
        offsetX: stagePos.x,
        offsetY: stagePos.y,
      })

      try {
        const type = (pendingNodeType || 'walkway').toLowerCase()
        const typeLabel = NODE_TYPE_CONFIG[type]?.label ?? 'Node'
        const sameTypeCount = Object.values(nodesMap).filter(n => n.nodeType === type).length
        const node = await createNode({
          hallId: activeGraphHallId,
          label: `${typeLabel} ${sameTypeCount + 1}`,
          x: Math.round(x),
          y: Math.round(y),
          nodeType: type.toUpperCase(),
        })
        addNode({ ...node, nodeType: node.nodeType?.toLowerCase() ?? type })
        selectNode(node.id)
      } catch (err) {
        console.error('Failed to create node:', err)
      }
      return
    }

    if (editorMode === EDITOR_MODES.SELECT) {
      clearSelection()
      setConnectSourceId(null)
      setConnectSource(null)
    }
  }, [editorMode, activeGraphHallId, stageRef, stageScale, stagePos, pendingNodeType,
    addNode, selectNode, clearSelection, setConnectSource])

  const handleNodeClick = useCallback(async (node, e) => {
    if (editorMode === EDITOR_MODES.SELECT) {
      selectNode(node.id)
      return
    }

    if (editorMode === EDITOR_MODES.CONNECT) {
      if (connectSourceId === null) {
        setConnectSourceId(node.id)
        setConnectSource(node.id)
        selectNode(node.id)
      } else if (connectSourceId === node.id) {
        setConnectSourceId(null)
        setConnectSource(null)
        clearSelection()
      } else {
        try {
          const result = await createEdge({
            fromId: Number(connectSourceId),
            toId: Number(node.id),
            bidirectional: true,
          })
          for (const edge of result.edges) {
            addEdge({
              id: edge.id,
              sourceId: edge.fromId,
              targetId: edge.toId,
              weight: edge.weight,
              directed: false,
            })
          }
        } catch (err) {
          console.error('Failed to create edge:', err)
        }
        setConnectSourceId(null)
        setConnectSource(null)
        clearSelection()
      }
      return
    }

    if (editorMode === EDITOR_MODES.DELETE) {
      removeNode(node.id)
      setConnectSourceId(null)
      setConnectSource(null)
      deleteNodeApi(node.id).catch(err => console.error('Failed to delete node:', err))
    }
  }, [editorMode, connectSourceId, selectNode, clearSelection, addEdge, removeNode, setConnectSource])

  const handleEdgeClick = useCallback((edge, e) => {
    if (editorMode === EDITOR_MODES.SELECT) {
      selectEdge(edge.id)
      return
    }
    if (editorMode === EDITOR_MODES.DELETE) {
      removeEdge(edge.id)
      deleteEdgeApi(edge.id).catch(err => console.error('Failed to delete edge:', err))
    }
  }, [editorMode, selectEdge, removeEdge])

  const handleNodeDragEnd = useCallback((nodeId, e) => {
    const x = Math.round(e.target.x())
    const y = Math.round(e.target.y())
    updateNode(nodeId, { x, y })
    updateNodeApi(nodeId, { x, y }).catch(err => console.error('Failed to persist node position:', err))
  }, [updateNode])

  const resetConnectSource = useCallback(() => {
    setConnectSourceId(null)
    setConnectSource(null)
  }, [setConnectSource])

  return {
    connectSourceId,
    handleStageClick,
    handleNodeClick,
    handleEdgeClick,
    handleNodeDragEnd,
    resetConnectSource,
  }
}
