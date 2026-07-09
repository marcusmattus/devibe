import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../../constants/theme";
import { useCloudStore } from "../../stores/cloudStore";
import { GlassCard } from "../ui/GlassCard";

export function CreditsWidget() {
  const credits = useCloudStore((s) => s.credits);
  const percent = Math.round((credits.used / credits.total) * 100);
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <GlassCard style={{ marginBottom: 16 }} glow="purple">
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 14, marginBottom: 12, alignSelf: "flex-start" }}>
          Credits
        </Text>
        <View style={{ position: "relative", width: size, height: size }}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.purple}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{percent}%</Text>
          </View>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 8 }}>
          {credits.used} / {credits.total} used
        </Text>
      </View>
    </GlassCard>
  );
}
