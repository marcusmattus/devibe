import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

export function SplashLoader({ size = 48 }: { size?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const r = (size - 6) / 2;

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#7B61FF" />
            <Stop offset="100%" stopColor="#00D1FF" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={3}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#loaderGrad)"
          strokeWidth={3}
          fill="none"
          strokeDasharray={`${r * 3} ${r * 6}`}
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
}
