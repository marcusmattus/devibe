import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Paperclip, Image as ImageIcon } from "lucide-react-native";
import { NeonOrb } from "../ui/NeonOrb";
import { GlowButton } from "../ui/GlowButton";
import { usePromptSubmit } from "../../hooks/usePromptSubmit";
import { QUICK_ACTIONS } from "../../constants/sampleProject";
import { colors, radius } from "../../constants/theme";

export function HeroSection() {
  const { prompt, setPrompt, submitPrompt } = usePromptSubmit();

  const handleSend = () => submitPrompt();

  return (
    <View style={{ alignItems: "center", paddingVertical: 24 }}>
      <NeonOrb size={100} />
      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "700",
          marginTop: 20,
          textAlign: "center",
        }}
      >
        What do you want to build today?
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          marginTop: 6,
          textAlign: "center",
          paddingHorizontal: 32,
        }}
      >
        Describe your app and let AI agents generate code + cloud infrastructure
      </Text>

      <View
        style={{
          width: "100%",
          marginTop: 24,
          backgroundColor: "rgba(26, 26, 40, 0.8)",
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        }}
      >
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Build a production-ready Expo app with auth, payments..."
          placeholderTextColor={colors.textMuted}
          multiline
          style={{
            color: colors.text,
            fontSize: 15,
            minHeight: 80,
            textAlignVertical: "top",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity>
              <Paperclip size={20} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity>
              <ImageIcon size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <GlowButton title="Send" size="sm" onPress={handleSend} />
        </View>
      </View>
    </View>
  );
}

export function QuickActions() {
  const { setPrompt, submitPrompt } = usePromptSubmit();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      style={{ marginBottom: 24 }}
    >
      {QUICK_ACTIONS.map((action: string) => (
        <TouchableOpacity
          key={action}
          onPress={() => {
            setPrompt(action);
            submitPrompt(action);
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: "rgba(26, 26, 40, 0.6)",
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{action}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
