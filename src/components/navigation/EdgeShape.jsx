import { Arrow } from 'react-konva'

export default function EdgeShape({
  edge,
  sourceNode,
  targetNode,
  isSelected,
  isOnRoute,
  onEdgeClick,
}) {
  if (!sourceNode || !targetNode) return null

  const handleClick = (e) => {
    e.cancelBubble = true
    onEdgeClick(edge, e)
  }

  const stroke = isOnRoute ? '#f59e0b' : isSelected ? '#6366f1' : '#94a3b8'
  const strokeWidth = isOnRoute ? 3 : isSelected ? 2.5 : 1.5

  return (
    <Arrow
      points={[sourceNode.x, sourceNode.y, targetNode.x, targetNode.y]}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={stroke}
      pointerLength={edge.directed ? 10 : 0}
      pointerWidth={edge.directed ? 8 : 0}
      hitStrokeWidth={12}
      onClick={handleClick}
      onTap={handleClick}
    />
  )
}
