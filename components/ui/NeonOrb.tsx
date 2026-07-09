import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/theme";

interface NeonOrbProps {
  size?: number;
}

export function NeonOrb({ size = 120 }: NeonOrbProps) {
  const pulse = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, [pulse, rotate]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
      { scale: interpolate(pulse.value, [0, 1], [1, 1.08]) },
    ],
    opacity: interpolate(pulse.value, [0, 1], [0.6, 1]),
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.95, 1.05]) }],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size + 40,
            height: size + 40,
            borderRadius: (size + 40) / 2,
            borderWidth: 1,
            borderColor: colors.purple,
          },
          ringStyle,
        ]}
      />
      <Animated.View style={orbStyle}>
        <LinearGradient
          colors={["rgba(168,85,247,0.6)", "rgba(124,58,237,0.4)", "rgba(59,130,246,0.3)"]}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: colors.purple,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 30,
          }}
        />
      </Animated.View>
      <View
        style={{
          position: "absolute",
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size * 0.15,
          backgroundColor: "rgba(255,255,255,0.15)",
          top: size * 0.2,
          left: size * 0.25,
        }}
      />
    </View>
  );
}
