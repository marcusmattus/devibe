import { View, Text } from "react-native";
import { colors, radius } from "../../constants/theme";
import { useAgentStore } from "../../stores/agentStore";
import { GlassCard } from "../ui/GlassCard";

export function ActiveAgents() {
  const agents = useAgentStore((s) => s.agents);
  const activeAgents = agents.filter((a) => a.status === "active");

  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
          Active Agents
        </Text>
        {activeAgents.map((agent) => (
          <View
            key={agent.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: "500" }}>{agent.name}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                {agent.description}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: radius.full,
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green }} />
              <Text style={{ color: colors.green, fontSize: 11, fontWeight: "600" }}>Active</Text>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}
