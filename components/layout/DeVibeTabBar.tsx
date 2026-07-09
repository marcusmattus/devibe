import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, FolderKanban, Bot, User, Plus } from "lucide-react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, radius } from "../../constants/theme";

const TABS: {
  name: string;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  center?: boolean;
}[] = [
  { name: "index", label: "Home", Icon: Home },
  { name: "projects", label: "Projects", Icon: FolderKanban },
  { name: "create", label: "", Icon: Plus, center: true },
  { name: "agents", label: "Agents", Icon: Bot },
  { name: "profile", label: "Profile", Icon: User },
] ;

export function DeVibeTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          height: 64 + Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.blur}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const Icon = tab.Icon;

          if (tab.center) {
            return (
              <TouchableOpacity
                key={tab.name}
                onPress={() => navigation.navigate(tab.name)}
                style={styles.centerButton}
                activeOpacity={0.85}
              >
                <View style={styles.centerInner}>
                  <Plus size={26} color="#FFF" strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Icon
                size={22}
                color={isFocused ? colors.purpleBrand : colors.textMuted}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.purpleBrand : colors.textMuted },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(10, 10, 12, 0.98)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  blur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
  centerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? -20 : -16,
  },
  centerInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purpleBrand,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.purpleBrand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
