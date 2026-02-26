import { create } from 'zustand';

type AppMode = 'work' | 'transition' | 'chill';
type Tab = 'home' | 'today' | 'crm' | 'pipeline';

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  tab: Tab;
  setTab: (tab: Tab) => void;
  transitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;
  toast: string | null;
  setToast: (toast: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'work',
  setMode: (mode) => set({ mode }),
  tab: 'home',
  setTab: (tab) => set({ tab }),
  transitioning: false,
  setTransitioning: (transitioning) => set({ transitioning }),
  toast: null,
  setToast: (toast) => set({ toast }),
}));