import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Search,
  FileCode,
  Bot,
  Cloud,
  Rocket,
  Bug,
  Settings,
  GitBranch,
  Palette,
} from "lucide-react-native";
import { useState, useMemo } from "react";
import { colors, radius } from "../../constants/theme";
import { useEditorStore } from "../../stores/editorStore";
import { router } from "expo-router";

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const open = useEditorStore((s) => s.commandPaletteOpen);
  const setOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const [query, setQuery] = useState("");

  const commands: Command[] = useMemo(
    () => [
      {
        id: "workspace",
        label: "Open Workspace",
        description: "Monaco Editor + Live Preview",
        icon: FileCode,
        category: "Navigation",
        action: () => {
          setOpen(false);
          router.push("/workspace");
        },
      },
      {
        id: "agents",
        label: "Open AI Agents",
        description: "Multi-agent team chat",
        icon: Bot,
        category: "Navigation",
        action: () => {
          setOpen(false);
          router.push("/agents");
        },
      },
      {
        id: "cloud",
        label: "Cloud Factory",
        description: "Generate Terraform infrastructure",
        icon: Cloud,
        category: "Navigation",
        action: () => {
          setOpen(false);
          router.push("/cloud");
        },
      },
      {
        id: "deploy",
        label: "Deploy to Production",
        description: "EAS, Vercel, AWS, or GCP",
        icon: Rocket,
        category: "Actions",
        action: () => {
          setOpen(false);
          router.push("/cloud");
        },
      },
      {
        id: "fix-bug",
        label: "Fix Production Bug",
        description: "Analyze logs and generate patches",
        icon: Bug,
        category: "Actions",
        action: () => {
          setOpen(false);
          router.push("/workspace");
        },
      },
      {
        id: "git",
        label: "Git: View Changes",
        description: "Simulated git diff view",
        icon: GitBranch,
        category: "Git",
        action: () => setOpen(false),
      },
      {
        id: "theme",
        label: "Toggle Editor Theme",
        description: "DeVibe Dark / VS Dark",
        icon: Palette,
        category: "Settings",
        action: () => setOpen(false),
      },
      {
        id: "settings",
        label: "Open Settings",
        description: "API keys, preferences",
        icon: Settings,
        category: "Settings",
        action: () => {
          setOpen(false);
          router.push("/settings");
        },
      },
    ],
    [setOpen]
  );

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [...new Set(filtered.map((c) => c.category))];

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-start",
          paddingTop: 100,
          paddingHorizontal: 20,
        }}
        onPress={() => setOpen(false)}
      >
        <Pressable
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
            maxHeight: "70%",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              gap: 12,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Type a command..."
              placeholderTextColor={colors.textMuted}
              autoFocus
              style={{ flex: 1, color: colors.text, fontSize: 16 }}
            />
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>ESC</Text>
            </View>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {categories.map((category) => (
              <View key={category}>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 11,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: 6,
                  }}
                >
                  {category}
                </Text>
                {filtered
                  .filter((c) => c.category === category)
                  .map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <TouchableOpacity
                        key={cmd.id}
                        onPress={cmd.action}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          gap: 12,
                        }}
                      >
                        <Icon size={18} color={colors.purple} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: colors.text, fontSize: 15, fontWeight: "500" }}>
                            {cmd.label}
                          </Text>
                          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                            {cmd.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
