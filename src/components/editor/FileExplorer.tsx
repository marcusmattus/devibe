import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react-native';
import { useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { fileTree } from '../../data/sampleProject';
import { devibeTheme } from '../../theme/devibe';

type TreeNode = {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  children?: TreeNode[];
};

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const { openFile, files, activeFileId } = useEditorStore();

  if (node.type === 'file' && node.path) {
    const file = files.find((f) => f.path === node.path);
    const isActive = file?.id === activeFileId;
    return (
      <Pressable
        onPress={() => file && openFile(file.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingLeft: depth * 14 + 8,
          backgroundColor: isActive ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
        }}
      >
        <File size={14} color={isActive ? devibeTheme.colors.purple : devibeTheme.colors.textMuted} />
        <Text
          style={{
            marginLeft: 6,
            fontSize: 12,
            color: isActive ? devibeTheme.colors.purple : devibeTheme.colors.textSecondary,
          }}
        >
          {node.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <View>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingLeft: depth * 14 + 8,
        }}
      >
        {expanded ? (
          <ChevronDown size={14} color={devibeTheme.colors.textMuted} />
        ) : (
          <ChevronRight size={14} color={devibeTheme.colors.textMuted} />
        )}
        <Folder size={14} color={devibeTheme.colors.blue} style={{ marginLeft: 2 }} />
        <Text style={{ marginLeft: 6, fontSize: 12, color: devibeTheme.colors.textSecondary, fontWeight: '500' }}>
          {node.name}
        </Text>
      </Pressable>
      {expanded &&
        node.children?.map((child) => <TreeItem key={child.name + (child.path ?? '')} node={child} depth={depth + 1} />)}
    </View>
  );
}

export function FileExplorer() {
  return (
    <View
      style={{
        width: 200,
        backgroundColor: devibeTheme.colors.surface,
        borderRightWidth: 1,
        borderRightColor: devibeTheme.colors.glassBorder,
      }}
    >
      <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: devibeTheme.colors.glassBorder }}>
        <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1 }}>
          EXPLORER
        </Text>
      </View>
      <ScrollView style={{ flex: 1, paddingVertical: 8 }}>
        {fileTree.map((node) => (
          <TreeItem key={node.name} node={node} />
        ))}
      </ScrollView>
    </View>
  );
}
