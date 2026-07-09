import { create } from 'zustand';
import type { Agent, ChatMessage, ActivityItem } from '../types';

const defaultAgents: Agent[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    role: 'orchestrator',
    description: 'Coordinates multi-agent workflows across your project',
    status: 'idle',
    avatar: '🎯',
  },
  {
    id: 'frontend',
    name: 'Frontend Agent',
    role: 'frontend',
    description: 'React Native, UI/UX, NativeWind, animations',
    status: 'idle',
    avatar: '🎨',
  },
  {
    id: 'backend',
    name: 'Backend Agent',
    role: 'backend',
    description: 'APIs, Supabase, database schemas, auth',
    status: 'idle',
    avatar: '⚙️',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud DevOps',
    role: 'cloud-devops',
    description: 'AWS/GCP infrastructure, Terraform, CI/CD',
    status: 'idle',
    avatar: '☁️',
  },
  {
    id: 'qa',
    name: 'QA Agent',
    role: 'qa',
    description: 'Testing, edge cases, regression prevention',
    status: 'idle',
    avatar: '🧪',
  },
  {
    id: 'security',
    name: 'Security Agent',
    role: 'security',
    description: 'Auth, secrets, OWASP, dependency audits',
    status: 'idle',
    avatar: '🔒',
  },
];

interface AgentState {
  agents: Agent[];
  activeAgentId: string;
  messages: ChatMessage[];
  activities: ActivityItem[];
  isProcessing: boolean;
  setActiveAgent: (id: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setAgentStatus: (id: string, status: Agent['status']) => void;
  setProcessing: (processing: boolean) => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: defaultAgents,
  activeAgentId: 'orchestrator',
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Welcome to VibeCursor Pro! I'm your AI coding team. Ask me to edit code, fix bugs, generate cloud infrastructure, or build new features. Try: \"Add a dark mode toggle to App.tsx\"",
      agentId: 'orchestrator',
      timestamp: Date.now(),
    },
  ],
  activities: [
    {
      id: 'a1',
      type: 'generate',
      title: 'Project initialized',
      description: 'Sample React Native project loaded',
      timestamp: Date.now() - 3600000,
    },
  ],
  isProcessing: false,

  setActiveAgent: (id) => set({ activeAgentId: id }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: `msg-${Date.now()}`, timestamp: Date.now() },
      ],
    })),

  setAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  setProcessing: (processing) => set({ isProcessing: processing }),

  addActivity: (activity) =>
    set((state) => ({
      activities: [
        { ...activity, id: `act-${Date.now()}`, timestamp: Date.now() },
        ...state.activities,
      ].slice(0, 20),
    })),

  clearMessages: () => set({ messages: [] }),
}));
