import { View, ScrollView, Modal, Pressable, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, gradients } from "../../constants/theme";
import { useEditorStore } from "../../stores/editorStore";
import { CreditsWidget } from "./CreditsWidget";
import { ActiveAgents } from "./ActiveAgents";
import { RecentActivity } from "./RecentActivity";
import { UsageChart } from "./UsageChart";

const PANEL_WIDTH = Math.min(Dimensions.get("window").width * 0.85, 340);

export function RightPanel() {
  const open = useEditorStore((s) => s.rightPanelOpen);
  const setOpen = useEditorStore((s) => s.setRightPanelOpen);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
      <Pressable
        style={{ flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={() => setOpen(false)}
      >
        <View style={{ flex: 1 }} />
        <Pressable
          style={{
            width: PANEL_WIDTH,
            borderLeftWidth: 1,
            borderLeftColor: colors.border,
            overflow: "hidden",
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <LinearGradient
            colors={[...gradients.screen]}
            style={{ flex: 1, paddingTop: insets.top }}
          >
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 16 }}
            showsVerticalScrollIndicator={false}
          >
            <CreditsWidget />
            <ActiveAgents />
            <RecentActivity />
            <UsageChart />
          </ScrollView>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
