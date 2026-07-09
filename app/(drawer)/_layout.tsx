import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "../../components/layout/DrawerContent";
import { colors } from "../../constants/theme";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContent
          state={props.state}
          navigation={props.navigation}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: colors.bg,
          width: 280,
        },
        overlayColor: "rgba(0,0,0,0.6)",
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="projects" options={{ title: "Projects" }} />
      <Drawer.Screen name="workspace" options={{ title: "Workspace" }} />
      <Drawer.Screen name="agents" options={{ title: "Agents" }} />
      <Drawer.Screen name="workflows" options={{ title: "Workflows" }} />
      <Drawer.Screen name="cloud" options={{ title: "Cloud Factory" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
}
