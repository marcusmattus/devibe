import { View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius } from "../../constants/theme";

interface GlassCardProps extends ViewProps {
  intensity?: number;
  glow?: "purple" | "blue" | "none";
  children: React.ReactNode;
}

export function GlassCard({
  intensity = 40,
  glow = "none",
  children,
  style,
  ...props
}: GlassCardProps) {
  const glowColor =
    glow === "purple"
      ? colors.purpleGlow
      : glow === "blue"
        ? colors.blueGlow
        : "transparent";

  return (
    <View
      style={[
        {
          borderRadius: radius.lg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glow !== "none" ? 0.6 : 0,
          shadowRadius: 16,
        },
        style,
      ]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={{ backgroundColor: "rgba(26, 26, 40, 0.75)" }}
      >
        {children}
      </BlurView>
    </View>
  );
}
