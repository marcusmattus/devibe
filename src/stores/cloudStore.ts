import { create } from 'zustand';
import type { CloudResource, BugReport, DeployTarget } from '../types';

interface CloudState {
  resources: CloudResource[];
  bugs: BugReport[];
  deployTargets: DeployTarget[];
  credits: number;
  isGenerating: boolean;
  generationProgress: number;
  selectedProvider: 'aws' | 'gcp';
  setProvider: (provider: 'aws' | 'gcp') => void;
  startGeneration: () => void;
  updateProgress: (progress: number) => void;
  finishGeneration: () => void;
  resolveBug: (id: string) => void;
  deploy: (targetId: string) => void;
}

const defaultResources: CloudResource[] = [
  {
    id: 'r1',
    type: 'lambda',
    name: 'api-handler',
    provider: 'aws',
    status: 'healthy',
    region: 'us-east-1',
  },
  {
    id: 'r2',
    type: 'rds',
    name: 'postgres-primary',
    provider: 'aws',
    status: 'healthy',
    region: 'us-east-1',
  },
  {
    id: 'r3',
    type: 's3',
    name: 'assets-bucket',
    provider: 'aws',
    status: 'healthy',
    region: 'us-east-1',
  },
  {
    id: 'r4',
    type: 'cloud-run',
    name: 'api-service',
    provider: 'gcp',
    status: 'healthy',
    region: 'us-central1',
  },
];

const defaultBugs: BugReport[] = [
  {
    id: 'b1',
    severity: 'high',
    title: 'NullReference in useAuth hook',
    source: 'CloudWatch Logs',
    stackTrace: 'TypeError: Cannot read property "email" of null\n  at useAuth.ts:12',
    suggestedFix: 'Add null check before accessing user.email',
    status: 'open',
  },
  {
    id: 'b2',
    severity: 'medium',
    title: 'API timeout on /users endpoint',
    source: 'Datadog APM',
    stackTrace: 'TimeoutError: Request exceeded 5000ms\n  at api.ts:8',
    suggestedFix: 'Increase timeout and add retry logic with exponential backoff',
    status: 'open',
  },
];

const defaultDeployTargets: DeployTarget[] = [
  { id: 'd1', name: 'Vercel Preview', provider: 'vercel', status: 'ready' },
  { id: 'd2', name: 'AWS Production', provider: 'aws', url: 'https://api.vibecursor.app', status: 'live' },
  { id: 'd3', name: 'GCP Staging', provider: 'gcp', status: 'ready' },
];

export const useCloudStore = create<CloudState>((set) => ({
  resources: defaultResources,
  bugs: defaultBugs,
  deployTargets: defaultDeployTargets,
  credits: 2847,
  isGenerating: false,
  generationProgress: 0,
  selectedProvider: 'aws',

  setProvider: (provider) => set({ selectedProvider: provider }),

  startGeneration: () => set({ isGenerating: true, generationProgress: 0 }),

  updateProgress: (progress) => set({ generationProgress: progress }),

  finishGeneration: () =>
    set((state) => ({
      isGenerating: false,
      generationProgress: 100,
      resources: [
        ...state.resources,
        {
          id: `r-${Date.now()}`,
          type: 'terraform',
          name: 'generated-infra',
          provider: state.selectedProvider,
          status: 'healthy',
          region: state.selectedProvider === 'aws' ? 'us-east-1' : 'us-central1',
        },
      ],
    })),

  resolveBug: (id) =>
    set((state) => ({
      bugs: state.bugs.map((b) =>
        b.id === id ? { ...b, status: 'resolved' as const } : b
      ),
    })),

  deploy: (targetId) =>
    set((state) => ({
      deployTargets: state.deployTargets.map((t) =>
        t.id === targetId ? { ...t, status: 'deploying' as const } : t
      ),
    })),
}));
