import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CommandPalette } from "../components/workspace/CommandPalette";
import { RightPanel } from "../components/right-panel/RightPanel";
import { AppMenu } from "../components/layout/AppMenu";
import { useAuthStore } from "../stores/authStore";
import { useAgenticAuthStore } from "../stores/agenticAuthStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateAgentic = useAgenticAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateAgentic();
  }, [hydrate, hydrateAgentic]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0A0A0C" } }}>
          <Stack.Screen name="index" options={{ animation: "fade" }} />
          <Stack.Screen name="login" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="workspace" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="project/[id]" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="templates" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="deployments" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="cloud" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="repositories" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="access-control" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="workflows" options={{ animation: "slide_from_right" }} />
        </Stack>
        <AppMenu />
        <CommandPalette />
        <RightPanel />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
