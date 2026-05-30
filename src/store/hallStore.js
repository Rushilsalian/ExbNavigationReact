import { create } from 'zustand'

const useHallStore = create((set, get) => ({
  halls: [],
  activeHallId: null,
  svgContent: null,
  svgDimensions: { width: 0, height: 0 },
  uploadProgress: 0,
  isUploading: false,

  getActiveHall: () => {
    const { halls, activeHallId } = get()
    return halls.find(h => h.id === activeHallId) ?? null
  },

  setHalls: (halls) => set({ halls }),
  setActiveHall: (hallId) => set({ activeHallId: hallId }),
  addHall: (hall) => set(state => ({ halls: [...state.halls, hall] })),
  updateHall: (hallId, updates) =>
    set(state => ({
      halls: state.halls.map(h => h.id === hallId ? { ...h, ...updates } : h),
    })),
  removeHall: (hallId) =>
    set(state => ({
      halls: state.halls.filter(h => h.id !== hallId),
      activeHallId: state.activeHallId === hallId ? null : state.activeHallId,
    })),
  setSvgContent: (svgContent) => set({ svgContent }),
  setSvgDimensions: (svgDimensions) => set({ svgDimensions }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  clearSvg: () => set({ svgContent: null, svgDimensions: { width: 0, height: 0 } }),
}))

export default useHallStore
