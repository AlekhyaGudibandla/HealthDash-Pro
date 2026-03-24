import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  patientViewMode: 'grid' | 'list';
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setPatientViewMode: (mode: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  patientViewMode: 'grid',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setPatientViewMode: (mode) => set({ patientViewMode: mode }),
}));
