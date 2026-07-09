import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Code2,
  Eye,
  MessageSquare,
  FolderTree,
  PanelRight,
} from "lucide-react-native";
import { TopBar } from "../../components/layout/TopBar";
import { MonacoEditor } from "../../components/workspace/MonacoEditor";
import { FileExplorer } from "../../components/workspace/FileExplorer";
import { LivePreview } from "../../components/workspace/LivePreview";
import { AgentChat, AgentTeamBar } from "../../components/workspace/AgentChat";
import { colors, radius } from "../../constants/theme";
import { useEditorStore, type WorkspaceTab } from "../../stores/editorStore";
import { useProjectStore } from "../../stores/projectStore";

const TABS: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: "explorer", label: "Files", icon: FolderTree },
  { id: "editor", label: "Editor", icon: Code2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
];

export default function WorkspaceScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const workspaceTab = useEditorStore((s) => s.workspaceTab);
  const setWorkspaceTab = useEditorStore((s) => s.setWorkspaceTab);
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const toggleRightPanel = useEditorStore((s) => s.toggleRightPanel);
  const activeProject = useProjectStore((s) => s.activeProject);
  const activeFile = useProjectStore((s) => s.activeFile);
  const updateFileContent = useProjectStore((s) => s.updateFileContent);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={["#0F0F1A", "#0A0A0F"]} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingTop: insets.top + 8, paddingHorizontal: 12 }}>
          <View style={{ flex: 1 }}>
            <TopBar
              greeting={activeProject?.name ?? "Workspace"}
              subtitle={activeFile?.path ?? "Select a file"}
              showSearch={false}
              showCredits={false}
              onMenuPress={openDrawer}
            />
          </View>
          <TouchableOpacity onPress={toggleRightPanel} style={{ padding: 8, marginTop: 8 }}>
            <PanelRight size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <AgentTeamBar />

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
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                  borderRadius: radius.sm,
                  backgroundColor: isActive ? "rgba(168, 85, 247, 0.2)" : "transparent",
                  gap: 6,
                }}
              >
                <Icon size={16} color={isActive ? colors.purple : colors.textMuted} />
                <Text
                  style={{
                    color: isActive ? colors.purple : colors.textMuted,
                    fontSize: 12,
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1, marginHorizontal: 12, marginBottom: insets.bottom + 8, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
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
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{activeFile.path}</Text>
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
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.textMuted }}>Select a file from the explorer</Text>
            </View>
          )}
          {workspaceTab === "preview" && <LivePreview />}
          {workspaceTab === "chat" && <AgentChat />}
        </View>

        <TouchableOpacity
          onPress={() => setCommandPaletteOpen(true)}
          style={{
            position: "absolute",
            bottom: insets.bottom + 16,
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
      </LinearGradient>
    </View>
  );
}
