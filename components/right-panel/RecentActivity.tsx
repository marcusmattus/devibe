import { View, Text } from "react-native";
import { Rocket, Hammer, Bug, Bot, Cloud } from "lucide-react-native";
import { colors } from "../../constants/theme";
import { useCloudStore } from "../../stores/cloudStore";
import { GlassCard } from "../ui/GlassCard";
import type { ActivityItem } from "../../stores/cloudStore";

const ICONS: Record<ActivityItem["type"], React.ComponentType<{ size: number; color: string }>> = {
  deploy: Rocket,
  build: Hammer,
  fix: Bug,
  agent: Bot,
  infra: Cloud,
};

const ICON_COLORS: Record<ActivityItem["type"], string> = {
  deploy: colors.purple,
  build: colors.blue,
  fix: colors.red,
  agent: colors.green,
  infra: colors.orange,
};

export function RecentActivity() {
  const activities = useCloudStore((s) => s.activities);

  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12 }}>
          Recent Activity
        </Text>
        {activities.slice(0, 5).map((activity, index) => {
          const Icon = ICONS[activity.type];
          return (
            <View
              key={activity.id}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
                paddingBottom: index < 4 ? 12 : 0,
                marginBottom: index < 4 ? 12 : 0,
                borderBottomWidth: index < 4 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: `${ICON_COLORS[activity.type]}22`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={14} color={ICON_COLORS[activity.type]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{activity.action}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>
                  {activity.timestamp}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}
