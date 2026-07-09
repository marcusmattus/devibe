import { View, Text, Pressable, ScrollView } from 'react-native';
import { Cloud, Activity, Bot, Circle } from 'lucide-react-native';
import { useUIStore } from '../../stores/uiStore';
import { useCloudStore } from '../../stores/cloudStore';
import { useAgentStore } from '../../stores/agentStore';
import { GlassPanel } from '../ui/GlassPanel';
import { NeonButton } from '../ui/NeonButton';
import { devibeTheme } from '../../theme/devibe';

const statusColors = {
  healthy: devibeTheme.colors.green,
  warning: devibeTheme.colors.amber,
  error: devibeTheme.colors.red,
  provisioning: devibeTheme.colors.cyan,
};

export function RightPanel() {
  const { rightPanelTab, setRightPanelTab } = useUIStore();
  const { resources, bugs, deployTargets } = useCloudStore();
  const { agents, activities } = useAgentStore();

  const tabs = [
    { id: 'cloud' as const, label: 'Cloud', icon: Cloud },
    { id: 'activity' as const, label: 'Activity', icon: Activity },
    { id: 'agents' as const, label: 'Agents', icon: Bot },
  ];

  return (
    <View
      style={{
        width: 280,
        backgroundColor: devibeTheme.colors.abyss,
        borderLeftWidth: 1,
        borderLeftColor: devibeTheme.colors.glassBorder,
      }}
    >
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: devibeTheme.colors.glassBorder }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = rightPanelTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setRightPanelTab(tab.id)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: active ? devibeTheme.colors.purple : 'transparent',
              }}
            >
              <Icon size={14} color={active ? devibeTheme.colors.purple : devibeTheme.colors.textMuted} />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: active ? '600' : '400',
                  color: active ? devibeTheme.colors.textPrimary : devibeTheme.colors.textMuted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={{ flex: 1, padding: 12 }} showsVerticalScrollIndicator={false}>
        {rightPanelTab === 'cloud' && (
          <>
            <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, marginBottom: 8, fontWeight: '600' }}>
              INFRASTRUCTURE
            </Text>
            {resources.map((r) => (
              <GlassPanel key={r.id} style={{ padding: 10, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 12, fontWeight: '500' }}>
                    {r.name}
                  </Text>
                  <Circle size={8} fill={statusColors[r.status]} color={statusColors[r.status]} />
                </View>
                <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, marginTop: 4 }}>
                  {r.type.toUpperCase()} · {r.provider.toUpperCase()} · {r.region}
                </Text>
              </GlassPanel>
            ))}

            <Text style={{ color: devibeTheme.colors.textSecondary, fontSize: 11, marginTop: 12, marginBottom: 8, fontWeight: '600' }}>
              OPEN BUGS ({bugs.filter((b) => b.status !== 'resolved').length})
            </Text>
            {bugs.filter((b) => b.status !== 'resolved').map((b) => (
              <GlassPanel key={b.id} glow="purple" style={{ padding: 10, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: b.severity === 'critical' || b.severity === 'high' ? devibeTheme.colors.red : devibeTheme.colors.amber,
                    }}
                  />
                  <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 11, fontWeight: '500', flex: 1 }}>
                    {b.title}
                  </Text>
                </View>
                <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, marginTop: 4 }}>{b.source}</Text>
              </GlassPanel>
            ))}
          </>
        )}

        {rightPanelTab === 'activity' && (
          activities.map((a) => (
            <GlassPanel key={a.id} style={{ padding: 10, marginBottom: 8 }}>
              <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 12, fontWeight: '500' }}>{a.title}</Text>
              <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10, marginTop: 4 }}>{a.description}</Text>
              <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 9, marginTop: 6 }}>
                {new Date(a.timestamp).toLocaleTimeString()}
              </Text>
            </GlassPanel>
          ))
        )}

        {rightPanelTab === 'agents' && (
          agents.map((a) => (
            <GlassPanel
              key={a.id}
              glow={a.status !== 'idle' ? 'purple' : 'none'}
              style={{ padding: 10, marginBottom: 8 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 18 }}>{a.avatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 12, fontWeight: '600' }}>{a.name}</Text>
                  <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 10 }}>{a.description}</Text>
                </View>
                <Text
                  style={{
                    fontSize: 9,
                    color: a.status === 'idle' ? devibeTheme.colors.textMuted : devibeTheme.colors.purple,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {a.status}
                </Text>
              </View>
            </GlassPanel>
          ))
        )}
      </ScrollView>

      {rightPanelTab === 'cloud' && (
        <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: devibeTheme.colors.glassBorder }}>
          <NeonButton
            label={`Deploy to ${deployTargets.find((d) => d.status === 'ready')?.name ?? 'Production'}`}
            onPress={() => {}}
            size="sm"
          />
        </View>
      )}
    </View>
  );
}
