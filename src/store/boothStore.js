import { create } from 'zustand'

const useBoothStore = create((set, get) => ({
  boothsMap: {},
  boothOrder: [],
  selectedBoothId: null,
  isEditing: false,
  editDraft: null,

  getBoothById: (id) => get().boothsMap[id] ?? null,
  getAllBooths: () => get().boothOrder.map(id => get().boothsMap[id]).filter(Boolean),
  getSelectedBooth: () => {
    const { selectedBoothId, boothsMap } = get()
    return selectedBoothId ? (boothsMap[selectedBoothId] ?? null) : null
  },

  setBooths: (booths) => {
    const boothsMap = {}
    const boothOrder = []
    booths.forEach(b => { boothsMap[b.id] = b; boothOrder.push(b.id) })
    set({ boothsMap, boothOrder })
  },
  addBooth: (booth) =>
    set(state => ({
      boothsMap: { ...state.boothsMap, [booth.id]: booth },
      boothOrder: [...state.boothOrder, booth.id],
    })),
  updateBooth: (boothId, updates) =>
    set(state => ({
      boothsMap: {
        ...state.boothsMap,
        [boothId]: { ...state.boothsMap[boothId], ...updates },
      },
    })),
  removeBooth: (boothId) =>
    set(state => {
      const { [boothId]: _removed, ...rest } = state.boothsMap
      return {
        boothsMap: rest,
        boothOrder: state.boothOrder.filter(id => id !== boothId),
        selectedBoothId: state.selectedBoothId === boothId ? null : state.selectedBoothId,
      }
    }),

  selectBooth: (boothId) => set({ selectedBoothId: boothId, isEditing: false, editDraft: null }),
  deselectBooth: () => set({ selectedBoothId: null, isEditing: false, editDraft: null }),
  startEdit: () => {
    const booth = get().getSelectedBooth()
    if (booth) set({ isEditing: true, editDraft: { ...booth } })
  },
  updateEditDraft: (field, value) =>
    set(state => ({
      editDraft: state.editDraft ? { ...state.editDraft, [field]: value } : null,
    })),
  cancelEdit: () => set({ isEditing: false, editDraft: null }),
  commitEdit: () => {
    const { editDraft, selectedBoothId } = get()
    if (editDraft && selectedBoothId) {
      set(state => ({
        boothsMap: { ...state.boothsMap, [selectedBoothId]: { ...editDraft } },
        isEditing: false,
        editDraft: null,
      }))
    }
  },
  clearBooths: () => set({ boothsMap: {}, boothOrder: [], selectedBoothId: null }),
}))

export default useBoothStore
