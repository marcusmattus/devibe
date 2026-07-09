import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Bug, Wrench, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { useCloudStore } from '../../stores/cloudStore';
import { useAgentStore } from '../../stores/agentStore';
import { useEditorStore } from '../../stores/editorStore';
import { diagnoseBug } from '../../services/aiService';
import { GlassPanel } from '../ui/GlassPanel';
import { NeonButton } from '../ui/NeonButton';
import { devibeTheme } from '../../theme/devibe';

const severityColors = {
  critical: devibeTheme.colors.red,
  high: devibeTheme.colors.red,
  medium: devibeTheme.colors.amber,
  low: devibeTheme.colors.textMuted,
};

export function BugFixView() {
  const { bugs, resolveBug } = useCloudStore();
  const { addActivity, setAgentStatus } = useAgentStore();
  const { applyEdit, openFile, files } = useEditorStore();
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Record<string, string>>({});

  const handleFix = async (bugId: string) => {
    const bug = bugs.find((b) => b.id === bugId);
    if (!bug) return;

    setFixingId(bugId);
    setAgentStatus('qa', 'thinking');

    const result = await diagnoseBug(
      bug.title,
      bug.stackTrace,
      files.map((f) => ({ path: f.path, content: f.content }))
    );
    setDiagnosis((prev) => ({ ...prev, [bugId]: result.diagnosis }));

    if (result.patch) {
      applyEdit(result.patch.filePath, result.patch.newContent);
      const file = files.find((f) => f.path === result.patch!.filePath);
      if (file) openFile(file.id);
      resolveBug(bugId);
      addActivity({
        type: 'bugfix',
        title: `Fixed: ${bug.title}`,
        description: result.patch.description,
      });
    }

    setAgentStatus('qa', 'idle');
    setFixingId(null);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Bug size={24} color={devibeTheme.colors.red} />
        <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
          Production Bug Fixing Suite
        </Text>
      </View>
      <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
        Connect to cloud logs and metrics. AI diagnoses issues and generates patches directly in Monaco with safe deployment
        plans.
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <GlassPanel style={{ flex: 1, padding: 12, alignItems: 'center' }}>
          <Shield size={20} color={devibeTheme.colors.green} />
          <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
            {bugs.filter((b) => b.status === 'resolved').length}
          </Text>
          <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10 }}>Resolved</Text>
        </GlassPanel>
        <GlassPanel style={{ flex: 1, padding: 12, alignItems: 'center' }}>
          <Bug size={20} color={devibeTheme.colors.red} />
          <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
            {bugs.filter((b) => b.status !== 'resolved').length}
          </Text>
          <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10 }}>Open</Text>
        </GlassPanel>
      </View>

      {bugs.map((bug) => (
        <GlassPanel key={bug.id} glow={bug.status !== 'resolved' ? 'purple' : 'none'} style={{ padding: 16, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: severityColors[bug.severity] }} />
            <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 14, fontWeight: '600', flex: 1 }}>
              {bug.title}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: bug.status === 'resolved' ? devibeTheme.colors.green : devibeTheme.colors.amber,
                textTransform: 'uppercase',
              }}
            >
              {bug.status}
            </Text>
          </View>

          <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 11, marginBottom: 8 }}>Source: {bug.source}</Text>

          {bug.stackTrace && (
            <View
              style={{
                backgroundColor: devibeTheme.colors.void,
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: devibeTheme.colors.red, fontSize: 10, fontFamily: 'monospace' }}>{bug.stackTrace}</Text>
            </View>
          )}

          {diagnosis[bug.id] && (
            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <Text style={{ color: devibeTheme.colors.blue, fontSize: 11, fontWeight: '600', marginBottom: 4 }}>
                AI Diagnosis
              </Text>
              <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, lineHeight: 16 }}>{diagnosis[bug.id]}</Text>
            </View>
          )}

          {bug.suggestedFix && bug.status !== 'resolved' && (
            <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, marginBottom: 12 }}>
              Suggested: {bug.suggestedFix}
            </Text>
          )}

          {bug.status !== 'resolved' && (
            <NeonButton
              label={fixingId === bug.id ? 'Generating patch...' : 'Auto-fix with AI'}
              onPress={() => handleFix(bug.id)}
              disabled={fixingId !== null}
              size="sm"
              icon={
                fixingId === bug.id ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Wrench size={14} color="#FFF" />
                )
              }
            />
          )}
        </GlassPanel>
      ))}
    </ScrollView>
  );
}
