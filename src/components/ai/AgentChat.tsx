import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Sparkles } from 'lucide-react-native';
import { useAgentStore } from '../../stores/agentStore';
import { useEditorStore } from '../../stores/editorStore';
import { processAIRequest } from '../../services/aiService';
import { devibeTheme } from '../../theme/devibe';

export function AgentChat() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const { messages, agents, activeAgentId, isProcessing, addMessage, setProcessing, setAgentStatus, setActiveAgent, addActivity } =
    useAgentStore();
  const { files, applyEdit, openFile } = useEditorStore();

  const activeAgent = agents.find((a) => a.id === activeAgentId);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const prompt = input.trim();
    setInput('');
    addMessage({ role: 'user', content: prompt });
    setProcessing(true);
    setAgentStatus(activeAgentId, 'thinking');

    try {
      const response = await processAIRequest(
        prompt,
        files.map((f) => ({ path: f.path, content: f.content }))
      );

      if (response.agentId !== activeAgentId) {
        setActiveAgent(response.agentId);
      }

      setAgentStatus(response.agentId, 'editing');

      for (const edit of response.edits) {
        applyEdit(edit.filePath, edit.newContent);
        const file = files.find((f) => f.path === edit.filePath);
        if (file) openFile(file.id);
        addActivity({
          type: 'edit',
          title: `AI edit: ${edit.filePath}`,
          description: edit.description,
        });
      }

      addMessage({
        role: 'assistant',
        content: response.message,
        agentId: response.agentId,
        edits: response.edits,
      });
    } finally {
      setAgentStatus(activeAgentId, 'idle');
      setProcessing(false);
    }
  };

  return (
    <View
      style={{
        width: 320,
        backgroundColor: devibeTheme.colors.abyss,
        borderLeftWidth: 1,
        borderLeftColor: devibeTheme.colors.glassBorder,
      }}
    >
      <View
        style={{
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: devibeTheme.colors.glassBorder,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color={devibeTheme.colors.purple} />
          <Text style={{ color: devibeTheme.colors.textPrimary, fontWeight: '600', fontSize: 14 }}>
            Cursor Mobile AI
          </Text>
        </View>
        {activeAgent && (
          <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 11, marginTop: 4 }}>
            {activeAgent.avatar} {activeAgent.name} · {activeAgent.description}
          </Text>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, padding: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => {
          const agent = agents.find((a) => a.id === msg.agentId);
          return (
            <View
              key={msg.id}
              style={{
                marginBottom: 12,
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
              }}
            >
              {msg.role === 'assistant' && agent && (
                <Text style={{ color: devibeTheme.colors.purple, fontSize: 10, marginBottom: 4 }}>
                  {agent.avatar} {agent.name}
                </Text>
              )}
              <View
                style={{
                  backgroundColor:
                    msg.role === 'user' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: 10,
                  borderWidth: 1,
                  borderColor:
                    msg.role === 'user' ? 'rgba(168, 85, 247, 0.3)' : devibeTheme.colors.glassBorder,
                }}
              >
                <Text style={{ color: devibeTheme.colors.textPrimary, fontSize: 12, lineHeight: 18 }}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}
        {isProcessing && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }}>
            <ActivityIndicator size="small" color={devibeTheme.colors.purple} />
            <Text style={{ color: devibeTheme.colors.textMuted, fontSize: 11 }}>Agent thinking...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: devibeTheme.colors.glassBorder,
            gap: 8,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask AI to edit code..."
            placeholderTextColor={devibeTheme.colors.textMuted}
            multiline
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: devibeTheme.colors.textPrimary,
              fontSize: 13,
              maxHeight: 100,
              borderWidth: 1,
              borderColor: devibeTheme.colors.glassBorder,
            }}
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={isProcessing || !input.trim()}
            style={{
              backgroundColor: devibeTheme.colors.purple,
              borderRadius: 10,
              padding: 10,
              opacity: isProcessing || !input.trim() ? 0.5 : 1,
            }}
          >
            <Send size={18} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
