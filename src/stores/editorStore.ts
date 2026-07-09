import { create } from 'zustand';
import type { ProjectFile } from '../types';
import { sampleProjectFiles } from '../data/sampleProject';

interface EditorState {
  files: ProjectFile[];
  activeFileId: string | null;
  openTabIds: string[];
  showCommandPalette: boolean;
  showPreview: boolean;
  showAgentChat: boolean;
  setActiveFile: (id: string) => void;
  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  applyEdit: (filePath: string, newContent: string) => void;
  toggleCommandPalette: () => void;
  togglePreview: () => void;
  toggleAgentChat: () => void;
  getActiveFile: () => ProjectFile | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: sampleProjectFiles,
  activeFileId: sampleProjectFiles[0]?.id ?? null,
  openTabIds: [sampleProjectFiles[0]?.id ?? ''],
  showCommandPalette: false,
  showPreview: true,
  showAgentChat: true,

  setActiveFile: (id) => set({ activeFileId: id }),

  openFile: (id) =>
    set((state) => ({
      activeFileId: id,
      openTabIds: state.openTabIds.includes(id)
        ? state.openTabIds
        : [...state.openTabIds, id],
    })),

  closeTab: (id) =>
    set((state) => {
      const newTabs = state.openTabIds.filter((tabId) => tabId !== id);
      const newActive =
        state.activeFileId === id
          ? newTabs[newTabs.length - 1] ?? null
          : state.activeFileId;
      return { openTabIds: newTabs, activeFileId: newActive };
    }),

  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, content, isDirty: true } : f
      ),
    })),

  applyEdit: (filePath, newContent) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.path === filePath ? { ...f, content: newContent, isDirty: true } : f
      ),
    })),

  toggleCommandPalette: () =>
    set((state) => ({ showCommandPalette: !state.showCommandPalette })),

  togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),

  toggleAgentChat: () => set((state) => ({ showAgentChat: !state.showAgentChat })),

  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find((f) => f.id === activeFileId);
  },
}));
