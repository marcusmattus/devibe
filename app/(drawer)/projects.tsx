import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, FolderKanban } from "lucide-react-native";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { colors, gradients, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";
import { useEditorStore } from "../../stores/editorStore";
import { router } from "expo-router";

const STATUS_COLORS = {
  deployed: colors.green,
  in_progress: colors.blue,
  draft: colors.muted,
};

export default function ProjectsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const projects = useProjectStore((s) => s.projects);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const createProject = useProjectStore((s) => s.createProject);
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Projects"
        subtitle={`${projects.length} active projects`}
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GlowButton
          title="New Project"
          icon={<Plus size={18} color="#FFF" />}
          onPress={() => createProject("New Expo App", "Expo + TypeScript")}
          style={{ marginBottom: 20 }}
        />

        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => {
              setActiveProject(project);
              router.push("/workspace");
            }}
            style={{ marginBottom: 12 }}
          >
            <GlassCard>
              <View
                style={{
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.md,
                    backgroundColor: "rgba(168, 85, 247, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FolderKanban size={24} color={colors.purple} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>
                    {project.name}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                    {project.type} · {project.updatedAt}
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: STATUS_COLORS[project.status],
                  }}
                />
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}