import { View, Text, ScrollView, Switch, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { GitHubConnectCard } from "../../components/github/GitHubConnectCard";
import { colors, gradients, radius } from "../../constants/theme";
import { useSettingsStore } from "../../stores/settingsStore";

const API_KEY_FIELDS = [
  { key: "openai", label: "OpenAI API Key" },
  { key: "anthropic", label: "Anthropic API Key" },
  { key: "supabaseUrl", label: "Supabase URL" },
  { key: "supabaseAnon", label: "Supabase Anon Key" },
] as const;

export default function SettingsScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore((s) => s.darkMode);
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const autoDeploy = useSettingsStore((s) => s.autoDeploy);
  const apiKeys = useSettingsStore((s) => s.apiKeys);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);
  const setAiEnabled = useSettingsStore((s) => s.setAiEnabled);
  const setAutoDeploy = useSettingsStore((s) => s.setAutoDeploy);
  const setApiKey = useSettingsStore((s) => s.setApiKey);

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Settings"
        subtitle="Configure your DeVibe Cloud Mobile experience"
        showSearch={false}
        onMenuPress={openDrawer}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 16 }}>
          <GitHubConnectCard />
        </View>

        <GlassCard style={{ marginBottom: 16 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 16 }}>
              API Keys
            </Text>
            {API_KEY_FIELDS.map((field) => (
              <View key={field.key} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>
                  {field.label}
                </Text>
                <TextInput
                  value={apiKeys[field.key] ?? ""}
                  onChangeText={(value) => setApiKey(field.key, value)}
                  placeholder={`Enter ${field.label}`}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={field.key.includes("Key") || field.key === "supabaseAnon"}
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
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={{ marginBottom: 16 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 16 }}>
              Preferences
            </Text>
            {[
              { label: "DeVibe Dark Theme", value: darkMode, onChange: setDarkMode },
              { label: "AI Agent Auto-suggestions", value: aiEnabled, onChange: setAiEnabled },
              { label: "Auto-deploy on merge", value: autoDeploy, onChange: setAutoDeploy },
            ].map((setting, index, arr) => (
              <View
                key={setting.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1, marginRight: 12 }}>
                  {setting.label}
                </Text>
                <Switch
                  value={setting.value}
                  onValueChange={setting.onChange}
                  trackColor={{ false: colors.muted, true: colors.purple }}
                  thumbColor="#FFF"
                />
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard>
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 8 }}>
              About DeVibe Cloud Mobile
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>
              Version 1.0.0{"\n"}
              The DeVibe mobile companion for Expo production apps.{"\n\n"}
              Built with Expo, Monaco Editor, and multi-agent AI.
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
