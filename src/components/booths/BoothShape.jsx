import { Group, Rect, Circle, RegularPolygon, Text } from 'react-konva'

const FILL_DEFAULT = '#e0e7ff'
const FILL_SELECTED = '#6366f1'
const STROKE_DEFAULT = '#6366f1'
const STROKE_SELECTED = '#312e81'
const STROKE_WIDTH_DEFAULT = 1
const STROKE_WIDTH_SELECTED = 2

export default function BoothShape({ booth, isSelected, onSelect, onDragEnd }) {
  const fill = isSelected ? FILL_SELECTED : FILL_DEFAULT
  const stroke = isSelected ? STROKE_SELECTED : STROKE_DEFAULT
  const strokeWidth = isSelected ? STROKE_WIDTH_SELECTED : STROKE_WIDTH_DEFAULT
  const labelColor = isSelected ? '#ffffff' : '#3730a3'

  const cx = booth.x + booth.width / 2
  const cy = booth.y + booth.height / 2
  const radius = Math.min(booth.width, booth.height) / 2

  const shapeType = booth.shapeType || 'rect'

  const sharedProps = {
    fill,
    stroke,
    strokeWidth,
    rotation: booth.rotation || 0,
  }

  const handleDragEnd = (e) => {
    onDragEnd(booth.id, {
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    })
  }

  const handleClick = () => onSelect(booth.id)

  return (
    <Group
      x={booth.x}
      y={booth.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      {shapeType === 'circle' ? (
        <Circle
          {...sharedProps}
          x={booth.width / 2}
          y={booth.height / 2}
          radius={radius}
          rotation={0}
        />
      ) : shapeType === 'polygon' ? (
        <RegularPolygon
          {...sharedProps}
          x={booth.width / 2}
          y={booth.height / 2}
          sides={6}
          radius={radius}
          rotation={0}
        />
      ) : (
        <Rect
          {...sharedProps}
          x={0}
          y={0}
          width={booth.width}
          height={booth.height}
        />
      )}

      <Text
        x={0}
        y={0}
        width={booth.width}
        height={booth.height}
        text={booth.number || booth.name || ''}
        fontSize={Math.max(10, Math.min(14, booth.width / 5))}
        fill={labelColor}
        align="center"
        verticalAlign="middle"
        listening={false}
        wrap="none"
        ellipsis
      />
    </Group>
  )
}
