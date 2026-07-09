import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Cloud, Server, Database, HardDrive, Activity, Rocket } from "lucide-react-native";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { colors, gradients, radius } from "../../constants/theme";
import { useCloudStore } from "../../stores/cloudStore";

const RESOURCE_ICONS = {
  compute: Server,
  database: Database,
  storage: HardDrive,
  cdn: Cloud,
  monitoring: Activity,
};

export default function CloudScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const resources = useCloudStore((s) => s.resources);
  const deployTargets = useCloudStore((s) => s.deployTargets);
  const selectedProvider = useCloudStore((s) => s.selectedProvider);
  const terraformStatus = useCloudStore((s) => s.terraformStatus);
  const setSelectedProvider = useCloudStore((s) => s.setSelectedProvider);
  const deploy = useCloudStore((s) => s.deploy);
  const generateTerraform = useCloudStore((s) => s.generateTerraform);

  const filteredResources = resources.filter((r) => r.provider === selectedProvider);

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Cloud Factory"
        subtitle="Production infrastructure at scale"
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          {(["aws", "gcp"] as const).map((provider) => (
            <TouchableOpacity
              key={provider}
              onPress={() => setSelectedProvider(provider)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: radius.md,
                backgroundColor: selectedProvider === provider ? "rgba(168, 85, 247, 0.2)" : colors.card,
                borderWidth: 1,
                borderColor: selectedProvider === provider ? colors.purple : colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: selectedProvider === provider ? colors.purple : colors.textSecondary,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  fontSize: 13,
                }}
              >
                {provider === "aws" ? "AWS" : "Google Cloud"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlowButton
          title={
            terraformStatus === "generating"
              ? "Generating Terraform..."
              : terraformStatus === "done"
                ? "Terraform Ready ✓"
                : "Generate Terraform Infrastructure"
          }
          onPress={() => generateTerraform()}
          disabled={terraformStatus === "generating"}
          style={{ marginBottom: 20 }}
        />

        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16, marginBottom: 12 }}>
          Cloud Resources ({selectedProvider.toUpperCase()})
        </Text>
        {filteredResources.length === 0 ? (
          <GlassCard style={{ marginBottom: 10 }}>
            <View style={{ padding: 16, alignItems: "center" }}>
              <Text style={{ color: colors.textMuted, textAlign: "center" }}>
                No resources yet. Generate Terraform to provision infrastructure.
              </Text>
            </View>
          </GlassCard>
        ) : (
          filteredResources.map((resource) => {
            const Icon = RESOURCE_ICONS[resource.type];
            return (
              <GlassCard key={resource.id} style={{ marginBottom: 10 }}>
                <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Icon size={20} color={colors.purple} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "500", fontSize: 14 }}>
                      {resource.name}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>{resource.cost}</Text>
                  </View>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: resource.status === "healthy" ? colors.green : colors.orange,
                    }}
                  />
                </View>
              </GlassCard>
            );
          })
        )}

        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16, marginTop: 20, marginBottom: 12 }}>
          Deploy Targets
        </Text>
        {deployTargets.map((target) => (
          <GlassCard key={target.id} style={{ marginBottom: 10 }}>
            <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Rocket size={20} color={colors.blue} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "500", fontSize: 14 }}>{target.name}</Text>
                {target.url && (
                  <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }} numberOfLines={1}>
                    {target.url}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => deploy(target.id)}
                disabled={target.status === "deploying"}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: radius.md,
                  backgroundColor:
                    target.status === "live"
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(168, 85, 247, 0.15)",
                }}
              >
                <Text
                  style={{
                    color: target.status === "live" ? colors.green : colors.purple,
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {target.status === "deploying" ? "Deploying..." : target.status}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}

        <GlassCard style={{ marginTop: 20 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 8 }}>
              Scalability Features
            </Text>
            {[
              "Auto-scaling Lambda / Cloud Run",
              "RDS / Cloud SQL with read replicas",
              "S3 / GCS with CDN distribution",
              "CloudWatch / Stackdriver monitoring",
              "Cost-optimized storage tiers",
              "Production bug fixing workflows",
            ].map((feature) => (
              <View key={feature} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.purple }} />
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{feature}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
