import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Github, Lock, Star, GitBranch, FolderGit2 } from "lucide-react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GitHubConnectCard } from "../../components/github/GitHubConnectCard";
import { colors, gradients, radius } from "../../constants/theme";
import { useAuthStore } from "../../stores/authStore";
import { useGitHubRepos } from "../../hooks/useGitHubRepos";
import { useProjectStore } from "../../stores/projectStore";

export default function RepositoriesScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.accessToken);
  const importGitHubRepo = useProjectStore((s) => s.importGitHubRepo);
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: repos, isLoading, isRefetching, refetch, error } = useGitHubRepos();
  const [importingId, setImportingId] = useState<number | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImport = async (repo: NonNullable<typeof repos>[number]) => {
    if (!accessToken) return;
    setImportingId(repo.id);
    setImportError(null);
    try {
      await importGitHubRepo(repo, accessToken);
      router.push("/workspace");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import repository");
    } finally {
      setImportingId(null);
    }
  };

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Repositories"
        subtitle={user ? "Import a GitHub repo into your workspace" : "Sign in to access your repos"}
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          user ? (
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              tintColor={colors.purple}
            />
          ) : undefined
        }
      >
        <GitHubConnectCard />

        {user && (
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
              Your Repositories
            </Text>

            {isLoading && (
              <View style={{ padding: 32, alignItems: "center" }}>
                <ActivityIndicator color={colors.purple} size="large" />
                <Text style={{ color: colors.textMuted, marginTop: 12 }}>Loading repositories...</Text>
              </View>
            )}

            {error && (
              <GlassCard style={{ marginBottom: 12 }}>
                <View style={{ padding: 16 }}>
                  <Text style={{ color: colors.red, fontSize: 13 }}>
                    {error instanceof Error ? error.message : "Failed to load repositories"}
                  </Text>
                </View>
              </GlassCard>
            )}

            {importError && (
              <Text style={{ color: colors.red, fontSize: 12, marginBottom: 12 }}>{importError}</Text>
            )}

            {repos?.map((repo) => {
              const isImporting = importingId === repo.id;
              return (
                <GlassCard key={repo.id} style={{ marginBottom: 10 }}>
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: radius.md,
                          backgroundColor: "rgba(168, 85, 247, 0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FolderGit2 size={20} color={colors.purple} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
                            {repo.name}
                          </Text>
                          {repo.private && <Lock size={12} color={colors.textMuted} />}
                        </View>
                        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                          {repo.owner.login}
                        </Text>
                        {repo.description && (
                          <Text
                            style={{ color: colors.textSecondary, fontSize: 12, marginTop: 6 }}
                            numberOfLines={2}
                          >
                            {repo.description}
                          </Text>
                        )}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginTop: 8,
                          }}
                        >
                          {repo.language && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                              <Star size={11} color={colors.textMuted} />
                              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                                {repo.language}
                              </Text>
                            </View>
                          )}
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                            <GitBranch size={11} color={colors.textMuted} />
                            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                              {repo.default_branch}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleImport(repo)}
                      disabled={isImporting}
                      style={{
                        marginTop: 12,
                        paddingVertical: 10,
                        borderRadius: radius.md,
                        backgroundColor: "rgba(168, 85, 247, 0.15)",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                        opacity: isImporting ? 0.6 : 1,
                      }}
                    >
                      {isImporting ? (
                        <ActivityIndicator color={colors.purple} size="small" />
                      ) : (
                        <Github size={14} color={colors.purple} />
                      )}
                      <Text style={{ color: colors.purple, fontWeight: "600", fontSize: 13 }}>
                        {isImporting ? "Importing..." : "Open in Workspace"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              );
            })}

            {repos && repos.length === 0 && !isLoading && (
              <GlassCard>
                <View style={{ padding: 24, alignItems: "center" }}>
                  <Github size={32} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                    No repositories found on your GitHub account.
                  </Text>
                </View>
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
