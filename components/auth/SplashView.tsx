import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DeVibeLogo, DeVibeBrandName } from "./DeVibeLogo";
import { SplashLoader } from "./SplashLoader";
import { DataWaveFooter } from "./DataWaveFooter";
import { colors } from "../../constants/theme";

export function SplashView() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0A0A0C", "#0B0B1A"]} style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <DeVibeLogo size={120} />
        <View style={{ marginTop: 28 }}>
          <DeVibeBrandName fontSize={38} />
        </View>
        <Text style={styles.tagline}>BUILD • AUTOMATE • DEPLOY</Text>
        <Text style={styles.description}>
          AI-POWERED PLATFORM TO BUILD, AUTOMATE AND LAUNCH DIGITAL PRODUCTS FASTER
        </Text>
      </View>

      <View style={styles.loaderSection}>
        <SplashLoader size={52} />
        <Text style={styles.loadingText}>Loading your workspace...</Text>
      </View>

      <DataWaveFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0C",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  tagline: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3,
    marginTop: 20,
    opacity: 0.9,
  },
  description: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 1.2,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    textTransform: "uppercase",
  },
  loaderSection: {
    alignItems: "center",
    paddingBottom: 120,
    gap: 16,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
});
