import { View, Text } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Line } from "react-native-svg";
import { colors } from "../../constants/theme";

interface DeVibeLogoProps {
  size?: number;
}

export function DeVibeLogo({ size = 80 }: DeVibeLogoProps) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#7B61FF" />
            <Stop offset="60%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#00D1FF" />
          </LinearGradient>
        </Defs>
        <Path
          d="M18 15 H52 C72 15 85 32 85 50 C85 68 72 85 52 85 H18 V15 Z M34 30 V70 H52 C62 70 70 62 70 50 C70 38 62 30 52 30 H34 Z"
          fill="url(#logoGrad)"
        />
        {/* Star inside D */}
        <Path
          d="M48 38 L50 44 L56 44 L51 48 L53 54 L48 50 L43 54 L45 48 L40 44 L46 44 Z"
          fill="#FFFFFF"
          opacity={0.95}
        />
        {/* Circuit traces */}
        <Line x1="72" y1="38" x2="88" y2="38" stroke="#00D1FF" strokeWidth="2" opacity={0.8} />
        <Circle cx="88" cy="38" r="3" fill="#00D1FF" />
        <Line x1="72" y1="52" x2="84" y2="52" stroke="#7B61FF" strokeWidth="2" opacity={0.7} />
        <Circle cx="84" cy="52" r="2.5" fill="#7B61FF" />
      </Svg>
    </View>
  );
}

export function DeVibeBrandName({ fontSize = 32 }: { fontSize?: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Text
        style={{
          color: colors.text,
          fontSize,
          fontWeight: "800",
          letterSpacing: -1,
        }}
      >
        Dev
      </Text>
      <View>
        <Text
          style={{
            color: colors.text,
            fontSize,
            fontWeight: "800",
            letterSpacing: -1,
          }}
        >
          i
        </Text>
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: colors.purpleBrand,
            position: "absolute",
            top: fontSize * 0.08,
            right: -1,
          }}
        />
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize,
          fontWeight: "800",
          letterSpacing: -1,
        }}
      >
        be
      </Text>
    </View>
  );
}

/** @deprecated Use DeVibeBrandName */
export function DeVibeWordmark({ fontSize = 32 }: { fontSize?: number }) {
  return <DeVibeBrandName fontSize={fontSize} />;
}
