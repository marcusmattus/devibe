import { View, Text, TextInput, Pressable, Modal, ScrollView } from 'react-native';
import { Search, File, Command, Sparkles, Cloud, Bug } from 'lucide-react-native';
import { useEditorStore } from '../../stores/editorStore';
import { useUIStore } from '../../stores/uiStore';
import { devibeTheme } from '../../theme/devibe';

const commands = [
  { id: 'palette-ai', label: 'Ask AI to edit selection', icon: Sparkles, action: 'ai' },
  { id: 'palette-cloud', label: 'Generate cloud infrastructure', icon: Cloud, action: 'cloud-factory' },
  { id: 'palette-bug', label: 'Diagnose production bug', icon: Bug, action: 'bugfix' },
  { id: 'palette-format', label: 'Format document', icon: Command, action: 'format' },
];

export function CommandPalette() {
  const { showCommandPalette, toggleCommandPalette, files, openFile } = useEditorStore();
  const { setActiveNav, searchQuery, setSearchQuery } = useUIStore();

  const query = searchQuery.toLowerCase();
  const filteredFiles = files.filter(
    (f) => f.name.toLowerCase().includes(query) || f.path.toLowerCase().includes(query)
  );
  const filteredCommands = commands.filter((c) => c.label.toLowerCase().includes(query));

  const handleSelect = (type: 'file' | 'command', id: string) => {
    if (type === 'file') {
      openFile(id);
    } else {
      const cmd = commands.find((c) => c.id === id);
      if (cmd?.action) setActiveNav(cmd.action === 'ai' ? 'editor' : cmd.action);
    }
    toggleCommandPalette();
    setSearchQuery('');
  };

  return (
    <Modal visible={showCommandPalette} transparent animationType="fade" onRequestClose={toggleCommandPalette}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-start', paddingTop: 120, alignItems: 'center' }}
        onPress={toggleCommandPalette}
      >
        <Pressable
          style={{
            width: '90%',
            maxWidth: 520,
            backgroundColor: devibeTheme.colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(168, 85, 247, 0.3)',
            overflow: 'hidden',
            ...devibeTheme.shadows.glowPurple,
          }}
          onPress={(e) => e.stopPropagation?.()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: devibeTheme.colors.glassBorder }}>
            <Search size={18} color={devibeTheme.colors.textMuted} />
            <TextInput
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Type a command or search files..."
              placeholderTextColor={devibeTheme.colors.textMuted}
              style={{ flex: 1, marginLeft: 10, color: devibeTheme.colors.textPrimary, fontSize: 15 }}
            />
            <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 11 }}>ESC</Text>
          </View>

          <ScrollView style={{ maxHeight: 360 }}>
            {filteredCommands.length > 0 && (
              <>
                <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, padding: 10, fontWeight: '600' }}>COMMANDS</Text>
                {filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <Pressable
                      key={cmd.id}
                      onPress={() => handleSelect('command', cmd.id)}
                      style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 }}
                    >
                      <Icon size={16} color={devibeTheme.colors.purple} />
                      <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 13 }}>{cmd.label}</Text>
                    </Pressable>
                  );
                })}
              </>
            )}

            {filteredFiles.length > 0 && (
              <>
                <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, padding: 10, fontWeight: '600' }}>FILES</Text>
                {filteredFiles.map((file) => (
                  <Pressable
                    key={file.id}
                    onPress={() => handleSelect('file', file.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 }}
                  >
                    <File size={16} color={devibeTheme.colors.blue} />
                    <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 13 }}>{file.path}</Text>
                  </Pressable>
                ))}
              </>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
