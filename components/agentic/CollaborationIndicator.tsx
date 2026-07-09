import { View, Text, TouchableOpacity } from "react-native";
import { Users } from "lucide-react-native";
import { colors, radius } from "../../constants/theme";
import { useAgenticAuthStore } from "../../stores/agenticAuthStore";

export function CollaborationIndicator() {
  const session = useAgenticAuthStore((s) => s.getActiveSession());

  if (!session) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 12,
        marginBottom: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: radius.md,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(59, 130, 246, 0.25)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Users size={14} color={colors.blueNeon} />
        <Text style={{ color: colors.blueNeon, fontSize: 12, fontWeight: "600" }}>
          Remote session active
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.green,
          }}
        />
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
          @{session.createdBy} · audited
        </Text>
      </View>
    </View>
  );
}
