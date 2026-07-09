import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bot, Shield, Cloud, TestTube, Layout, Server } from "lucide-react-native";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { AgentChat } from "../../components/workspace/AgentChat";
import { colors, radius } from "../../constants/theme";
import { useAgentStore } from "../../stores/agentStore";
import type { AgentRole } from "../../stores/agentStore";

const ROLE_ICONS: Record<AgentRole, React.ComponentType<{ size: number; color: string }>> = {
  orchestrator: Bot,
  frontend: Layout,
  backend: Server,
  cloud: Cloud,
  qa: TestTube,
  security: Shield,
};

const ROLE_COLORS: Record<AgentRole, string> = {
  orchestrator: colors.purple,
  frontend: colors.blue,
  backend: colors.green,
  cloud: colors.orange,
  qa: colors.red,
  security: "#EC4899",
};

export default function AgentsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const agents = useAgentStore((s) => s.agents);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={["#0F0F1A", "#0A0A0F"]} style={{ flex: 1 }}>
        <TopBar
          greeting="AI Agents"
          subtitle="Multi-agent team for vibe coding"
          showSearch={false}
          onMenuPress={openDrawer}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 12 }}
        >
          {agents.map((agent) => {
            const Icon = ROLE_ICONS[agent.role];
            return (
              <GlassCard key={agent.id} glow={agent.status === "active" ? "purple" : "none"}>
                <View style={{ padding: 16, width: 160 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: `${ROLE_COLORS[agent.role]}22`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Icon size={20} color={ROLE_COLORS[agent.role]} />
                  </View>
                  <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>{agent.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }} numberOfLines={2}>
                    {agent.description}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: agent.status === "active" ? colors.green : colors.muted,
                      }}
                    />
                    <Text style={{ color: colors.textSecondary, fontSize: 11, textTransform: "capitalize" }}>
                      {agent.status}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            );
          })}
        </ScrollView>

        <View style={{ flex: 1, marginHorizontal: 16, marginBottom: insets.bottom + 8, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
          <AgentChat />
        </View>
      </LinearGradient>
    </View>
  );
}
