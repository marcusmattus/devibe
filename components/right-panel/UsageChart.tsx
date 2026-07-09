import { View, Text } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { colors } from "../../constants/theme";
import { GlassCard } from "../ui/GlassCard";

const DATA = [12, 28, 18, 45, 32, 58, 42, 65, 48, 72, 55, 80];
const WIDTH = 280;
const HEIGHT = 100;
const MAX = Math.max(...DATA);

export function UsageChart() {
  const points = DATA.map((value, i) => {
    const x = (i / (DATA.length - 1)) * WIDTH;
    const y = HEIGHT - (value / MAX) * (HEIGHT - 20) - 10;
    return { x, y, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;

  return (
    <GlassCard>
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 4 }}>
          Usage Overview
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>Builds this month</Text>
        <Svg width={WIDTH} height={HEIGHT}>
          <Defs>
            <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.purple} stopOpacity="0.3" />
              <Stop offset="1" stopColor={colors.purple} stopOpacity="0" />
            </SvgGradient>
          </Defs>
          <Path d={areaPath} fill="url(#areaGrad)" />
          <Path d={linePath} stroke={colors.purple} strokeWidth={2} fill="none" />
          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={colors.purple}
              opacity={i === points.length - 1 ? 1 : 0.5}
            />
          ))}
        </Svg>
      </View>
    </GlassCard>
  );
}
