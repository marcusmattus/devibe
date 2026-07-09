import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { File, Folder, ChevronRight, ChevronDown, Plus } from "lucide-react-native";
import { useState } from "react";
import { colors, radius } from "../../constants/theme";
import { useProjectStore } from "../../stores/projectStore";
import { useEditorStore } from "../../stores/editorStore";
import type { ProjectFile } from "../../constants/sampleProject";

export function FileExplorer() {
  const activeProject = useProjectStore((s) => s.activeProject);
  const activeFile = useProjectStore((s) => s.activeFile);
  const setActiveFile = useProjectStore((s) => s.setActiveFile);
  const createProject = useProjectStore((s) => s.createProject);
  const setWorkspaceTab = useEditorStore((s) => s.setWorkspaceTab);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !(prev[folder] ?? true) }));
  };

  const isExpanded = (folder: string) => expandedFolders[folder] ?? true;

  const openFile = (file: ProjectFile) => {
    setActiveFile(file);
    setWorkspaceTab("editor");
  };

  if (!activeProject) {
    return (
      <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center" }}>
        <Folder size={36} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
          No project selected
        </Text>
        <TouchableOpacity
          onPress={() => createProject("New Expo App", "Expo + TypeScript")}
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: radius.md,
            backgroundColor: colors.purple,
          }}
        >
          <Plus size={16} color="#FFF" />
          <Text style={{ color: "#FFF", fontWeight: "600" }}>Create Project</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const folders = new Map<string, ProjectFile[]>();
  activeProject.files.forEach((file) => {
    const parts = file.path.split("/");
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "root";
    if (!folders.has(folder)) folders.set(folder, []);
    folders.get(folder)!.push(file);
  });

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
            paddingHorizontal: 4,
          }}
        >
          Explorer
        </Text>
        <Text
          style={{
            color: colors.text,
            fontWeight: "600",
            fontSize: 13,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          {activeProject.name}
        </Text>

        {Array.from(folders.entries()).map(([folder, files]) => {
          const expanded = isExpanded(folder);
          return (
            <View key={folder}>
              {folder !== "root" && (
                <TouchableOpacity
                  onPress={() => toggleFolder(folder)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    paddingHorizontal: 4,
                    gap: 6,
                  }}
                >
                  {expanded ? (
                    <ChevronDown size={14} color={colors.textMuted} />
                  ) : (
                    <ChevronRight size={14} color={colors.textMuted} />
                  )}
                  <Folder size={16} color={colors.blueNeon} />
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{folder}</Text>
                </TouchableOpacity>
              )}
              {expanded &&
                files.map((file) => {
                  const isActive = activeFile?.path === file.path;
                  return (
                    <TouchableOpacity
                      key={file.path}
                      onPress={() => openFile(file)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                        paddingLeft: folder !== "root" ? 28 : 8,
                        paddingRight: 8,
                        borderRadius: radius.sm,
                        backgroundColor: isActive ? "rgba(168, 85, 247, 0.15)" : "transparent",
                        gap: 8,
                      }}
                    >
                      <File size={15} color={isActive ? colors.purple : colors.textMuted} />
                      <Text
                        style={{
                          color: isActive ? colors.purple : colors.textSecondary,
                          fontSize: 13,
                          fontWeight: isActive ? "600" : "400",
                        }}
                      >
                        {file.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
