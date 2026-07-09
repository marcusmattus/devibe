import { View } from 'react-native';
import { Sidebar } from '../layout/Sidebar';
import { TopBar } from '../layout/TopBar';
import { RightPanel } from '../layout/RightPanel';
import { FileExplorer } from '../editor/FileExplorer';
import { EditorTabs } from '../editor/EditorTabs';
import { MonacoEditorPanel } from '../editor/MonacoEditor';
import { LivePreview } from '../preview/LivePreview';
import { AgentChat } from '../ai/AgentChat';
import { CommandPalette } from '../editor/CommandPalette';
import { CloudFactoryView } from '../cloud/CloudFactoryView';
import { BugFixView } from '../cloud/BugFixView';
import { DeployView } from '../cloud/DeployView';
import { useUIStore } from '../../stores/uiStore';
import { useEditorStore } from '../../stores/editorStore';
import { devibeTheme } from '../../theme/devibe';

function EditorWorkspace() {
  const { showPreview, showAgentChat } = useEditorStore();

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <FileExplorer />
      <View style={{ flex: 1 }}>
        <EditorTabs />
        <View style={{ flex: 1 }}>
          <MonacoEditorPanel />
        </View>
        {showPreview && <LivePreview />}
      </View>
      {showAgentChat && <AgentChat />}
    </View>
  );
}

function MainContent() {
  const { activeNav } = useUIStore();

  switch (activeNav) {
    case 'cloud-factory':
      return <CloudFactoryView />;
    case 'bugfix':
      return <BugFixView />;
    case 'deploy':
      return <DeployView />;
    case 'git':
    case 'settings':
    case 'editor':
    default:
      return <EditorWorkspace />;
  }
}

export function Dashboard() {
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: devibeTheme.colors.void }}>
      <Sidebar />
      <View style={{ flex: 1 }}>
        <TopBar />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <MainContent />
          </View>
          <RightPanel />
        </View>
      </View>
      <CommandPalette />
    </View>
  );
}
