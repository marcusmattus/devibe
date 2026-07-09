import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  User,
  CreditCard,
  Users,
  Key,
  Plug,
  Palette,
  Bell,
  Globe,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react-native";
import { useOpenDrawer } from "../../hooks/useOpenDrawer";
import { TopBar } from "../../components/layout/TopBar";
import { GlassCard } from "../../components/ui/GlassCard";
import { colors, gradients, radius } from "../../constants/theme";
import { useAuthStore } from "../../stores/authStore";
import { useSettingsStore } from "../../stores/settingsStore";

const ACCOUNT_ITEMS = [
  { label: "Profile Information", icon: User, route: null },
  { label: "Plan & Billing", icon: CreditCard, route: null },
  { label: "Team Members", icon: Users, route: null },
  { label: "API Keys", icon: Key, route: null },
  { label: "Integrations", icon: Plug, route: "/access-control" },
];

const PREF_ITEMS = [
  { label: "Appearance", icon: Palette, key: "darkMode" as const },
  { label: "Notifications", icon: Bell, key: null },
  { label: "Language", icon: Globe, key: null, value: "English" },
];

export default function ProfileScreen() {
  const openDrawer = useOpenDrawer();
  const insets = useSafeAreaInsets();
  const appProfile = useAuthStore((s) => s.appProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const setDarkMode = useSettingsStore((s) => s.setDarkMode);

  const name = appProfile?.name ?? "Marcus Stone";
  const email = appProfile?.email ?? "marcus@devibe.app";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <LinearGradient colors={[...gradients.screen]} style={{ flex: 1 }}>
      <TopBar greeting="Profile" showSearch={false} showCredits={false} onMenuPress={openDrawer} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard glow="purple" style={{ marginBottom: 24 }}>
          <View style={{ padding: 20, alignItems: "center" }}>
            {appProfile?.avatarUrl ? (
              <Image
                source={{ uri: appProfile.avatarUrl }}
                style={{ width: 72, height: 72, borderRadius: 36, marginBottom: 12 }}
              />
            ) : (
              <LinearGradient
                colors={["#7B61FF", "#00D1FF"]}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "700" }}>
                  {name.charAt(0)}
                </Text>
              </LinearGradient>
            )}
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 20 }}>{name}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 4 }}>{email}</Text>
            <View
              style={{
                marginTop: 12,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: radius.full,
                backgroundColor: "rgba(123, 97, 255, 0.2)",
                borderWidth: 1,
                borderColor: colors.purpleBrand,
              }}
            >
              <Text style={{ color: colors.purpleBrand, fontWeight: "700", fontSize: 12 }}>
                Pro Plan
              </Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Account</Text>
        <GlassCard style={{ marginBottom: 20 }}>
          {ACCOUNT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={() => item.route && router.push(item.route as never)}
                style={[
                  styles.row,
                  i < ACCOUNT_ITEMS.length - 1 && styles.rowBorder,
                ]}
              >
                <Icon size={18} color={colors.textSecondary} />
                <Text style={styles.rowLabel}>{item.label}</Text>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </GlassCard>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <GlassCard style={{ marginBottom: 20 }}>
          {PREF_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <View
                key={item.label}
                style={[styles.row, i < PREF_ITEMS.length - 1 && styles.rowBorder]}
              >
                <Icon size={18} color={colors.textSecondary} />
                <Text style={styles.rowLabel}>{item.label}</Text>
                {item.key === "darkMode" ? (
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: colors.muted, true: colors.purpleBrand }}
                    thumbColor="#FFF"
                  />
                ) : (
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>{item.value ?? ""}</Text>
                )}
              </View>
            );
          })}
        </GlassCard>

        <TouchableOpacity onPress={() => router.push("/access-control")}>
          <GlassCard style={{ marginBottom: 12 }}>
            <View style={styles.row}>
              <Shield size={18} color={colors.purpleBrand} />
              <Text style={styles.rowLabel}>Access Control & Security</Text>
              <ChevronRight size={16} color={colors.textMuted} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut}>
          <GlassCard>
            <View style={[styles.row, { justifyContent: "center", gap: 8 }]}>
              <LogOut size={18} color={colors.red} />
              <Text style={{ color: colors.red, fontWeight: "600" }}>Sign Out</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "500" as const,
  },
};
