import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Github, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { BlurView } from "expo-blur";
import { DeVibeLogo, DeVibeBrandName } from "./DeVibeLogo";
import { colors, radius } from "../../constants/theme";
import { useAuthStore } from "../../stores/authStore";

function StripeIcon() {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        backgroundColor: "#635BFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 14 }}>S</Text>
    </View>
  );
}

interface LoginGatewayProps {
  onSuccess?: () => void;
  onSkip?: () => void;
}

export function LoginGateway({ onSuccess, onSkip }: LoginGatewayProps) {
  const insets = useSafeAreaInsets();
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const deviceFlow = useAuthStore((s) => s.deviceFlow);
  const startDeviceFlow = useAuthStore((s) => s.startDeviceFlow);
  const signInWithStripe = useAuthStore((s) => s.signInWithStripe);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGitHub = async () => {
    clearError();
    await startDeviceFlow();
    if (useAuthStore.getState().isAuthenticated) onSuccess?.();
  };

  const handleStripe = async () => {
    clearError();
    await signInWithStripe();
    if (useAuthStore.getState().isAuthenticated) onSuccess?.();
  };

  const handleEmail = async () => {
    clearError();
    await signInWithEmail(email, password);
    if (useAuthStore.getState().isAuthenticated) onSuccess?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0B0B1A", "#0F0F1A"]} style={StyleSheet.absoluteFill} />
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbBlue]} />

      <View
        style={[
          styles.scrollContent,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.header}>
          <DeVibeLogo size={64} />
          <View style={{ marginTop: 16 }}>
            <DeVibeBrandName fontSize={28} />
          </View>
          <Text style={styles.subtitle}>Sign in to access your projects & repos</Text>
        </View>

        <View style={styles.cardOuter}>
          <BlurView intensity={50} tint="dark" style={styles.cardBlur}>
            <LinearGradient
              colors={["rgba(123,97,255,0.08)", "rgba(0,209,255,0.04)", "rgba(26,26,40,0.9)"]}
              style={styles.cardGradient}
            >
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardDesc}>
                Connect with GitHub or Stripe for secure repo access and payments.
              </Text>

              {deviceFlow && (
                <View style={styles.deviceCodeBox}>
                  <Text style={styles.deviceCodeLabel}>Enter on GitHub:</Text>
                  <Text style={styles.deviceCode}>{deviceFlow.userCode}</Text>
                </View>
              )}

              {error ? (
                <TouchableOpacity onPress={clearError}>
                  <Text style={styles.errorText}>{error}</Text>
                </TouchableOpacity>
              ) : null}

              {/* GitHub */}
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={handleGitHub}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Github size={20} color="#FFF" />
                <Text style={styles.oauthButtonText}>
                  {isLoading ? "Connecting..." : "Continue with GitHub"}
                </Text>
                {isLoading && <ActivityIndicator color="#FFF" size="small" />}
              </TouchableOpacity>

              {/* Stripe */}
              <TouchableOpacity
                style={[styles.oauthButton, styles.stripeButton]}
                onPress={handleStripe}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <StripeIcon />
                <Text style={styles.oauthButtonText}>Continue with Stripe</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or email</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputGroup}>
                <Mail size={18} color={colors.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Lock size={18} color={colors.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={18} color={colors.textMuted} />
                  ) : (
                    <Eye size={18} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEmail}
                disabled={isLoading || !email.trim() || password.length < 6}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#7B61FF", "#A855F7", "#3B82F6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </View>

        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Continue without signing in</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          By continuing, you agree to DeVibe Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbPurple: {
    width: 300,
    height: 300,
    top: -60,
    right: -100,
    backgroundColor: "rgba(123, 97, 255, 0.15)",
  },
  orbBlue: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -80,
    backgroundColor: "rgba(0, 209, 255, 0.1)",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  cardOuter: {
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(123, 97, 255, 0.25)",
    shadowColor: "#7B61FF",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  cardBlur: {
    overflow: "hidden",
  },
  cardGradient: {
    padding: 24,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  deviceCodeBox: {
    backgroundColor: "rgba(123, 97, 255, 0.12)",
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(123, 97, 255, 0.3)",
  },
  deviceCodeLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
  },
  deviceCode: {
    color: "#7B61FF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    textAlign: "center",
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  oauthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "rgba(30, 30, 40, 0.95)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingVertical: 14,
    marginBottom: 12,
  },
  stripeButton: {
    borderColor: "rgba(99, 91, 255, 0.5)",
    backgroundColor: "rgba(99, 91, 255, 0.12)",
  },
  oauthButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(10, 10, 15, 0.8)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(123, 97, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },
  primaryButton: {
    borderRadius: radius.md,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: "#7B61FF",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  skipButton: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 12,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  legal: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 16,
    opacity: 0.7,
  },
});
