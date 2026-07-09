import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shield, Clock, Smartphone, Globe, XCircle } from "lucide-react-native";
import { router } from "expo-router";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { GitHubConnectCard } from "../../components/github/GitHubConnectCard";
import { AuditLogList } from "../../components/agentic/AuditLogList";
import { colors, gradients, radius } from "../../constants/theme";
import { useAuthStore } from "../../stores/authStore";
import {
  useAgenticAuthStore,
  formatSessionExpiry,
  isSessionExpired,
} from "../../stores/agenticAuthStore";

export default function AccessControlScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const isSignedIn = useAuthStore((s) => s.isAuthenticated && s.authProvider !== "guest");
  const hasGitHub = useAuthStore((s) => !!s.accessToken);
  const signOut = useAuthStore((s) => s.signOut);
  const sessions = useAgenticAuthStore((s) => s.sessions);
  const revokeSession = useAgenticAuthStore((s) => s.revokeSession);
  const revokeAllSessions = useAgenticAuthStore((s) => s.revokeAllSessions);
  const ipAllowlistEnabled = useAgenticAuthStore((s) => s.ipAllowlistEnabled);
  const setIpAllowlistEnabled = useAgenticAuthStore((s) => s.setIpAllowlistEnabled);
  const user = useAuthStore((s) => s.user);

  const activeSessions = sessions.filter((s) => s.status === "active" && !isSessionExpired(s));

  const handleSignOut = async () => {
    if (user) await revokeAllSessions(user.login);
    await signOut();
    router.replace("/login");
  };

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Access Control"
        subtitle="Agentic repo sessions, permissions & audit logs"
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GitHubConnectCard showTokenFallback={hasGitHub} />

        {isSignedIn && (
          <>
            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 16,
                marginTop: 24,
                marginBottom: 12,
              }}
            >
              Security Settings
            </Text>
            <GlassCard style={{ marginBottom: 20 }}>
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>
                      IP Allowlisting
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>
                      Restrict sessions to registered device fingerprints
                    </Text>
                  </View>
                  <Switch
                    value={ipAllowlistEnabled}
                    onValueChange={setIpAllowlistEnabled}
                    trackColor={{ false: colors.muted, true: colors.purple }}
                    thumbColor="#FFF"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 16,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <Smartphone size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    Device fingerprinting active on this device
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <Globe size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    AI anomaly detection monitors access patterns
                  </Text>
                </View>
              </View>
            </GlassCard>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>
                Active Sessions ({activeSessions.length})
              </Text>
              {activeSessions.length > 0 && (
                <TouchableOpacity onPress={() => user && revokeAllSessions(user.login)}>
                  <Text style={{ color: colors.red, fontSize: 12, fontWeight: "600" }}>
                    Revoke All
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {activeSessions.length === 0 ? (
              <GlassCard style={{ marginBottom: 20 }}>
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Shield size={28} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, marginTop: 10, textAlign: "center" }}>
                    No active repo sessions. Import a repository to create a scoped session.
                  </Text>
                </View>
              </GlassCard>
            ) : (
              activeSessions.map((session) => (
                <GlassCard key={session.id} glow="purple" style={{ marginBottom: 10 }}>
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Shield size={18} color={colors.purple} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>
                          {session.repoFullName}
                        </Text>
                        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                          {session.scopes.contents} ·{" "}
                          {session.scopes.folders.length
                            ? session.scopes.folders.join(", ")
                            : "full repo"}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => revokeSession(session.id, session.createdBy)}>
                        <XCircle size={20} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 16,
                        marginTop: 10,
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Clock size={12} color={colors.textMuted} />
                        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                          {formatSessionExpiry(session.expiresAt)}
                        </Text>
                      </View>
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                        {session.deviceLabel}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              ))
            )}

            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 16,
                marginTop: 8,
                marginBottom: 12,
              }}
            >
              Audit Log
            </Text>
            <AuditLogList limit={15} />

            <GlowButton
              title="Sign Out"
              variant="secondary"
              onPress={handleSignOut}
              style={{ marginTop: 24 }}
            />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
