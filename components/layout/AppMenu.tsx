import { View, Text, Modal, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  X,
  Sparkles,
  Cloud,
  Workflow,
  Github,
  Shield,
  Rocket,
  LayoutTemplate,
  Code2,
} from "lucide-react-native";
import { colors, radius } from "../../constants/theme";
import { useUiStore } from "../../stores/uiStore";
import { GlassCard } from "../ui/GlassCard";

const MENU_ITEMS = [
  { label: "Workspace", route: "/workspace", icon: Code2, color: colors.purple },
  { label: "Templates", route: "/templates", icon: LayoutTemplate, color: colors.blue },
  { label: "Deployments", route: "/deployments", icon: Rocket, color: colors.green },
  { label: "Cloud Factory", route: "/cloud", icon: Cloud, color: colors.orange },
  { label: "Repositories", route: "/repositories", icon: Github, color: colors.text },
  { label: "Access Control", route: "/access-control", icon: Shield, color: colors.purple },
  { label: "Workflows", route: "/workflows", icon: Workflow, color: colors.blueNeon },
];

export function AppMenu() {
  const insets = useSafeAreaInsets();
  const open = useUiStore((s) => s.menuOpen);
  const setOpen = useUiStore((s) => s.setMenuOpen);

  const navigate = (route: string) => {
    setOpen(false);
    router.push(route as never);
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}
        onPress={() => setOpen(false)}
      >
        <Pressable
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            maxHeight: "75%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Sparkles size={20} color={colors.purple} />
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>Menu</Text>
            </View>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <X size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={item.route} onPress={() => navigate(item.route)}>
                  <GlassCard>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        gap: 14,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: radius.md,
                          backgroundColor: `${item.color}22`,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={20} color={item.color} />
                      </View>
                      <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
                        {item.label}
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
