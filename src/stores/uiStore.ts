import { create } from 'zustand';
import type { NavItem } from '../types';

interface UIState {
  activeNav: string;
  sidebarCollapsed: boolean;
  rightPanelTab: 'cloud' | 'activity' | 'agents';
  searchQuery: string;
  navItems: NavItem[];
  setActiveNav: (id: string) => void;
  toggleSidebar: () => void;
  setRightPanelTab: (tab: UIState['rightPanelTab']) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeNav: 'editor',
  sidebarCollapsed: false,
  rightPanelTab: 'cloud',
  searchQuery: '',
  navItems: [
    { id: 'editor', label: 'Editor', icon: 'Code2' },
    { id: 'cloud-factory', label: 'Cloud Factory', icon: 'Cloud', badge: 'New' },
    { id: 'bugfix', label: 'Bug Fix Suite', icon: 'Bug' },
    { id: 'deploy', label: 'Deploy', icon: 'Rocket' },
    { id: 'git', label: 'Git', icon: 'GitBranch' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ],

  setActiveNav: (id) => set({ activeNav: id }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
