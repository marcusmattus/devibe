import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Shield, Lock, Clock, FolderTree, AlertTriangle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { colors, radius } from "../../constants/theme";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";
import type { GitHubRepo } from "../../lib/github/types";
import type { AccessScope, RepoAccessAnalysis } from "../../lib/agentic/types";
import { SESSION_DURATIONS, FOLDER_PRESETS } from "../../lib/agentic/types";
import { useAgenticAuthStore } from "../../stores/agenticAuthStore";
import { useAuthStore } from "../../stores/authStore";

interface AgenticLoginModalProps {
  visible: boolean;
  repo: GitHubRepo | null;
  onClose: () => void;
  onSessionCreated: (sessionId: string) => void;
}

export function AgenticLoginModal({
  visible,
  repo,
  onClose,
  onSessionCreated,
}: AgenticLoginModalProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const analyzeRepo = useAgenticAuthStore((s) => s.analyzeRepo);
  const createSession = useAgenticAuthStore((s) => s.createSession);

  const [analysis, setAnalysis] = useState<RepoAccessAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState(4);
  const [scopes, setScopes] = useState<AccessScope>({
    contents: "read",
    issues: false,
    pullRequests: false,
    folders: [],
  });

  useEffect(() => {
    if (!visible || !repo || !accessToken || !user) {
      setAnalysis(null);
      setError(null);
      return;
    }

    setLoading(true);
    analyzeRepo(repo, user.login, accessToken)
      .then((result) => {
        setAnalysis(result);
        setScopes(result.recommendedScopes);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Analysis failed"))
      .finally(() => setLoading(false));
  }, [visible, repo, accessToken, user, analyzeRepo]);

  const handleCreateSession = async () => {
    if (!repo || !accessToken || !user) return;
    setCreating(true);
    setError(null);
    try {
      const session = await createSession(repo, user.login, accessToken, scopes, durationHours);
      onSessionCreated(session.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  const riskColor =
    analysis?.riskLevel === "high"
      ? colors.red
      : analysis?.riskLevel === "medium"
        ? colors.orange
        : colors.green;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: "90%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Shield size={22} color={colors.purple} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>
                  Agentic Repo Access
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                  {repo?.full_name ?? "Repository"}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
            {loading && (
              <View style={{ padding: 24, alignItems: "center" }}>
                <ActivityIndicator color={colors.purple} />
                <Text style={{ color: colors.textMuted, marginTop: 12 }}>
                  Security Agent analyzing repository access...
                </Text>
              </View>
            )}

            {analysis && (
              <>
                <GlassCard glow="purple" style={{ marginBottom: 16 }}>
                  <View style={{ padding: 14 }}>
                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 8 }}>
                      Agent Assessment
                    </Text>
                    <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20 }}>
                      {analysis.agentSummary}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 12,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: radius.full,
                          backgroundColor: `${riskColor}22`,
                        }}
                      >
                        <Text style={{ color: riskColor, fontSize: 11, fontWeight: "600" }}>
                          Risk: {analysis.riskLevel.toUpperCase()} ({analysis.riskScore})
                        </Text>
                      </View>
                      {analysis.isPrivate && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Lock size={12} color={colors.textMuted} />
                          <Text style={{ color: colors.textMuted, fontSize: 11 }}>Private</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </GlassCard>

                {analysis.anomalies.length > 0 && (
                  <View
                    style={{
                      backgroundColor: "rgba(249, 115, 22, 0.1)",
                      borderRadius: radius.md,
                      padding: 12,
                      marginBottom: 16,
                      borderWidth: 1,
                      borderColor: "rgba(249, 115, 22, 0.3)",
                    }}
                  >
                    {analysis.anomalies.map((a) => (
                      <View
                        key={a}
                        style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}
                      >
                        <AlertTriangle size={14} color={colors.orange} />
                        <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1 }}>
                          {a}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 10 }}>
                  Session Duration
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {SESSION_DURATIONS.map((d) => (
                    <TouchableOpacity
                      key={d.hours}
                      onPress={() => setDurationHours(d.hours)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: radius.full,
                        borderWidth: 1,
                        borderColor: durationHours === d.hours ? colors.purple : colors.border,
                        backgroundColor:
                          durationHours === d.hours ? "rgba(168, 85, 247, 0.15)" : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          color: durationHours === d.hours ? colors.purple : colors.textSecondary,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 10 }}>
                  Permission Scope
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                  {(["read", "write"] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setScopes((s) => ({ ...s, contents: level }))}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor: scopes.contents === level ? colors.purple : colors.border,
                        backgroundColor:
                          scopes.contents === level ? "rgba(168, 85, 247, 0.1)" : colors.card,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: scopes.contents === level ? colors.purple : colors.textSecondary,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ color: colors.text, fontWeight: "600", marginBottom: 10 }}>
                  Folder Scope
                </Text>
                <View style={{ gap: 8, marginBottom: 20 }}>
                  {FOLDER_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.label}
                      onPress={() => setScopes((s) => ({ ...s, folders: [...preset.value] }))}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        padding: 12,
                        borderRadius: radius.md,
                        borderWidth: 1,
                        borderColor:
                          JSON.stringify(scopes.folders) === JSON.stringify(preset.value)
                            ? colors.purple
                            : colors.border,
                        backgroundColor: colors.card,
                      }}
                    >
                      <FolderTree size={16} color={colors.purple} />
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 20,
                    padding: 12,
                    backgroundColor: colors.surface,
                    borderRadius: radius.md,
                  }}
                >
                  <Clock size={14} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    Session auto-revokes on expiry. All actions are audit-logged.
                  </Text>
                </View>
              </>
            )}

            {error && (
              <Text style={{ color: colors.red, fontSize: 13, marginBottom: 12 }}>{error}</Text>
            )}

            <GlowButton
              title={creating ? "Creating Session..." : "Grant Scoped Access"}
              onPress={handleCreateSession}
              disabled={loading || creating || !analysis}
              loading={creating}
            />
            <GlowButton
              title="Cancel"
              variant="ghost"
              onPress={onClose}
              style={{ marginTop: 10 }}
            />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
