export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  category: "website" | "app" | "agent" | "api" | "all";
  status: "deployed" | "in_progress" | "draft";
  updatedAt: string;
  files: ProjectFile[];
  progress?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  members?: number;
  activities?: { title: string; time: string }[];
  source?: "local" | "github";
  github?: {
    owner: string;
    repo: string;
    fullName: string;
    defaultBranch: string;
    htmlUrl: string;
    private: boolean;
  };
}

export const SAMPLE_FILES: ProjectFile[] = [
  {
    path: "app/_layout.tsx",
    name: "_layout.tsx",
    content: `import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}`,
    language: "typescript",
  },
  {
    path: "app/index.tsx",
    name: "index.tsx",
    content: `import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DeVibe Cloud Mobile</Text>
      <Text style={styles.subtitle}>
        Build production-ready Expo apps with AI
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
});`,
    language: "typescript",
  },
  {
    path: "package.json",
    name: "package.json",
    content: `{
  "name": "my-expo-app",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android"
  },
  "dependencies": {
    "expo": "~57.0.0",
    "expo-router": "~6.0.0",
    "react": "19.0.0",
    "react-native": "0.79.0"
  }
}`,
    language: "json",
  },
  {
    path: "eas.json",
    name: "eas.json",
    content: `{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}`,
    language: "json",
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Devibe Website",
    type: "Landing Page",
    category: "website",
    status: "deployed",
    updatedAt: "2m ago",
    progress: 100,
    tasksCompleted: 32,
    tasksTotal: 32,
    members: 3,
    activities: [
      { title: "Login screen updated", time: "2m ago" },
      { title: "API integration added", time: "1h ago" },
      { title: "AI model connected", time: "3h ago" },
    ],
    files: SAMPLE_FILES,
  },
  {
    id: "2",
    name: "AI Email Assistant",
    type: "Web App",
    category: "app",
    status: "in_progress",
    updatedAt: "Yesterday",
    progress: 75,
    tasksCompleted: 24,
    tasksTotal: 32,
    members: 4,
    activities: [
      { title: "Compose UI completed", time: "Yesterday" },
      { title: "SMTP integration", time: "2d ago" },
    ],
    files: SAMPLE_FILES,
  },
  {
    id: "3",
    name: "SEO Analyzer Agent",
    type: "AI Agent",
    category: "agent",
    status: "draft",
    updatedAt: "3d ago",
    progress: 40,
    tasksCompleted: 8,
    tasksTotal: 20,
    members: 2,
    files: SAMPLE_FILES,
  },
];

export const TEMPLATE_GALLERY = [
  { id: "saas", title: "SaaS Landing", category: "Website", color: "#7B61FF" },
  { id: "dashboard", title: "AI Dashboard", category: "Web App", color: "#3B82F6" },
  { id: "ecommerce", title: "E-commerce", category: "Mobile", color: "#22C55E" },
  { id: "portfolio", title: "Portfolio", category: "Website", color: "#F97316" },
  { id: "api", title: "API Starter", category: "Backend", color: "#00D1FF" },
  { id: "agent", title: "AI Agent Kit", category: "Agent", color: "#EC4899" },
];

export const CREATE_OPTIONS = [
  { id: "website", label: "Website", description: "Landing pages & marketing sites", color: "#7B61FF" },
  { id: "webapp", label: "Web App", description: "Full-stack web applications", color: "#3B82F6" },
  { id: "mobile", label: "Mobile App", description: "Expo & React Native apps", color: "#22C55E" },
  { id: "agent", label: "AI Agent", description: "Autonomous AI workflows", color: "#F97316" },
  { id: "workflow", label: "Workflow", description: "Automated pipelines", color: "#00D1FF" },
  { id: "api", label: "API / Backend", description: "REST & GraphQL services", color: "#A855F7" },
  { id: "blank", label: "Blank Project", description: "Start from scratch", color: "#6B7280" },
];

export const SUGGESTED_TEMPLATES = [
  {
    id: "saas",
    title: "Build a SaaS Landing Page",
    description: "Full-stack SaaS with auth & billing",
    contributors: 3,
    color: "#A855F7",
  },
  {
    id: "ecommerce",
    title: "E-commerce Mobile App",
    description: "Shopify-style mobile storefront",
    contributors: 5,
    color: "#3B82F6",
  },
  {
    id: "social",
    title: "Social Feed App",
    description: "Real-time social with Supabase",
    contributors: 4,
    color: "#22C55E",
  },
  {
    id: "ai",
    title: "AI Chat Assistant",
    description: "GPT-powered chat with streaming",
    contributors: 2,
    color: "#F97316",
  },
];

export const QUICK_ACTIONS = [
  "Build a SaaS Landing Page",
  "Fix production bug",
  "Add new feature",
  "Deploy to production",
  "Generate cloud infra",
  "Optimize for scale",
];
