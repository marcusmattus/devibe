export type AgentRole =
  | 'frontend'
  | 'backend'
  | 'cloud-devops'
  | 'qa'
  | 'security'
  | 'orchestrator';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  status: 'idle' | 'thinking' | 'editing' | 'deploying';
  avatar: string;
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  language: string;
  content: string;
  isDirty?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentId?: string;
  timestamp: number;
  edits?: CodeEdit[];
}

export interface CodeEdit {
  filePath: string;
  description: string;
  oldContent?: string;
  newContent: string;
}

export interface CloudResource {
  id: string;
  type: 'lambda' | 'rds' | 's3' | 'cloud-run' | 'cloud-sql' | 'gcs' | 'terraform';
  name: string;
  provider: 'aws' | 'gcp';
  status: 'healthy' | 'warning' | 'error' | 'provisioning';
  region: string;
}

export interface ActivityItem {
  id: string;
  type: 'edit' | 'deploy' | 'bugfix' | 'generate' | 'git';
  title: string;
  description: string;
  timestamp: number;
}

export interface BugReport {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  source: string;
  stackTrace?: string;
  suggestedFix?: string;
  status: 'open' | 'patching' | 'resolved';
}

export interface DeployTarget {
  id: string;
  name: string;
  provider: 'vercel' | 'aws' | 'gcp';
  url?: string;
  status: 'ready' | 'deploying' | 'live' | 'failed';
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}
