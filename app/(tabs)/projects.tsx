import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, FolderKanban, Github } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { colors, gradients, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";

const FILTERS = ["All", "Websites", "Apps", "Agents", "More"] as const;
const STATUS_COLORS = {
  deployed: colors.green,
  in_progress: colors.blue,
  draft: colors.muted,
};

const FILTER_MAP: Record<string, string | null> = {
  All: null,
  Websites: "website",
  Apps: "app",
  Agents: "agent",
  More: "api",
};

export default function ProjectsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const projects = useProjectStore((s) => s.projects);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = projects.filter((p) => {
    const cat = FILTER_MAP[filter];
    return !cat || p.category === cat;
  });

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Projects"
        subtitle={`${projects.length} active projects`}
        showSearch={false}
        showCredits={false}
        onMenuPress={openDrawer}
        onSearchPress={() => {}}
      />
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 12, gap: 10 }}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={{ padding: 8 }}>
          <Search size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 16 }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: radius.full,
              backgroundColor: filter === f ? "rgba(123, 97, 255, 0.2)" : colors.card,
              borderWidth: 1,
              borderColor: filter === f ? colors.purpleBrand : colors.border,
            }}
          >
            <Text
              style={{
                color: filter === f ? colors.purpleBrand : colors.textSecondary,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => {
              setActiveProject(project);
              router.push(`/project/${project.id}`);
            }}
            style={{ marginBottom: 12 }}
          >
            <GlassCard>
              <View style={{ padding: 14 }}>
                <View
                  style={{
                    height: 80,
                    borderRadius: radius.md,
                    backgroundColor: "rgba(123, 97, 255, 0.12)",
                    marginBottom: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FolderKanban size={28} color={colors.purpleBrand} />
                </View>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>{project.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
                  {project.type} · Updated {project.updatedAt}
                </Text>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: STATUS_COLORS[project.status],
                    position: "absolute",
                    top: 14,
                    right: 14,
                  }}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => router.push("/repositories")} style={{ marginTop: 8 }}>
          <GlassCard>
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Github size={18} color={colors.purpleBrand} />
              <Text style={{ color: colors.purpleBrand, fontWeight: "600" }}>Import from GitHub</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
