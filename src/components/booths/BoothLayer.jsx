import { Layer } from 'react-konva'
import useBoothStore from '../../store/boothStore'
import useBoothSelection from '../../hooks/useBoothSelection'
import useViewportCulling from '../../hooks/useViewportCulling'
import BoothShape from './BoothShape'

export default function BoothLayer({ stageScale, stagePos, containerSize }) {
  const boothsMap = useBoothStore(s => s.boothsMap)
  const boothOrder = useBoothStore(s => s.boothOrder)
  const updateBooth = useBoothStore(s => s.updateBooth)
  const { selectedBoothId, selectBooth, deselectBooth, isSelected } = useBoothSelection()

  const allBooths = boothOrder.map(id => boothsMap[id]).filter(Boolean)
  const visibleBooths = useViewportCulling(allBooths, stageScale, stagePos, containerSize, selectedBoothId)

  const handleSelect = (id) => {
    if (isSelected(id)) deselectBooth()
    else selectBooth(id)
  }

  const handleDragEnd = (id, pos) => updateBooth(id, pos)

  return (
    <Layer>
      {visibleBooths.map(booth => (
        <BoothShape
          key={booth.id}
          booth={booth}
          isSelected={isSelected(booth.id)}
          onSelect={handleSelect}
          onDragEnd={handleDragEnd}
        />
      ))}
    </Layer>
  )
}
