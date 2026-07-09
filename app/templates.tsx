import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { useOpenDrawer } from "../hooks/useOpenDrawer";
import { TopBar } from "../components/layout/TopBar";
import { GlassCard } from "../components/ui/GlassCard";
import { TEMPLATE_GALLERY } from "../constants/sampleProject";
import { colors, gradients, radius } from "../constants/theme";
import { useProjectStore } from "../stores/projectStore";

const CATEGORIES = ["All", "Website", "Web App", "Mobile", "Agent"];

export default function TemplatesScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const createProject = useProjectStore((s) => s.createProject);
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? TEMPLATE_GALLERY
      : TEMPLATE_GALLERY.filter((t) => t.category === category);

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        greeting="Templates"
        subtitle="Pre-built UI for any industry"
        showSearch={false}
        showCredits={false}
        onMenuPress={openDrawer}
      />
      <View style={{ flexDirection: "row", paddingHorizontal: 16, marginBottom: 12, gap: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: radius.full,
                backgroundColor: category === c ? "rgba(123,97,255,0.2)" : colors.card,
                borderWidth: 1,
                borderColor: category === c ? colors.purpleBrand : colors.border,
              }}
            >
              <Text style={{ color: category === c ? colors.purpleBrand : colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Search size={20} color={colors.textMuted} />
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          paddingBottom: insets.bottom + 24,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {filtered.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={{ width: "47%" }}
            onPress={() => {
              createProject(template.title, template.category);
              router.push("/workspace");
            }}
          >
            <GlassCard glow="purple">
              <View style={{ padding: 12 }}>
                <View
                  style={{
                    height: 100,
                    borderRadius: radius.md,
                    backgroundColor: `${template.color}22`,
                    marginBottom: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: template.color,
                      opacity: 0.85,
                    }}
                  />
                </View>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14 }}>{template.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 2 }}>{template.category}</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
