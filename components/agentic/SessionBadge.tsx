import { View, Text, TouchableOpacity } from "react-native";
import { Shield, Clock, XCircle } from "lucide-react-native";
import { colors, radius } from "../../constants/theme";
import { useAgenticAuthStore, formatSessionExpiry } from "../../stores/agenticAuthStore";

export function SessionBadge() {
  const session = useAgenticAuthStore((s) => s.getActiveSession());
  const revokeSession = useAgenticAuthStore((s) => s.revokeSession);

  if (!session) return null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 12,
        marginBottom: 8,
        padding: 10,
        borderRadius: radius.md,
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.3)",
        gap: 8,
      }}
    >
      <Shield size={16} color={colors.purple} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600" }} numberOfLines={1}>
          {session.repoFullName} · {session.scopes.contents}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
          <Clock size={10} color={colors.textMuted} />
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>
            {formatSessionExpiry(session.expiresAt)}
            {session.scopes.folders.length > 0
              ? ` · ${session.scopes.folders.join(", ")}`
              : " · full repo"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => revokeSession(session.id, session.createdBy)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <XCircle size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}
