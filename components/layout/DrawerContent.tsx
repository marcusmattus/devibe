import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
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
  Github,
  Shield,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, gradients, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";
import { useAuthStore } from "../../stores/authStore";

const NAV_ITEMS = [
  { route: "index", label: "Home", icon: Home },
  { route: "projects", label: "Projects", icon: FolderKanban },
  { route: "repositories", label: "Repositories", icon: Github },
  { route: "access-control", label: "Access Control", icon: Shield },
  { route: "workspace", label: "Workspace", icon: Sparkles },
  { route: "agents", label: "Agents", icon: Bot },
  { route: "workflows", label: "Workflows", icon: Workflow },
  { route: "cloud", label: "Cloud Factory", icon: Cloud },
  { route: "settings", label: "Settings", icon: Settings },
];

const FAVORITE_COLORS = [colors.green, colors.blue, colors.purple, colors.orange];

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
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const authUser = useAuthStore((s) => s.user);
  const appProfile = useAuthStore((s) => s.appProfile);
  const displayUser = appProfile ?? (authUser ? { name: authUser.name ?? authUser.login, email: authUser.login, avatarUrl: authUser.avatar_url } : null);
  const favorites = projects.slice(0, 3);

  const openProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) setActiveProject(project);
    navigation.navigate("workspace");
  };

  return (
    <LinearGradient colors={[...gradients.screenAlt]} style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <LinearGradient
            colors={[...gradients.purpleBlue]}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={20} color="#FFF" />
          </LinearGradient>
          <View>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>DeVibe</Text>
            <Text style={{ color: colors.purple, fontSize: 11, fontWeight: "600" }}>CLOUD MOBILE</Text>
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

        {favorites.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Star size={14} color={colors.textMuted} />
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Recent Projects
              </Text>
            </View>
            {favorites.map((project, i) => (
              <TouchableOpacity
                key={project.id}
                onPress={() => openProject(project.id)}
                style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: FAVORITE_COLORS[i % FAVORITE_COLORS.length],
                  }}
                />
                <Text style={{ color: colors.textSecondary, fontSize: 14 }} numberOfLines={1}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ marginHorizontal: 16, marginTop: 24, borderRadius: radius.lg, overflow: "hidden" }}>
          <LinearGradient
            colors={["rgba(168,85,247,0.2)", "rgba(59,130,246,0.15)"]}
            style={{ padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg }}
          >
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 4 }}>
              Pro Plan
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 12 }}>
              Unlimited AI agents & cloud deploys
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("settings")}
              style={{
                backgroundColor: colors.purple,
                paddingVertical: 10,
                borderRadius: radius.md,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 13 }}>View Settings</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          {displayUser && displayUser.name !== "Guest" ? (
            <>
              {displayUser.avatarUrl ? (
                <Image
                  source={{ uri: displayUser.avatarUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <LinearGradient
                  colors={[...gradients.purpleBlue]}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "700" }}>
                    {displayUser.name.charAt(0).toUpperCase()}
                  </Text>
                </LinearGradient>
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>
                  {displayUser.name}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  {displayUser.email || "Connected"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("repositories")}>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <LinearGradient
                colors={[...gradients.purpleBlue]}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Github size={18} color="#FFF" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>
                  Sign in with GitHub
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  Access your repositories
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("repositories")}>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
