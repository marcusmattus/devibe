import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Globe,
  Layout,
  Smartphone,
  Bot,
  Workflow,
  Server,
  FileCode,
  ChevronRight,
} from "lucide-react-native";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { CREATE_OPTIONS } from "../../constants/sampleProject";
import { colors, gradients, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";

const ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  website: Globe,
  webapp: Layout,
  mobile: Smartphone,
  agent: Bot,
  workflow: Workflow,
  api: Server,
  blank: FileCode,
};

export default function CreateScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const createProject = useProjectStore((s) => s.createProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const projects = useProjectStore((s) => s.projects);

  const handleCreate = (option: (typeof CREATE_OPTIONS)[number]) => {
    if (option.id === "workflow") {
      router.push("/workflows");
      return;
    }
    if (option.id === "agent") {
      router.push("/(tabs)/agents");
      return;
    }
    const name =
      option.id === "blank"
        ? "New Project"
        : `New ${option.label}`;
    createProject(name, option.label);
    const latest = useProjectStore.getState().projects[0];
    setActiveProject(latest ?? projects[0]);
    router.push("/workspace");
  };

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Create New"
        subtitle="What do you want to build?"
        showSearch={false}
        showCredits={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {CREATE_OPTIONS.map((option) => {
          const Icon = ICONS[option.id] ?? FileCode;
          return (
            <TouchableOpacity key={option.id} onPress={() => handleCreate(option)} style={{ marginBottom: 10 }}>
              <GlassCard>
                <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      backgroundColor: `${option.color}22`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} color={option.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>{option.label}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                      {option.description}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textMuted} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}
