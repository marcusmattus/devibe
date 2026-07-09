import { View, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";
import { router } from "expo-router";
import { GlassCard } from "../ui/GlassCard";

const STATUS_COLORS = {
  deployed: colors.green,
  in_progress: colors.blue,
  draft: colors.muted,
};

const STATUS_LABELS = {
  deployed: "Deployed",
  in_progress: "In Progress",
  draft: "Draft",
};

export function RecentProjects() {
  const projects = useProjectStore((s) => s.projects);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        Recent Projects
      </Text>
      <GlassCard>
        {projects.map((project, index) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => {
              setActiveProject(project);
              router.push("/workspace");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: index < projects.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
                {project.name}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                {project.type} · {project.updatedAt}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: STATUS_COLORS[project.status],
                }}
              />
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {STATUS_LABELS[project.status]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </GlassCard>
    </View>
  );
}
