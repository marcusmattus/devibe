import { clsx } from 'clsx';
import { View, type ViewProps } from 'react-native';
import { devibeTheme } from '../../theme/devibe';

interface GlassPanelProps extends ViewProps {
  glow?: 'purple' | 'blue' | 'none';
  className?: string;
}

export function GlassPanel({ glow = 'none', className, style, children, ...props }: GlassPanelProps) {
  const glowStyle =
    glow === 'purple'
      ? devibeTheme.shadows.glowPurple
      : glow === 'blue'
        ? devibeTheme.shadows.glowBlue
        : {};

  return (
    <View
      className={clsx(
        'rounded-xl border border-border-subtle bg-glass overflow-hidden',
        className
      )}
      style={[
        {
          backgroundColor: devibeTheme.colors.glass,
          borderColor: devibeTheme.colors.glassBorder,
        },
        glowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
