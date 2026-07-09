import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Code2, Eye, MessageSquare, FolderTree } from "lucide-react-native";
import { TopBar } from "../components/layout/TopBar";
import { MonacoEditor } from "../components/workspace/MonacoEditor";
import { FileExplorer } from "../components/workspace/FileExplorer";
import { LivePreview } from "../components/workspace/LivePreview";
import { AgentChat, AgentTeamBar } from "../components/workspace/AgentChat";
import { SessionBadge } from "../components/agentic/SessionBadge";
import { CollaborationIndicator } from "../components/agentic/CollaborationIndicator";
import { colors, gradients, radius } from "../constants/theme";
import { useEditorStore, type WorkspaceTab } from "../stores/editorStore";
import { useProjectStore } from "../stores/projectStore";

const TABS: {
  id: WorkspaceTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}[] = [
  { id: "explorer", label: "Files", shortLabel: "Files", icon: FolderTree },
  { id: "editor", label: "Editor", shortLabel: "Code", icon: Code2 },
  { id: "preview", label: "Preview", shortLabel: "View", icon: Eye },
  { id: "chat", label: "AI Chat", shortLabel: "AI", icon: MessageSquare },
];

export default function WorkspaceScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compactTabs = width < 380;
  const workspaceTab = useEditorStore((s) => s.workspaceTab);
  const setWorkspaceTab = useEditorStore((s) => s.setWorkspaceTab);
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const activeProject = useProjectStore((s) => s.activeProject);
  const activeFile = useProjectStore((s) => s.activeFile);
  const updateFileContent = useProjectStore((s) => s.updateFileContent);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
        <TopBar
          greeting={activeProject?.name ?? "Workspace"}
          subtitle={activeFile?.path ?? "Select a file from explorer"}
          showSearch={false}
          showCredits={false}
          onMenuPress={openDrawer}
        />

        <AgentTeamBar />
        <SessionBadge />
        <CollaborationIndicator />

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 12,
            marginBottom: 8,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = workspaceTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setWorkspaceTab(tab.id)}
                style={{
                  flex: 1,
                  flexDirection: compactTabs ? "column" : "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: compactTabs ? 8 : 8,
                  borderRadius: radius.sm,
                  backgroundColor: isActive ? "rgba(168, 85, 247, 0.2)" : "transparent",
                  gap: compactTabs ? 2 : 6,
                }}
              >
                <Icon size={16} color={isActive ? colors.purple : colors.textMuted} />
                {!compactTabs && (
                  <Text
                    style={{
                      color: isActive ? colors.purple : colors.textMuted,
                      fontSize: 12,
                      fontWeight: isActive ? "600" : "400",
                    }}
                  >
                    {tab.label}
                  </Text>
                )}
                {compactTabs && (
                  <Text
                    style={{
                      color: isActive ? colors.purple : colors.textMuted,
                      fontSize: 10,
                      fontWeight: isActive ? "600" : "400",
                      marginTop: 2,
                    }}
                  >
                    {tab.shortLabel}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            flex: 1,
            marginHorizontal: 12,
            marginBottom: insets.bottom + 8,
            borderRadius: radius.lg,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {workspaceTab === "explorer" && <FileExplorer />}
          {workspaceTab === "editor" && activeFile && (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  gap: 8,
                }}
              >
                <Code2 size={14} color={colors.purple} />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }} numberOfLines={1}>
                  {activeFile.path}
                </Text>
              </View>
              <MonacoEditor
                content={activeFile.content}
                language={activeFile.language}
                path={activeFile.path}
                onChange={(content) => updateFileContent(activeFile.path, content)}
                onCommandPalette={() => setCommandPaletteOpen(true)}
              />
            </View>
          )}
          {workspaceTab === "editor" && !activeFile && (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
              <FolderTree size={32} color={colors.textMuted} />
              <Text style={{ color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                Select a file from the Files tab to start editing
              </Text>
              <TouchableOpacity
                onPress={() => setWorkspaceTab("explorer")}
                style={{
                  marginTop: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: radius.md,
                  backgroundColor: "rgba(168, 85, 247, 0.15)",
                }}
              >
                <Text style={{ color: colors.purple, fontWeight: "600" }}>Open Files</Text>
              </TouchableOpacity>
            </View>
          )}
          {workspaceTab === "preview" && <LivePreview />}
          {workspaceTab === "chat" && <AgentChat />}
        </View>

        {workspaceTab !== "chat" && (
          <TouchableOpacity
            onPress={() => setCommandPaletteOpen(true)}
            style={{
              position: "absolute",
              bottom: insets.bottom + 24,
              right: 16,
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.purple,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: colors.purple,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>⌘</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}
