import { View, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Cloud, Server } from 'lucide-react-native';
import { useState } from 'react';
import { useCloudStore } from '../../stores/cloudStore';
import { useAgentStore } from '../../stores/agentStore';
import { useEditorStore } from '../../stores/editorStore';
import { generateCloudInfrastructure } from '../../services/cloudFactory';
import { GlassPanel } from '../ui/GlassPanel';
import { NeonButton } from '../ui/NeonButton';
import { devibeTheme } from '../../theme/devibe';

export function CloudFactoryView() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateCloudInfrastructure>> | null>(null);
  const { selectedProvider, setProvider, isGenerating, generationProgress, startGeneration, updateProgress, finishGeneration } =
    useCloudStore();
  const { addActivity } = useAgentStore();
  const { applyEdit } = useEditorStore();

  const handleGenerate = async () => {
    if (!description.trim() || isGenerating) return;
    startGeneration();
    setResult(null);

    const genResult = await generateCloudInfrastructure(description, selectedProvider, updateProgress);
    setResult(genResult);
    finishGeneration();

    for (const tf of genResult.terraformFiles) {
      applyEdit(tf.path.replace('cloud/aws/', 'terraform/').replace('cloud/gcp/', 'terraform/'), tf.content);
    }

    addActivity({
      type: 'generate',
      title: `Cloud infrastructure generated (${selectedProvider.toUpperCase()})`,
      description: `${genResult.resources.length} resources · ${genResult.estimatedMonthlyCost}`,
    });
  };

  return (
    <ScrollView style={{ flex: 1, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Cloud size={24} color={devibeTheme.colors.purple} />
        <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
          Scalable Cloud Factory
        </Text>
      </View>
      <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
        Describe your app and agents will generate a production-ready codebase plus cloud infrastructure with auto-scaling,
        observability, and cost optimization for 100k+ users.
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
        {(['aws', 'gcp'] as const).map((p) => (
          <NeonButton
            key={p}
            label={p === 'aws' ? 'AWS' : 'Google Cloud'}
            variant={selectedProvider === p ? 'primary' : 'secondary'}
            onPress={() => setProvider(p)}
            icon={<Server size={14} color={selectedProvider === p ? '#FFF' : devibeTheme.colors.blue} />}
          />
        ))}
      </View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. A social app with real-time chat, user profiles, and media uploads..."
        placeholderTextColor={devibeTheme.colors.textMuted}
        multiline
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: 16,
          color: devibeTheme.colors.textPrimary,
          fontSize: 14,
          minHeight: 100,
          borderWidth: 1,
          borderColor: devibeTheme.colors.glassBorder,
          marginBottom: 16,
          textAlignVertical: 'top',
        }}
      />

      <NeonButton
        label={isGenerating ? `Generating... ${generationProgress}%` : 'Generate Infrastructure'}
        onPress={handleGenerate}
        disabled={isGenerating || !description.trim()}
      />

      {isGenerating && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={devibeTheme.colors.purple} />
          <Text style={{ color: devibeTheme.colors.textMuted, marginTop: 8 }}>Cloud DevOps Agent working...</Text>
        </View>
      )}

      {result && (
        <View style={{ marginTop: 24 }}>
          <GlassPanel glow="purple" style={{ padding: 16, marginBottom: 16 }}>
            <Text style={{ color: devibeTheme.colors.green, fontWeight: '600', marginBottom: 8 }}>✓ Generation Complete</Text>
            <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 13 }}>
              Estimated cost: {result.estimatedMonthlyCost}
            </Text>
          </GlassPanel>

          <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 8 }}>
            RESOURCES
          </Text>
          {result.resources.map((r) => (
            <GlassPanel key={r} style={{ padding: 10, marginBottom: 6 }}>
              <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 12 }}>{r}</Text>
            </GlassPanel>
          ))}

          <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, fontWeight: '600', marginTop: 16, marginBottom: 8 }}>
            TERRAFORM FILES
          </Text>
          {result.terraformFiles.map((f) => (
            <GlassPanel key={f.path} style={{ padding: 10, marginBottom: 6 }}>
              <Text style={{ color: devibeTheme.colors.cyan, fontSize: 12, fontFamily: 'monospace' }}>{f.path}</Text>
            </GlassPanel>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
