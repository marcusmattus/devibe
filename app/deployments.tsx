import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Globe, CheckCircle, ExternalLink } from "lucide-react-native";
import { useOpenDrawer } from "../hooks/useOpenDrawer";
import { TopBar } from "../components/layout/TopBar";
import { GlassCard } from "../components/ui/GlassCard";
import { colors, gradients, radius } from "../constants/theme";
import { useCloudStore } from "../stores/cloudStore";

export default function DeploymentsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const deployTargets = useCloudStore((s) => s.deployTargets);
  const activities = useCloudStore((s) => s.activities);
  const deploy = useCloudStore((s) => s.deploy);

  const production = deployTargets.find((t) => t.status === "live") ?? deployTargets[0];

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Deployments"
        subtitle="Production monitoring"
        showSearch={false}
        showCredits={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard glow="blue" style={{ marginBottom: 20 }}>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Production</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20, marginTop: 4 }}>
                  {production?.url?.replace("https://", "") ?? "devibe.com"}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: radius.full,
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                }}
              >
                <Text style={{ color: colors.green, fontWeight: "700", fontSize: 11 }}>Live</Text>
              </View>
            </View>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: "rgba(0, 209, 255, 0.3)",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 209, 255, 0.05)",
                }}
              >
                <Globe size={48} color={colors.blueNeon} />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => production && deploy(production.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 12,
                borderRadius: radius.md,
                backgroundColor: "rgba(123, 97, 255, 0.15)",
              }}
            >
              <ExternalLink size={16} color={colors.purpleBrand} />
              <Text style={{ color: colors.purpleBrand, fontWeight: "600" }}>Open Live Site</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16, marginBottom: 12 }}>
          Recent Deployments
        </Text>
        {deployTargets.map((target) => (
          <GlassCard key={target.id} style={{ marginBottom: 10 }}>
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <CheckCircle
                size={20}
                color={target.status === "live" ? colors.green : colors.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "600" }}>{target.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {target.status === "live" ? "Production" : "Staging"} · {target.status}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deploy(target.id)}>
                <Text style={{ color: colors.purpleBrand, fontSize: 12, fontWeight: "600" }}>
                  {target.status === "deploying" ? "..." : "Deploy"}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}

        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16, marginTop: 12, marginBottom: 12 }}>
          Activity
        </Text>
        {activities.slice(0, 5).map((act) => (
          <View key={act.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{act.action}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{act.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
