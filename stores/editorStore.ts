import { create } from "zustand";

export type WorkspaceTab = "explorer" | "editor" | "preview" | "chat";

interface EditorState {
  workspaceTab: WorkspaceTab;
  commandPaletteOpen: boolean;
  rightPanelOpen: boolean;
  editorTheme: "devibe-dark" | "vs-dark";
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  workspaceTab: "editor",
  commandPaletteOpen: false,
  rightPanelOpen: false,
  editorTheme: "devibe-dark",

  setWorkspaceTab: (tab) => set({ workspaceTab: tab }),
  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
}));
