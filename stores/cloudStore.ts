import { create } from "zustand";

export interface CloudResource {
  id: string;
  name: string;
  type: "compute" | "database" | "storage" | "cdn" | "monitoring";
  provider: "aws" | "gcp" | "vercel";
  status: "healthy" | "warning" | "deploying";
  cost: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  type: "deploy" | "build" | "fix" | "agent" | "infra";
}

export interface DeployTarget {
  id: string;
  name: string;
  provider: "vercel" | "aws" | "gcp" | "eas";
  status: "ready" | "deploying" | "live";
  url?: string;
}

interface CloudState {
  credits: { used: number; total: number };
  resources: CloudResource[];
  activities: ActivityItem[];
  deployTargets: DeployTarget[];
  selectedProvider: "aws" | "gcp";
  terraformStatus: "idle" | "generating" | "done";
  setSelectedProvider: (provider: "aws" | "gcp") => void;
  deploy: (targetId: string) => Promise<void>;
  generateTerraform: () => Promise<void>;
}

export const useCloudStore = create<CloudState>((set, get) => ({
  credits: { used: 750, total: 1000 },
  resources: [
    { id: "1", name: "API Gateway", type: "compute", provider: "aws", status: "healthy", cost: "$42/mo" },
    { id: "2", name: "RDS PostgreSQL", type: "database", provider: "aws", status: "healthy", cost: "$89/mo" },
    { id: "3", name: "S3 Assets", type: "storage", provider: "aws", status: "healthy", cost: "$12/mo" },
    { id: "4", name: "CloudFront CDN", type: "cdn", provider: "aws", status: "healthy", cost: "$28/mo" },
    { id: "5", name: "CloudWatch", type: "monitoring", provider: "aws", status: "warning", cost: "$15/mo" },
    { id: "6", name: "Cloud Run API", type: "compute", provider: "gcp", status: "healthy", cost: "$38/mo" },
    { id: "7", name: "Cloud SQL", type: "database", provider: "gcp", status: "healthy", cost: "$72/mo" },
    { id: "8", name: "GCS Assets", type: "storage", provider: "gcp", status: "healthy", cost: "$9/mo" },
    { id: "9", name: "Cloud CDN", type: "cdn", provider: "gcp", status: "healthy", cost: "$22/mo" },
    { id: "10", name: "Stackdriver", type: "monitoring", provider: "gcp", status: "healthy", cost: "$11/mo" },
  ],
  activities: [
    { id: "1", action: "Deployed v2.1.0 to production", timestamp: "2m ago", type: "deploy" },
    { id: "2", action: "SEO Analyzer agent completed audit", timestamp: "15m ago", type: "agent" },
    { id: "3", action: "Fixed auth race condition", timestamp: "1h ago", type: "fix" },
    { id: "4", action: "EAS iOS build succeeded", timestamp: "3h ago", type: "build" },
    { id: "5", action: "Terraform plan applied (AWS)", timestamp: "Yesterday", type: "infra" },
  ],
  deployTargets: [
    { id: "eas", name: "EAS (App Store)", provider: "eas", status: "ready" },
    { id: "vercel", name: "Vercel", provider: "vercel", status: "live", url: "https://myapp.vercel.app" },
    { id: "aws", name: "AWS Amplify", provider: "aws", status: "ready" },
    { id: "gcp", name: "Google Cloud Run", provider: "gcp", status: "ready" },
  ],
  selectedProvider: "aws",
  terraformStatus: "idle",

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

  generateTerraform: async () => {
    const provider = get().selectedProvider;
    set({ terraformStatus: "generating" });
    set((state) => ({
      activities: [
        {
          id: Date.now().toString(),
          action: `Generating Terraform for ${provider.toUpperCase()}...`,
          timestamp: "Just now",
          type: "infra",
        },
        ...state.activities,
      ],
    }));

    await new Promise((r) => setTimeout(r, 2000));

    set((state) => ({
      terraformStatus: "done",
      activities: [
        {
          id: (Date.now() + 1).toString(),
          action: `Terraform plan ready (${provider.toUpperCase()}) — review in infra/terraform/${provider}/`,
          timestamp: "Just now",
          type: "infra",
        },
        ...state.activities.slice(1),
      ],
    }));
  },

  deploy: async (targetId) => {
    set((state) => ({
      deployTargets: state.deployTargets.map((t) =>
        t.id === targetId ? { ...t, status: "deploying" as const } : t
      ),
      activities: [
        {
          id: Date.now().toString(),
          action: `Deploying to ${targetId}...`,
          timestamp: "Just now",
          type: "deploy",
        },
        ...state.activities,
      ],
    }));

    await new Promise((r) => setTimeout(r, 2500));

    set((state) => ({
      deployTargets: state.deployTargets.map((t) =>
        t.id === targetId
          ? { ...t, status: "live" as const, url: `https://${targetId}.devibe.app` }
          : t
      ),
      activities: [
        {
          id: (Date.now() + 1).toString(),
          action: `Successfully deployed to ${targetId}`,
          timestamp: "Just now",
          type: "deploy",
        },
        ...state.activities.slice(1),
      ],
    }));
  },
}));
