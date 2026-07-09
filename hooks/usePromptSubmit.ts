import { router } from "expo-router";
import { useAgentStore } from "../stores/agentStore";
import { useEditorStore } from "../stores/editorStore";

export function usePromptSubmit() {
  const prompt = useAgentStore((s) => s.prompt);
  const setPrompt = useAgentStore((s) => s.setPrompt);
  const sendPrompt = useAgentStore((s) => s.sendPrompt);
  const setWorkspaceTab = useEditorStore((s) => s.setWorkspaceTab);

  const submitPrompt = async (text?: string) => {
    const value = (text ?? prompt).trim();
    if (!value) return;
    setWorkspaceTab("chat");
    router.push("/workspace");
    await sendPrompt(value);
  };

  return { prompt, setPrompt, submitPrompt };
}
