import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Home,
  FolderKanban,
  Bot,
  Workflow,
  Cloud,
  Settings,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { colors, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";

const NAV_ITEMS = [
  { route: "index", label: "Home", icon: Home },
  { route: "projects", label: "Projects", icon: FolderKanban },
  { route: "workspace", label: "Workspace", icon: Sparkles },
  { route: "agents", label: "Agents", icon: Bot },
  { route: "workflows", label: "Workflows", icon: Workflow },
  { route: "cloud", label: "Cloud Factory", icon: Cloud },
  { route: "settings", label: "Settings", icon: Settings },
];

const FAVORITES = [
  { name: "SaaS Dashboard", color: colors.green },
  { name: "E-commerce Mobile", color: colors.blue },
];

interface DrawerContentProps {
  state: {
    routes: { name: string; key: string }[];
    index: number;
  };
  navigation: {
    navigate: (route: string) => void;
  };
}

export function DrawerContent({ state, navigation }: DrawerContentProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name ?? "index";
  const projects = useProjectStore((s) => s.projects);

  return (
    <LinearGradient
      colors={["#0F0F1A", "#0A0A0F"]}
      style={{ flex: 1, paddingTop: insets.top }}
    >
      <DrawerContentScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <LinearGradient
            colors={["#A855F7", "#3B82F6"]}
            style={{ width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" }}
          >
            <Sparkles size={20} color="#FFF" />
          </LinearGradient>
          <View>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>VibeCursor</Text>
            <Text style={{ color: colors.purple, fontSize: 11, fontWeight: "600" }}>PRO</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => navigation.navigate(item.route)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: radius.md,
                  marginBottom: 2,
                  backgroundColor: isActive ? "rgba(168, 85, 247, 0.15)" : "transparent",
                  borderLeftWidth: isActive ? 3 : 0,
                  borderLeftColor: colors.purple,
                }}
              >
                <Icon size={20} color={isActive ? colors.purple : colors.textSecondary} />
                <Text
                  style={{
                    marginLeft: 12,
                    color: isActive ? colors.text : colors.textSecondary,
                    fontWeight: isActive ? "600" : "400",
                    fontSize: 15,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Star size={14} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 }}>
              Favorites
            </Text>
          </View>
          {FAVORITES.map((fav) => (
            <TouchableOpacity
              key={fav.name}
              onPress={() => navigation.navigate("workspace")}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 }}
            >
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: fav.color }} />
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{fav.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 24, borderRadius: radius.lg, overflow: "hidden" }}>
          <LinearGradient
            colors={["rgba(168,85,247,0.2)", "rgba(59,130,246,0.15)"]}
            style={{ padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg }}
          >
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 4 }}>Pro Plan</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 12 }}>
              Unlimited AI agents & cloud deploys
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.purple,
                paddingVertical: 10,
                borderRadius: radius.md,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 13 }}>Upgrade Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <LinearGradient
            colors={["#A855F7", "#3B82F6"]}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700" }}>M</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>Marcus Chen</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>{projects.length} projects</Text>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}
