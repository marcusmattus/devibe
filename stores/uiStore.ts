import { create } from "zustand";

interface UiState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));
