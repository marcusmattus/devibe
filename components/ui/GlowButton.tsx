import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "../../constants/theme";

interface GlowButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function GlowButton({
  title,
  variant = "primary",
  size = "md",
  loading,
  icon,
  disabled,
  style,
  ...props
}: GlowButtonProps) {
  const padding = size === "sm" ? 10 : size === "lg" ? 18 : 14;
  const fontSize = size === "sm" ? 13 : size === "lg" ? 17 : 15;

  if (variant === "primary") {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          {
            borderRadius: radius.md,
            overflow: "hidden",
            opacity: disabled ? 0.5 : 1,
            shadowColor: colors.purple,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
          },
          style,
        ]}
        {...props}
      >
        <LinearGradient
          colors={["#A855F7", "#7C3AED", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: padding,
            paddingHorizontal: padding + 8,
            gap: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              {icon}
              <Text style={{ color: "#FFF", fontWeight: "600", fontSize }}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: padding,
          paddingHorizontal: padding + 8,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: variant === "ghost" ? "transparent" : colors.border,
          backgroundColor:
            variant === "secondary" ? "rgba(168, 85, 247, 0.1)" : "transparent",
          gap: 8,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.purple} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: variant === "ghost" ? colors.textSecondary : colors.purple,
              fontWeight: "600",
              fontSize,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
