import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Workflow, Rocket, Bug, Sparkles, Cloud, GitBranch } from "lucide-react-native";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { colors, gradients, radius } from "../../constants/theme";
import { router } from "expo-router";

const WORKFLOWS = [
  {
    id: "new-feature",
    title: "New Feature Development",
    description: "AI agents scaffold, implement, and test new features in your Expo app",
    icon: Sparkles,
    color: colors.purple,
    steps: ["Describe feature", "Agent implements", "Preview & test", "Deploy"],
  },
  {
    id: "bug-fix",
    title: "Production Bug Fixing",
    description: "Connect cloud logs → diagnose → patch code → safe deploy",
    icon: Bug,
    color: colors.red,
    steps: ["Connect logs", "AI diagnosis", "Generate patch", "Deploy fix"],
  },
  {
    id: "cloud-gen",
    title: "Cloud Infrastructure",
    description: "Generate Terraform for AWS/GCP with auto-scaling and monitoring",
    icon: Cloud,
    color: colors.orange,
    steps: ["Describe stack", "Generate Terraform", "Review plan", "Apply"],
  },
  {
    id: "deploy",
    title: "Expo to Production",
    description: "EAS build → App Store / Play Store with one-click deploy",
    icon: Rocket,
    color: colors.blue,
    steps: ["Configure EAS", "Build", "Submit", "Go live"],
  },
  {
    id: "scale",
    title: "Scale to 100k+ Users",
    description: "Optimize database, CDN, auto-scaling, and cost management",
    icon: GitBranch,
    color: colors.green,
    steps: ["Audit infra", "Optimize", "Load test", "Monitor"],
  },
];

export default function WorkflowsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Workflows"
        subtitle="Automated pipelines for production apps"
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {WORKFLOWS.map((workflow) => {
          const Icon = workflow.icon;
          return (
            <TouchableOpacity
              key={workflow.id}
              onPress={() => {
                if (workflow.id === "cloud-gen") router.push("/cloud");
                else if (workflow.id === "bug-fix" || workflow.id === "new-feature") router.push("/workspace");
                else router.push("/cloud");
              }}
            >
              <GlassCard style={{ marginBottom: 16 }} glow="purple">
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.md,
                        backgroundColor: `${workflow.color}22`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={22} color={workflow.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>{workflow.title}</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{workflow.description}</Text>
                    </View>
                    <Workflow size={18} color={colors.textMuted} />
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {workflow.steps.map((step, i) => (
                      <View
                        key={step}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "rgba(168, 85, 247, 0.15)",
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: radius.full,
                          }}
                        >
                          <Text style={{ color: colors.purple, fontSize: 11, fontWeight: "500" }}>
                            {i + 1}. {step}
                          </Text>
                        </View>
                        {i < workflow.steps.length - 1 && (
                          <Text style={{ color: colors.textMuted }}>→</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}
