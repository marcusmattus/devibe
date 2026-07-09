import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Bot, Send, Trash2, Code } from "lucide-react-native";
import { useRef, useEffect } from "react";
import { colors, radius } from "../../constants/theme";
import { useAgentStore } from "../../stores/agentStore";
import { useProjectStore } from "../../stores/projectStore";

const AGENT_COLORS: Record<string, string> = {
  orchestrator: colors.purple,
  frontend: colors.blue,
  backend: colors.green,
  cloud: colors.orange,
  qa: colors.red,
  security: "#EC4899",
};

export function AgentChat() {
  const scrollRef = useRef<ScrollView>(null);
  const messages = useAgentStore((s) => s.messages);
  const prompt = useAgentStore((s) => s.prompt);
  const isThinking = useAgentStore((s) => s.isThinking);
  const agents = useAgentStore((s) => s.agents);
  const setPrompt = useAgentStore((s) => s.setPrompt);
  const sendPrompt = useAgentStore((s) => s.sendPrompt);
  const clearMessages = useAgentStore((s) => s.clearMessages);
  const updateFileContent = useProjectStore((s) => s.updateFileContent);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, isThinking]);

  const applyPatch = (path: string, content: string) => {
    updateFileContent(path, content);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Bot size={18} color={colors.purple} />
          <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
            DeVibe Cloud AI
          </Text>
        </View>
        <TouchableOpacity onPress={clearMessages}>
          <Trash2 size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => {
          const agent = agents.find((a) => a.id === msg.agentId);
          const isUser = msg.role === "user";

          return (
            <View
              key={msg.id}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "90%",
              }}
            >
              {!isUser && agent && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: AGENT_COLORS[agent.role] ?? colors.purple,
                    }}
                  />
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "600" }}>
                    {agent.name}
                  </Text>
                </View>
              )}
              <View
                style={{
                  backgroundColor: isUser ? "rgba(168, 85, 247, 0.2)" : colors.card,
                  borderRadius: radius.lg,
                  borderWidth: 1,
                  borderColor: isUser ? "rgba(168, 85, 247, 0.3)" : colors.border,
                  padding: 14,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14, lineHeight: 20 }}>
                  {msg.content}
                </Text>
                {msg.codePatch && (
                  <TouchableOpacity
                    onPress={() => applyPatch(msg.codePatch!.path, msg.codePatch!.content)}
                    style={{
                      marginTop: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      padding: 10,
                      borderRadius: radius.md,
                    }}
                  >
                    <Code size={14} color={colors.purple} />
                    <Text style={{ color: colors.purple, fontSize: 12, fontWeight: "600", flex: 1 }}>
                      Apply patch to {msg.codePatch.path}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        {isThinking && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 4 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.purple,
              }}
            />
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Agents are thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 10,
          backgroundColor: colors.surface,
        }}
      >
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ask agents to edit code, fix bugs, deploy..."
          placeholderTextColor={colors.textMuted}
          multiline
          style={{
            flex: 1,
            color: colors.text,
            fontSize: 15,
            maxHeight: 100,
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => sendPrompt(prompt)}
          disabled={isThinking || !prompt.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.purple,
            alignItems: "center",
            justifyContent: "center",
            opacity: isThinking || !prompt.trim() ? 0.5 : 1,
          }}
        >
          <Send size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export function AgentTeamBar() {
  const agents = useAgentStore((s) => s.agents);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      {agents.map((agent) => (
        <View
          key={agent.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radius.full,
            backgroundColor: "rgba(26, 26, 40, 0.8)",
            borderWidth: 1,
            borderColor: agent.status === "active" ? colors.purple : colors.border,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: agent.status === "active" ? colors.green : colors.muted,
            }}
          />
          <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{agent.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
