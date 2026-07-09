import { useNavigation } from "expo-router";

export function useOpenDrawer() {
  const navigation = useNavigation();
  return () => {
    if ("openDrawer" in navigation && typeof navigation.openDrawer === "function") {
      navigation.openDrawer();
    }
  };
}
