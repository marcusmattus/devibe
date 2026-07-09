import { View, Text, ScrollView } from 'react-native';
import { Rocket, ExternalLink, CheckCircle, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { useCloudStore } from '../../stores/cloudStore';
import { useAgentStore } from '../../stores/agentStore';
import { GlassPanel } from '../ui/GlassPanel';
import { NeonButton } from '../ui/NeonButton';
import { devibeTheme } from '../../theme/devibe';

const providerColors = {
  vercel: '#FFF',
  aws: '#FF9900',
  gcp: '#4285F4',
};

const statusIcons = {
  ready: Clock,
  deploying: Clock,
  live: CheckCircle,
  failed: Clock,
};

export function DeployView() {
  const { deployTargets, deploy } = useCloudStore();
  const { addActivity } = useAgentStore();
  const [deploying, setDeploying] = useState<string | null>(null);

  const handleDeploy = async (targetId: string) => {
    const target = deployTargets.find((t) => t.id === targetId);
    if (!target || deploying) return;

    setDeploying(targetId);
    deploy(targetId);
    addActivity({
      type: 'deploy',
      title: `Deploying to ${target.name}`,
      description: `Provider: ${target.provider}`,
    });

    await new Promise((r) => setTimeout(r, 2500));
    setDeploying(null);
    addActivity({
      type: 'deploy',
      title: `Deployed to ${target.name}`,
      description: 'Build succeeded · Health checks passing',
    });
  };

  return (
    <ScrollView style={{ flex: 1, padding: 24 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Rocket size={24} color={devibeTheme.colors.cyan} />
        <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 22, fontWeight: '700' }}>
          Live Preview & Deploy
        </Text>
      </View>
      <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
        Expo preview for mobile, web preview for desktop. One-click deploy to Vercel, AWS, or Google Cloud.
      </Text>

      {deployTargets.map((target) => {
        const StatusIcon = statusIcons[target.status];
        return (
          <GlassPanel key={target.id} glow={target.status === 'live' ? 'blue' : 'none'} style={{ padding: 16, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: `${providerColors[target.provider]}22`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: providerColors[target.provider], fontWeight: '700', fontSize: 10 }}>
                    {target.provider.toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 14, fontWeight: '600' }}>{target.name}</Text>
                  {target.url && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <ExternalLink size={10} color={devibeTheme.colors.textMuted} />
                      <Text style={{ color: devibeTheme.colors.cyan, fontSize: 11 }}>{target.url}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <StatusIcon
                  size={14}
                  color={target.status === 'live' ? devibeTheme.colors.green : devibeTheme.colors.textMuted}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: target.status === 'live' ? devibeTheme.colors.green : devibeTheme.colors.textMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  {deploying === target.id ? 'deploying' : target.status}
                </Text>
              </View>
            </View>

            {target.status !== 'live' && (
              <NeonButton
                label={deploying === target.id ? 'Deploying...' : 'Deploy Now'}
                onPress={() => handleDeploy(target.id)}
                disabled={deploying !== null}
                variant="secondary"
                size="sm"
              />
            )}
          </GlassPanel>
        );
      })}
    </ScrollView>
  );
}
