import { View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import { Bell, Search, Menu, PanelRight } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius } from "../../constants/theme";
import { useEditorStore } from "../../stores/editorStore";
import { useCloudStore } from "../../stores/cloudStore";

interface TopBarProps {
  greeting?: string;
  subtitle?: string;
  showSearch?: boolean;
  showCredits?: boolean;
  showPanel?: boolean;
  useSafeArea?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar({
  greeting,
  subtitle,
  showSearch = true,
  showCredits = true,
  showPanel = true,
  useSafeArea = true,
  onMenuPress,
  onSearchPress,
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const toggleRightPanel = useEditorStore((s) => s.toggleRightPanel);
  const credits = useCloudStore((s) => s.credits);
  const creditPercent = Math.round((credits.used / credits.total) * 100);
  const displayTitle = greeting ?? (subtitle && !greeting ? `${getGreeting()}, Marcus` : undefined);
  const showHeader = displayTitle !== undefined || subtitle !== undefined;

  return (
    <View
      style={{
        paddingTop: useSafeArea ? insets.top + 8 : 0,
        paddingHorizontal: 16,
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: showHeader || showSearch ? 12 : 0,
        }}
      >
        <TouchableOpacity onPress={onMenuPress} style={{ padding: 4 }}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {showCredits && (
            <TouchableOpacity
              onPress={toggleRightPanel}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.purple,
                  marginRight: 6,
                  shadowColor: colors.purple,
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }}
              />
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {creditPercent}% credits
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleRightPanel} style={{ padding: 4 }}>
            <Bell size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          {showPanel && (
            <TouchableOpacity onPress={toggleRightPanel} style={{ padding: 4 }}>
              <PanelRight size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showHeader && (
        <View style={{ marginBottom: showSearch ? 12 : 0 }}>
          {displayTitle && (
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
              {displayTitle} 👋
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 15,
                marginTop: displayTitle ? 4 : 0,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {showSearch && (
        <TouchableOpacity
          onPress={onSearchPress}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(26, 26, 40, 0.8)",
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 10,
          }}
        >
          <Search size={18} color={colors.textMuted} />
          <Text style={{ flex: 1, color: colors.textMuted, fontSize: 15 }}>
            Search projects, commands...
          </Text>
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {Platform.OS === "ios" ? "⌘K" : "Search"}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function FloatingChatBar({
  value,
  onChangeText,
  onSend,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(18, 18, 26, 0.98)",
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: "rgba(168, 85, 247, 0.15)",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ color: colors.purple, fontSize: 14, fontWeight: "700" }}>AI</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask AI to build, fix, or deploy..."
        placeholderTextColor={colors.textMuted}
        style={{
          flex: 1,
          color: colors.text,
          fontSize: 15,
          paddingVertical: 8,
        }}
        onSubmitEditing={onSend}
        returnKeyType="send"
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!value.trim()}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: value.trim() ? colors.purple : colors.muted,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.purple,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: value.trim() ? 0.5 : 0,
          shadowRadius: 8,
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 18 }}>↑</Text>
      </TouchableOpacity>
    </View>
  );
}
