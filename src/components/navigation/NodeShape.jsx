import { Group, Circle, Text } from 'react-konva'
import { getNodeConfig } from '../../utils/nodeTypeConfig'

export default function NodeShape({
  node,
  isSelected,
  isOnRoute,
  isConnectSource,
  editorMode,
  onNodeClick,
  onNodeDragEnd,
}) {
  const config = getNodeConfig(node.nodeType)

  const handleClick = (e) => {
    e.cancelBubble = true
    onNodeClick(node, e)
  }

  const handleDragEnd = (e) => {
    onNodeDragEnd(node.id, e)
  }

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={editorMode === 'SELECT'}
      onClick={handleClick}
      onTap={handleClick}
      onDragEnd={handleDragEnd}
    >
      {isOnRoute && (
        <Circle
          radius={config.radius + 7}
          fill="#fbbf24"
          opacity={0.35}
        />
      )}

      {isConnectSource && (
        <Circle
          radius={config.radius + 5}
          fill="transparent"
          stroke="#22c55e"
          strokeWidth={2.5}
        />
      )}

      <Circle
        radius={config.radius}
        fill={isSelected ? '#ffffff' : config.color}
        stroke={config.strokeColor}
        strokeWidth={isSelected ? 3 : 1.5}
        shadowColor="#6366f1"
        shadowBlur={isSelected ? 12 : 0}
        shadowOpacity={0.6}
      />

      <Text
        text={node.label}
        fontSize={10}
        fill="#1e293b"
        align="center"
        offsetX={40}
        offsetY={-(config.radius + 4)}
        width={80}
        listening={false}
      />
    </Group>
  )
}
