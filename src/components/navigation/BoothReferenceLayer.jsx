import { Layer, Group, Rect, Circle, RegularPolygon, Text } from 'react-konva'
import useBoothStore from '../../store/boothStore'

function BoothGhost({ booth }) {
  const cx = booth.width / 2
  const cy = booth.height / 2
  const radius = Math.min(booth.width, booth.height) / 2
  const shapeType = booth.shapeType || 'rect'

  const sharedProps = {
    fill: '#e0e7ff',
    stroke: '#6366f1',
    strokeWidth: 1,
    opacity: 0.45,
    rotation: booth.rotation || 0,
  }

  return (
    <Group x={booth.x} y={booth.y} listening={false}>
      {shapeType === 'circle' ? (
        <Circle {...sharedProps} x={cx} y={cy} radius={radius} rotation={0} />
      ) : shapeType === 'polygon' ? (
        <RegularPolygon {...sharedProps} x={cx} y={cy} sides={6} radius={radius} rotation={0} />
      ) : (
        <Rect {...sharedProps} x={0} y={0} width={booth.width} height={booth.height} />
      )}

      <Text
        x={0}
        y={0}
        width={booth.width}
        height={booth.height}
        text={booth.number || booth.name || ''}
        fontSize={Math.max(9, Math.min(13, booth.width / 5))}
        fill="#3730a3"
        opacity={0.7}
        align="center"
        verticalAlign="middle"
        listening={false}
        wrap="none"
        ellipsis
      />
    </Group>
  )
}

export default function BoothReferenceLayer() {
  const boothsMap = useBoothStore(s => s.boothsMap)
  const boothOrder = useBoothStore(s => s.boothOrder)
  const booths = boothOrder.map(id => boothsMap[id]).filter(Boolean)

  if (booths.length === 0) return null

  return (
    <Layer listening={false}>
      {booths.map(booth => (
        <BoothGhost key={booth.id} booth={booth} />
      ))}
    </Layer>
  )
}
