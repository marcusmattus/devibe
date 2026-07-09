import { View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { usePromptSubmit } from "../../hooks/usePromptSubmit";
import { TopBar, FloatingChatBar } from "../../components/layout/TopBar";
import { HeroSection, QuickActions } from "../../components/home/HeroSection";
import { SuggestedProjects } from "../../components/home/SuggestedProjects";
import { RecentProjects } from "../../components/home/RecentProjects";
import { useEditorStore } from "../../stores/editorStore";
import { gradients } from "../../constants/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const openDrawer = useOpenDrawer();
  const setCommandPaletteOpen = useEditorStore((s) => s.setCommandPaletteOpen);
  const { prompt, setPrompt, submitPrompt } = usePromptSubmit();

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar
        subtitle="What do you want to build today?"
        onMenuPress={openDrawer}
        onSearchPress={() => setCommandPaletteOpen(true)}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <QuickActions />
        <SuggestedProjects />
        <RecentProjects />
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
        }}
      >
        <FloatingChatBar
          value={prompt}
          onChangeText={setPrompt}
          onSend={() => submitPrompt()}
        />
      </View>
    </LinearGradient>
  );
}
