import { Tabs } from "expo-router";
import { DeVibeTabBar } from "../../components/layout/DeVibeTabBar";
import { colors } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <DeVibeTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="projects" options={{ title: "Projects" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="agents" options={{ title: "Agents" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
