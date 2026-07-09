import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  Bot,
  Workflow,
  Rocket,
  LayoutTemplate,
  FolderPlus,
  Paperclip,
  ArrowRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { DeVibeLogo } from "../auth/DeVibeLogo";
import { usePromptSubmit } from "../../hooks/usePromptSubmit";
import { colors, radius } from "../../constants/theme";

const QUICK_ACTION_GRID = [
  { label: "Build with AI", icon: Sparkles, route: "/(tabs)/agents" },
  { label: "AI Agents", icon: Bot, route: "/(tabs)/agents" },
  { label: "Automate", icon: Workflow, route: "/workflows" },
  { label: "Deploy", icon: Rocket, route: "/deployments" },
  { label: "Templates", icon: LayoutTemplate, route: "/templates" },
  { label: "New Project", icon: FolderPlus, route: "/(tabs)/create" },
] as const;

export function HeroSection() {
  const { prompt, setPrompt, submitPrompt } = usePromptSubmit();

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
      <LinearGradient
        colors={["rgba(123,97,255,0.25)", "rgba(59,130,246,0.12)", "rgba(26,26,40,0.9)"]}
        style={{
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: "rgba(123, 97, 255, 0.35)",
          padding: 20,
          shadowColor: colors.purpleBrand,
          shadowOpacity: 0.3,
          shadowRadius: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <DeVibeLogo size={36} />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", flex: 1 }}>
            Build anything with AI
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "rgba(10, 10, 15, 0.6)",
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Paperclip size={18} color={colors.textMuted} />
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe your idea..."
            placeholderTextColor={colors.textMuted}
            style={{ flex: 1, color: colors.text, fontSize: 15 }}
            onSubmitEditing={() => submitPrompt()}
          />
          <TouchableOpacity
            onPress={() => submitPrompt()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.purpleBrand,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowRight size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

export function QuickActions() {
  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Quick Actions</Text>
        <TouchableOpacity onPress={() => router.push("/templates")}>
          <Text style={{ color: colors.purpleBrand, fontSize: 13, fontWeight: "600" }}>See all</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 12,
          gap: 8,
        }}
      >
        {QUICK_ACTION_GRID.map((action) => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={action.label}
              onPress={() => router.push(action.route as never)}
              style={{
                width: "31%",
                alignItems: "center",
                paddingVertical: 14,
                borderRadius: radius.lg,
                backgroundColor: "rgba(26, 26, 40, 0.8)",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Icon size={22} color={colors.purpleBrand} />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: "500",
                  marginTop: 8,
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
