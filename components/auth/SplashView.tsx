import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";
import { DeVibeLogo, DeVibeWordmark } from "./DeVibeLogo";
import { colors } from "../../constants/theme";

export function SplashView() {
  const pulse = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    progress.value = withTiming(1, { duration: 2400, easing: Easing.out(Easing.ease) });
  }, [pulse, progress]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.3, 0.7]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.9, 1.15]) }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100])}%`,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0B0B1A", "#0F0F1A"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background orbs */}
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbBlue]} />

      <View style={styles.content}>
        <Animated.View style={[styles.glowRing, glowStyle]} />
        <DeVibeLogo size={96} />
        <View style={{ marginTop: 24 }}>
          <DeVibeWordmark fontSize={36} />
        </View>
        <Text style={styles.tagline}>Build anything with AI</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbPurple: {
    width: 280,
    height: 280,
    top: "15%",
    left: -80,
    backgroundColor: "rgba(123, 97, 255, 0.12)",
  },
  orbBlue: {
    width: 220,
    height: 220,
    bottom: "20%",
    right: -60,
    backgroundColor: "rgba(0, 209, 255, 0.08)",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(123, 97, 255, 0.25)",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 16,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 80,
    width: "70%",
    alignItems: "center",
  },
  loadingText: {
    color: "#00D1FF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 1,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00D1FF",
    borderRadius: 2,
    shadowColor: "#00D1FF",
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
