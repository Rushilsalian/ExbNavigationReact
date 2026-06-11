import { Layer, Group, Circle, Text } from 'react-konva'
import useNavigationStore from '../../store/navigationStore'
import { getNodeConfig } from '../../utils/nodeTypeConfig'

function NavMarker({ node }) {
  const config = getNodeConfig(node.nodeType)
  return (
    <Group x={node.x} y={node.y} listening={false}>
      <Circle
        radius={config.radius + 4}
        fill={config.color}
        stroke={config.strokeColor}
        strokeWidth={2}
        opacity={0.85}
      />
      <Text
        text={node.label}
        fontSize={10}
        fill="#1e293b"
        align="center"
        offsetX={40}
        offsetY={-(config.radius + 6)}
        width={80}
        listening={false}
      />
    </Group>
  )
}

export default function NavOverlayLayer() {
  const nodesMap = useNavigationStore(s => s.nodesMap)
  const activeGraphHallId = useNavigationStore(s => s.activeGraphHallId)

  const nodes = Object.values(nodesMap).filter(n => n.hallId === activeGraphHallId)
  if (nodes.length === 0) return null

  return (
    <Layer listening={false}>
      {nodes.map(node => (
        <NavMarker key={node.id} node={node} />
      ))}
    </Layer>
  )
}
