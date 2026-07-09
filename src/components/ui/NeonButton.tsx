import { Pressable, Text, View } from 'react-native';
import { devibeTheme } from '../../theme/devibe';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function NeonButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  icon,
}: NeonButtonProps) {
  const bg =
    variant === 'primary'
      ? devibeTheme.colors.purple
      : variant === 'secondary'
        ? 'transparent'
        : 'transparent';

  const borderColor =
    variant === 'secondary' ? devibeTheme.colors.blue : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor,
          borderRadius: 8,
          paddingHorizontal: size === 'sm' ? 12 : 16,
          paddingVertical: size === 'sm' ? 6 : 10,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          ...(variant === 'primary' ? devibeTheme.shadows.glowPurple : {}),
        },
      ]}
    >
      {icon}
      <Text
        style={{
          color: devibeTheme.colors.textPrimary,
          fontWeight: '600',
          fontSize: size === 'sm' ? 12 : 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
