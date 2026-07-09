import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useEditorStore } from '../../stores/editorStore';
import { devibeTheme } from '../../theme/devibe';

export function EditorTabs() {
  const { openTabIds, files, activeFileId, setActiveFile, closeTab } = useEditorStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        maxHeight: 36,
        backgroundColor: devibeTheme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: devibeTheme.colors.glassBorder,
      }}
    >
      {openTabIds.map((tabId) => {
        const file = files.find((f) => f.id === tabId);
        if (!file) return null;
        const isActive = tabId === activeFileId;
        return (
          <Pressable
            key={tabId}
            onPress={() => setActiveFile(tabId)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRightWidth: 1,
              borderRightColor: devibeTheme.colors.glassBorder,
              backgroundColor: isActive ? devibeTheme.colors.void : 'transparent',
              borderTopWidth: isActive ? 2 : 0,
              borderTopColor: devibeTheme.colors.purple,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: isActive ? devibeTheme.colors.textPrimary : devibeTheme.colors.textMuted,
                fontFamily: Platform.OS === 'web' ? 'JetBrains Mono, monospace' : undefined,
              }}
            >
              {file.name}
              {file.isDirty ? ' •' : ''}
            </Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                closeTab(tabId);
              }}
              hitSlop={6}
              style={{ marginLeft: 8 }}
            >
              <X size={12} color={devibeTheme.colors.textMuted} />
            </Pressable>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
