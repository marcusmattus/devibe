import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar, FloatingChatBar } from "../../components/layout/TopBar";
import { HeroSection, QuickActions } from "../../components/home/HeroSection";
import { SuggestedProjects } from "../../components/home/SuggestedProjects";
import { RecentProjects } from "../../components/home/RecentProjects";
import { useEditorStore } from "../../stores/editorStore";
import { useAgentStore } from "../../stores/agentStore";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const openDrawer = useOpenDrawer();
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const prompt = useAgentStore((s) => s.prompt);
  const setPrompt = useAgentStore((s) => s.setPrompt);
  const sendPrompt = useAgentStore((s) => s.sendPrompt);

  return (
    <LinearGradient colors={["#0F0F1A", "#0A0A0F", "#1A0A2E"]} style={{ flex: 1 }}>
      <TopBar
        subtitle="What do you want to build today?"
        onMenuPress={openDrawer}
        onSearchPress={() => setCommandPaletteOpen(true)}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <QuickActions />
        <SuggestedProjects />
        <RecentProjects />
      </ScrollView>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingBottom: insets.bottom }}>
        <FloatingChatBar
          value={prompt}
          onChangeText={setPrompt}
          onSend={() => sendPrompt(prompt)}
        />
      </View>
    </LinearGradient>
  );
}
