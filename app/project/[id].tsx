import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import { Eye, Code2, MoreHorizontal } from "lucide-react-native";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { colors, gradients, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const projects = useProjectStore((s) => s.projects);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.textMuted }}>Project not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.purpleBrand }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = project.progress ?? 50;
  const completed = project.tasksCompleted ?? 0;
  const total = project.tasksTotal ?? 10;
  const size = 120;
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  const openWorkspace = () => {
    setActiveProject(project);
    router.push("/workspace");
  };

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting={project.name}
        subtitle={`${project.type} · ${project.status === "in_progress" ? "In Progress" : project.status}`}
        showSearch={false}
        showCredits={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard glow="purple" style={{ marginBottom: 20 }}>
          <View style={{ padding: 24, alignItems: "center" }}>
            <View style={{ width: size, height: size, marginBottom: 16 }}>
              <Svg width={size} height={size}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={8}
                  fill="none"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={colors.purpleBrand}
                  strokeWidth={8}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${size / 2}, ${size / 2}`}
                />
              </Svg>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.text, fontSize: 28, fontWeight: "700" }}>{progress}%</Text>
              </View>
            </View>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>
              {progress >= 75 ? "Almost there! Keep going." : "Making great progress"}
            </Text>
          </View>
        </GlassCard>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Tasks", value: `${completed}/${total}` },
            { label: "Completed", value: String(completed) },
            { label: "Members", value: String(project.members ?? 1) },
          ].map((stat) => (
            <GlassCard key={stat.label} style={{ flex: 1 }}>
              <View style={{ padding: 14, alignItems: "center" }}>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{stat.label}</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18, marginTop: 4 }}>
                  {stat.value}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>

        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16, marginBottom: 12 }}>
          Recent Activity
        </Text>
        <GlassCard style={{ marginBottom: 20 }}>
          {(project.activities ?? [{ title: "Project created", time: project.updatedAt }]).map(
            (act, i, arr) => (
              <View
                key={act.title}
                style={{
                  padding: 14,
                  borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14 }}>{act.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>{act.time}</Text>
              </View>
            )
          )}
        </GlassCard>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <GlowButton title="Preview" icon={<Eye size={16} color="#FFF" />} onPress={openWorkspace} style={{ flex: 1 }} />
          <GlowButton title="Code" variant="secondary" icon={<Code2 size={16} color={colors.purpleBrand} />} onPress={openWorkspace} style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={openWorkspace}
            style={{
              width: 48,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <MoreHorizontal size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
