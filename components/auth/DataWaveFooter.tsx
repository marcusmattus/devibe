import Svg, { Path, Circle } from "react-native-svg";
import { View, StyleSheet } from "react-native";

export function DataWaveFooter() {
  const dots: { x: number; y: number; o: number }[] = [];
  for (let x = 0; x < 40; x++) {
    for (let row = 0; row < 8; row++) {
      const nx = x / 40;
      const wave = Math.sin(nx * Math.PI * 3) * 12 + row * 4;
      dots.push({ x: nx * 360, y: 60 + wave + row * 5, o: 0.15 + row * 0.08 });
    }
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Svg width="100%" height={100} viewBox="0 0 360 100" preserveAspectRatio="none">
        {dots.map((d, i) => (
          <Circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={1.2}
            fill={i % 3 === 0 ? "#00D1FF" : "#7B61FF"}
            opacity={d.o}
          />
        ))}
        <Path
          d="M0 70 Q90 40 180 65 T360 55 L360 100 L0 100 Z"
          fill="url(#wave)"
          opacity={0.15}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});
