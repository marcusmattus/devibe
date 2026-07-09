import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Users } from "lucide-react-native";
import { colors } from "../../constants/theme";
import { SUGGESTED_TEMPLATES } from "../../constants/sampleProject";
import { usePromptSubmit } from "../../hooks/usePromptSubmit";
import { GlassCard } from "../ui/GlassCard";

export function SuggestedProjects() {
  const { setPrompt, submitPrompt } = usePromptSubmit();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: "700",
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        Suggested for you
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {SUGGESTED_TEMPLATES.map((template) => (
          <TouchableOpacity
            key={template.id}
            onPress={() => {
              setPrompt(template.title);
              submitPrompt(template.title);
            }}
            style={{ width: 200 }}
          >
            <GlassCard glow="purple">
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    height: 80,
                    borderRadius: 12,
                    backgroundColor: `${template.color}22`,
                    marginBottom: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: template.color,
                      opacity: 0.8,
                    }}
                  />
                </View>
                <Text
                  style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 4 }}
                  numberOfLines={2}
                >
                  {template.title}
                </Text>
                <Text
                  style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}
                  numberOfLines={2}
                >
                  {template.description}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Users size={12} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    {template.contributors} agents
                  </Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
