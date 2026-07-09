import { View, Text, ScrollView, Switch, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { colors, radius } from "../../constants/theme";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoDeploy, setAutoDeploy] = useState(false);

  return (
    <LinearGradient colors={["#0F0F1A", "#0A0A0F"]} style={{ flex: 1 }}>
      <TopBar
        greeting="Settings"
        subtitle="Configure your VibeCursor Pro experience"
        showSearch={false}
        onMenuPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard style={{ marginBottom: 16 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 16 }}>
              API Keys
            </Text>
            {["OpenAI API Key", "Anthropic API Key", "Supabase URL", "Supabase Anon Key"].map((label) => (
              <View key={label} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</Text>
                <TextInput
                  placeholder={`Enter ${label}`}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={label.includes("Key")}
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
            ].map((setting) => (
              <View
                key={setting.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{setting.label}</Text>
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
              About VibeCursor Pro
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>
              Version 1.0.0{"\n"}
              The ultimate mobile AI coding companion for Expo production apps.{"\n\n"}
              Built with Expo, Monaco Editor, and multi-agent AI.
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}
