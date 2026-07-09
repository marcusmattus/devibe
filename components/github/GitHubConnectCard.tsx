import { View, Text, TextInput, Image, ActivityIndicator } from "react-native";
import { Github, LogOut, KeyRound } from "lucide-react-native";
import { useState } from "react";
import { colors, radius } from "../../constants/theme";
import { config } from "../../constants/config";
import { useAuthStore } from "../../stores/authStore";
import { GlassCard } from "../ui/GlassCard";
import { GlowButton } from "../ui/GlowButton";

interface GitHubConnectCardProps {
  showTokenFallback?: boolean;
}

export function GitHubConnectCard({ showTokenFallback = true }: GitHubConnectCardProps) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const deviceFlow = useAuthStore((s) => s.deviceFlow);
  const startDeviceFlow = useAuthStore((s) => s.startDeviceFlow);
  const signInWithToken = useAuthStore((s) => s.signInWithToken);
  const signOut = useAuthStore((s) => s.signOut);
  const clearError = useAuthStore((s) => s.clearError);
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  if (user) {
    return (
      <GlassCard glow="purple">
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Image
              source={{ uri: user.avatar_url }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
                {user.name ?? user.login}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>@{user.login}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                {user.public_repos} public repos
              </Text>
            </View>
            <Github size={22} color={colors.textSecondary} />
          </View>
          <GlowButton
            title="Sign Out"
            variant="secondary"
            icon={<LogOut size={16} color={colors.purple} />}
            onPress={() => signOut()}
          />
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Github size={22} color={colors.text} />
          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
            Connect GitHub
          </Text>
        </View>

        <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
          Sign in to browse your repositories and import code into the DeVibe workspace.
        </Text>

        {!config.github.isConfigured && (
          <View
            style={{
              backgroundColor: "rgba(249, 115, 22, 0.1)",
              borderRadius: radius.md,
              padding: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "rgba(249, 115, 22, 0.3)",
            }}
          >
            <Text style={{ color: colors.orange, fontSize: 12, lineHeight: 18 }}>
              Set EXPO_PUBLIC_GITHUB_CLIENT_ID to enable OAuth device flow, or use a personal
              access token below.
            </Text>
          </View>
        )}

        {deviceFlow && (
          <View
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              borderRadius: radius.md,
              padding: 14,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "rgba(168, 85, 247, 0.3)",
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 8 }}>
              Enter this code on GitHub:
            </Text>
            <Text
              style={{
                color: colors.purple,
                fontSize: 22,
                fontWeight: "700",
                letterSpacing: 2,
                textAlign: "center",
              }}
            >
              {deviceFlow.userCode}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8, textAlign: "center" }}>
              Waiting for authorization...
            </Text>
          </View>
        )}

        {error && (
          <Text
            onPress={clearError}
            style={{ color: colors.red, fontSize: 12, marginBottom: 12, lineHeight: 18 }}
          >
            {error}
          </Text>
        )}

        {config.github.isConfigured && (
          <GlowButton
            title={isLoading ? "Connecting..." : "Sign in with GitHub"}
            icon={isLoading ? <ActivityIndicator color="#FFF" size="small" /> : <Github size={18} color="#FFF" />}
            onPress={() => startDeviceFlow()}
            disabled={isLoading}
            style={{ marginBottom: showTokenFallback ? 12 : 0 }}
          />
        )}

        {showTokenFallback && (
          <>
            {!showTokenInput ? (
              <GlowButton
                title="Use Personal Access Token"
                variant="ghost"
                icon={<KeyRound size={16} color={colors.textSecondary} />}
                onPress={() => setShowTokenInput(true)}
                disabled={isLoading}
              />
            ) : (
              <View style={{ gap: 10 }}>
                <TextInput
                  value={token}
                  onChangeText={setToken}
                  placeholder="ghp_..."
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    color: colors.text,
                    fontSize: 14,
                  }}
                />
                <GlowButton
                  title="Connect with Token"
                  variant="secondary"
                  onPress={() => signInWithToken(token)}
                  disabled={isLoading || !token.trim()}
                  loading={isLoading}
                />
              </View>
            )}
          </>
        )}
      </View>
    </GlassCard>
  );
}
