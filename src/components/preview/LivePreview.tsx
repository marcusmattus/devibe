import { View, Text, ScrollView } from 'react-native';
import { Smartphone, Globe } from 'lucide-react-native';
import { useEditorStore } from '../../stores/editorStore';
import { GlassPanel } from '../ui/GlassPanel';
import { devibeTheme } from '../../theme/devibe';

export function LivePreview() {
  const { getActiveFile } = useEditorStore();
  const activeFile = getActiveFile();

  return (
    <View
      style={{
        height: 200,
        borderTopWidth: 1,
        borderTopColor: devibeTheme.colors.glassBorder,
        backgroundColor: devibeTheme.colors.surface,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: devibeTheme.colors.glassBorder,
        }}
      >
        <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1 }}>
          LIVE PREVIEW
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Smartphone size={14} color={devibeTheme.colors.purple} />
          <Globe size={14} color={devibeTheme.colors.textMuted} />
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <GlassPanel glow="purple" style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: devibeTheme.colors.purple, marginBottom: 8 }}>
            Welcome to VibeCursor Pro
          </Text>
          <Text style={{ fontSize: 14, color: devibeTheme.colors.textSecondary }}>
            Your AI coding companion
          </Text>
          {activeFile && (
            <Text style={{ fontSize: 10, color: devibeTheme.colors.textMuted, marginTop: 16 }}>
              Editing: {activeFile.path}
            </Text>
          )}
        </GlassPanel>
        <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: 12 }}>
          Expo preview connects here · Web preview available on desktop
        </Text>
      </ScrollView>
    </View>
  );
}
