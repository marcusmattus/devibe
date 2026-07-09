export const colors = {
  bg: "#0A0A0F",
  bgDeep: "#0B0B1A",
  bgGradientStart: "#0F0F1A",
  bgGradientEnd: "#1A0A2E",
  surface: "#12121A",
  card: "#1A1A28",
  cardHover: "#222233",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.12)",
  purple: "#A855F7",
  purpleBrand: "#7B61FF",
  purpleDark: "#7C3AED",
  purpleGlow: "rgba(168, 85, 247, 0.4)",
  blue: "#3B82F6",
  blueNeon: "#00D1FF",
  blueGlow: "rgba(59, 130, 246, 0.4)",
  stripe: "#635BFF",
  green: "#22C55E",
  orange: "#F97316",
  red: "#EF4444",
  muted: "#6B7280",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
} as const;

export const gradients = {
  purpleBlue: ["#A855F7", "#3B82F6"] as const,
  card: ["rgba(26,26,40,0.9)", "rgba(18,18,26,0.95)"] as const,
  orb: ["#A855F7", "#7C3AED", "#3B82F6"] as const,
  screen: ["#0F0F1A", "#0A0A0F", "#1A0A2E"] as const,
  screenAlt: ["#0F0F1A", "#0A0A0F"] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;
