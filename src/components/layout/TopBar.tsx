import { View, Text, TextInput, Pressable } from 'react-native';
import { Search, Bell, Zap, Command } from 'lucide-react-native';
import { useUIStore } from '../../stores/uiStore';
import { useCloudStore } from '../../stores/cloudStore';
import { useEditorStore } from '../../stores/editorStore';
import { devibeTheme } from '../../theme/devibe';

export function TopBar() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const { credits } = useCloudStore();
  const { toggleCommandPalette } = useEditorStore();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: devibeTheme.colors.abyss,
        borderBottomWidth: 1,
        borderBottomColor: devibeTheme.colors.glassBorder,
      }}
    >
      <Text style={{ color: devibeTheme.colors.textPrimary, fontWeight: '600', fontSize: 15, marginRight: 16 }}>
        {greeting}, <Text style={{ color: devibeTheme.colors.purple }}>Vibe Coder</Text>
      </Text>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          maxWidth: 400,
          borderWidth: 1,
          borderColor: devibeTheme.colors.glassBorder,
        }}
      >
        <Search size={16} color={devibeTheme.colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search files, commands..."
          placeholderTextColor={devibeTheme.colors.textMuted}
          style={{ flex: 1, marginLeft: 8, color: devibeTheme.colors.textPrimary, fontSize: 13 }}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={toggleCommandPalette}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.05)',
          marginRight: 12,
        }}
      >
        <Command size={14} color={devibeTheme.colors.textMuted} />
        <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 12 }}>⌘K</Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: 'rgba(168, 85, 247, 0.12)',
          borderWidth: 1,
          borderColor: 'rgba(168, 85, 247, 0.3)',
          marginRight: 12,
        }}
      >
        <Zap size={14} color={devibeTheme.colors.purple} />
        <Text style={{ color: devibeTheme.colors.purple, fontWeight: '600', fontSize: 13 }}>
          {credits.toLocaleString()}
        </Text>
      </View>

      <Pressable hitSlop={8}>
        <Bell size={20} color={devibeTheme.colors.textSecondary} />
      </Pressable>
    </View>
  );
}
