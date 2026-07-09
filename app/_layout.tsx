import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommandPalette } from "../components/workspace/CommandPalette";
import { RightPanel } from "../components/right-panel/RightPanel";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0A0A0F" } }}>
          <Stack.Screen name="(drawer)" />
        </Stack>
        <CommandPalette />
        <RightPanel />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
