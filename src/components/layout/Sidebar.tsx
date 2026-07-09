import { View, Text, Pressable, ScrollView } from 'react-native';
import {
  Code2,
  Cloud,
  Bug,
  Rocket,
  GitBranch,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useUIStore } from '../../stores/uiStore';
import { devibeTheme } from '../../theme/devibe';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Code2,
  Cloud,
  Bug,
  Rocket,
  GitBranch,
  Settings,
};

export function Sidebar() {
  const { navItems, activeNav, setActiveNav, sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <View
      style={{
        width: sidebarCollapsed ? 56 : 200,
        backgroundColor: devibeTheme.colors.abyss,
        borderRightWidth: 1,
        borderRightColor: devibeTheme.colors.glassBorder,
        paddingVertical: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 24 }}>
        {!sidebarCollapsed && (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color={devibeTheme.colors.purple} />
            <Text style={{ color: devibeTheme.colors.textPrimary, fontWeight: '700', fontSize: 16 }}>
              VibeCursor
            </Text>
          </View>
        )}
        <Pressable onPress={toggleSidebar} hitSlop={8}>
          {sidebarCollapsed ? (
            <ChevronRight size={18} color={devibeTheme.colors.textMuted} />
          ) : (
            <ChevronLeft size={18} color={devibeTheme.colors.textMuted} />
          )}
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Code2;
          const isActive = activeNav === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setActiveNav(item.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: sidebarCollapsed ? 16 : 12,
                marginHorizontal: 8,
                marginBottom: 4,
                borderRadius: 8,
                backgroundColor: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                borderLeftWidth: isActive ? 2 : 0,
                borderLeftColor: devibeTheme.colors.purple,
              }}
            >
              <Icon size={18} color={isActive ? devibeTheme.colors.purple : devibeTheme.colors.textMuted} />
              {!sidebarCollapsed && (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Text
                    style={{
                      color: isActive ? devibeTheme.colors.textPrimary : devibeTheme.colors.textSecondary,
                      fontSize: 13,
                      fontWeight: isActive ? '600' : '400',
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View
                      style={{
                        marginLeft: 6,
                        backgroundColor: devibeTheme.colors.cyan,
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: '#000', fontSize: 9, fontWeight: '700' }}>{item.badge}</Text>
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
