import { View, Text } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from "react-native-svg";
import { colors } from "../../constants/theme";

interface DeVibeLogoProps {
  size?: number;
}

export function DeVibeLogo({ size = 80 }: DeVibeLogoProps) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#7B61FF" />
            <Stop offset="50%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#00D1FF" />
          </LinearGradient>
        </Defs>
        {/* Circuit-style D */}
        <Path
          d="M24 12 H44 C58 12 68 24 68 40 C68 56 58 68 44 68 H24 V12 Z M36 24 V56 H44 C50 56 56 49 56 40 C56 31 50 24 44 24 H36 Z"
          fill="url(#logoGrad)"
        />
        <Circle cx="52" cy="28" r="3" fill="#00D1FF" opacity={0.9} />
        <Circle cx="58" cy="40" r="2.5" fill="#7B61FF" opacity={0.8} />
        <Circle cx="50" cy="52" r="2" fill="#00D1FF" opacity={0.7} />
        <Path
          d="M52 28 L58 40 M58 40 L50 52"
          stroke="#00D1FF"
          strokeWidth="1"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
}

export function DeVibeWordmark({ fontSize = 32 }: { fontSize?: number }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text
        style={{
          color: colors.text,
          fontSize,
          fontWeight: "800",
          letterSpacing: -0.5,
        }}
      >
        DeVibe
      </Text>
      <Text
        style={{
          color: "#7B61FF",
          fontSize: fontSize * 0.35,
          fontWeight: "700",
          letterSpacing: 3,
          marginTop: 4,
        }}
      >
        CLOUD MOBILE
      </Text>
    </View>
  );
}
