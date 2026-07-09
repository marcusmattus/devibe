export const devibeTheme = {
  colors: {
    void: '#030712',
    abyss: '#0a0f1e',
    surface: '#111827',
    surfaceElevated: '#1a2234',
    glass: 'rgba(17, 24, 39, 0.72)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    purple: '#A855F7',
    blue: '#3B82F6',
    cyan: '#00F0FF',
    magenta: '#EC4899',
    green: '#10B981',
    red: '#EF4444',
    amber: '#F59E0B',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
  },
  gradients: {
    hero: ['#A855F7', '#3B82F6', '#00F0FF'] as const,
    panel: ['rgba(168, 85, 247, 0.15)', 'rgba(59, 130, 246, 0.08)'] as const,
  },
  shadows: {
    glowPurple: {
      shadowColor: '#A855F7',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    glowBlue: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
    },
  },
  monaco: {
    theme: 'vibecursor-dark',
  },
} as const;

export type DevibeTheme = typeof devibeTheme;
