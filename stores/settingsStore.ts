import { create } from "zustand";

interface SettingsState {
  darkMode: boolean;
  aiEnabled: boolean;
  autoDeploy: boolean;
  apiKeys: Record<string, string>;
  setDarkMode: (value: boolean) => void;
  setAiEnabled: (value: boolean) => void;
  setAutoDeploy: (value: boolean) => void;
  setApiKey: (key: string, value: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: true,
  aiEnabled: true,
  autoDeploy: false,
  apiKeys: {},

  setDarkMode: (value) => set({ darkMode: value }),
  setAiEnabled: (value) => set({ aiEnabled: value }),
  setAutoDeploy: (value) => set({ autoDeploy: value }),
  setApiKey: (key, value) =>
    set((state) => ({ apiKeys: { ...state.apiKeys, [key]: value } })),
}));
