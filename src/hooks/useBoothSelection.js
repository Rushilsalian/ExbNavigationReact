import useBoothStore from '../store/boothStore'

const useBoothSelection = () => {
  const selectedBoothId = useBoothStore(s => s.selectedBoothId)
  const boothsMap = useBoothStore(s => s.boothsMap)
  const selectBooth = useBoothStore(s => s.selectBooth)
  const deselectBooth = useBoothStore(s => s.deselectBooth)

  const selectedBooth = selectedBoothId ? (boothsMap[selectedBoothId] ?? null) : null

  const isSelected = (boothId) => boothId === selectedBoothId

  return { selectedBooth, selectedBoothId, selectBooth, deselectBooth, isSelected }
}

export default useBoothSelection
