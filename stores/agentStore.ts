import { create } from "zustand";

export type AgentRole =
  | "frontend"
  | "backend"
  | "cloud"
  | "qa"
  | "security"
  | "orchestrator";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: "active" | "idle" | "thinking";
  description: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentId?: string;
  timestamp: Date;
  codePatch?: { path: string; content: string };
}

interface AgentState {
  agents: Agent[];
  messages: ChatMessage[];
  isThinking: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  sendPrompt: (prompt: string) => Promise<void>;
  clearMessages: () => void;
}

const AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "Orchestrator",
    role: "orchestrator",
    status: "active",
    description: "Coordinates multi-agent workflows",
  },
  {
    id: "frontend",
    name: "Frontend Agent",
    role: "frontend",
    status: "idle",
    description: "React Native & Expo UI specialist",
  },
  {
    id: "backend",
    name: "Backend Agent",
    role: "backend",
    status: "idle",
    description: "API, Supabase, and data layer",
  },
  {
    id: "cloud",
    name: "Cloud DevOps",
    role: "cloud",
    status: "active",
    description: "AWS/GCP infrastructure & Terraform",
  },
  {
    id: "qa",
    name: "QA Agent",
    role: "qa",
    status: "idle",
    description: "Testing & production bug fixes",
  },
  {
    id: "security",
    name: "Security Agent",
    role: "security",
    status: "idle",
    description: "Auth, secrets, and compliance",
  },
];

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: AGENTS,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm your Cursor Mobile AI team. I can edit code in real-time, generate cloud infrastructure, fix production bugs, and help you ship Expo apps to the App Store. What would you like to build?",
      agentId: "orchestrator",
      timestamp: new Date(),
    },
  ],
  isThinking: false,
  prompt: "",

  setPrompt: (prompt) => set({ prompt }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),

  sendPrompt: async (prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    get().addMessage({ role: "user", content: trimmed });
    set({ isThinking: true, prompt: "" });

    await new Promise((r) => setTimeout(r, 1200));

    const lower = trimmed.toLowerCase();
    let response = "";
    let agentId = "orchestrator";
    let codePatch: ChatMessage["codePatch"];

    if (lower.includes("bug") || lower.includes("fix") || lower.includes("error")) {
      agentId = "qa";
      response =
        "I've analyzed your production logs. Found a race condition in the auth flow. Applying a patch to `app/index.tsx` with proper loading state handling. The fix includes error boundaries and retry logic for 100k+ user scale.";
      codePatch = {
        path: "app/index.tsx",
        content: `// Fixed: Added error boundary and loading state\nimport { useState, useEffect } from "react";\nimport { View, Text, ActivityIndicator } from "react-native";\n\nexport default function Home() {\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    loadData().catch((e) => setError(e.message)).finally(() => setLoading(false));\n  }, []);\n\n  if (loading) return <ActivityIndicator color="#A855F7" />;\n  if (error) return <Text style={{ color: "#EF4444" }}>{error}</Text>;\n  return <View>{/* content */}</View>;\n}`,
      };
    } else if (lower.includes("deploy") || lower.includes("production") || lower.includes("eas")) {
      agentId = "cloud";
      response =
        "Ready to deploy! I've prepared your EAS build config and Terraform modules. Run `eas build --platform ios --profile production` or use one-click deploy to Vercel/AWS/GCP from the Deploy tab.";
    } else if (lower.includes("cloud") || lower.includes("terraform") || lower.includes("infra") || lower.includes("scale")) {
      agentId = "cloud";
      response =
        "Generated production infrastructure: Auto-scaling Lambda/Cloud Run, RDS/Cloud SQL with read replicas, S3/GCS with CDN, CloudWatch/Stackdriver monitoring, and cost-optimized storage tiers. Check the Cloud Factory tab for Terraform files.";
    } else if (lower.includes("feature") || lower.includes("add") || lower.includes("build")) {
      agentId = "frontend";
      response =
        "I'll scaffold that feature for you. Creating components with DeVibe styling, adding navigation routes, and wiring up state management. Changes will appear in the Monaco editor in real-time.";
      codePatch = {
        path: "components/NewFeature.tsx",
        content: `import { View, Text, StyleSheet } from "react-native";\nimport { LinearGradient } from "expo-linear-gradient";\n\nexport function NewFeature() {\n  return (\n    <LinearGradient colors={["#A855F7", "#3B82F6"]} style={styles.container}>\n      <Text style={styles.title}>New Feature</Text>\n    </LinearGradient>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { padding: 20, borderRadius: 16 },\n  title: { color: "#FFF", fontSize: 18, fontWeight: "600" },\n});`,
      };
    } else {
      response =
        "I understand! Let me coordinate the team to help with that. I can edit your codebase, generate cloud infrastructure, run diagnostics on production issues, or help you ship to the App Store. Try asking me to fix a bug, add a feature, or deploy to production.";
    }

    get().addMessage({ role: "assistant", content: response, agentId, codePatch });
    set({ isThinking: false });
  },

  clearMessages: () =>
    set({
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Chat cleared. What would you like to work on?",
          agentId: "orchestrator",
          timestamp: new Date(),
        },
      ],
    }),
}));
