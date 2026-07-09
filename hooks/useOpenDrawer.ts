import { useUiStore } from "../stores/uiStore";

/** Opens the app menu modal (replaces drawer on tab navigation). */
export function useOpenDrawer() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  return () => setMenuOpen(true);
}
