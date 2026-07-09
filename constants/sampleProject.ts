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
  status: "deployed" | "in_progress" | "draft";
  updatedAt: string;
  files: ProjectFile[];
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
    name: "SaaS Dashboard",
    type: "Expo + Supabase",
    status: "deployed",
    updatedAt: "2 hours ago",
    files: SAMPLE_FILES,
  },
  {
    id: "2",
    name: "E-commerce Mobile",
    type: "React Native",
    status: "in_progress",
    updatedAt: "Yesterday",
    files: SAMPLE_FILES,
  },
  {
    id: "3",
    name: "Fitness Tracker",
    type: "Expo + Firebase",
    status: "draft",
    updatedAt: "3 days ago",
    files: SAMPLE_FILES,
  },
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
