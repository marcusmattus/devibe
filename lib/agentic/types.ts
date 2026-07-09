export type PermissionLevel = "read" | "write" | "admin" | "none";
export type SessionStatus = "active" | "revoked" | "expired" | "suspicious";

export type AccessScope = {
  contents: "read" | "write";
  issues: boolean;
  pullRequests: boolean;
  folders: string[];
};

export interface RepoAccessAnalysis {
  repoFullName: string;
  isPrivate: boolean;
  isOwner: boolean;
  githubPermission: PermissionLevel;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  recommendedScopes: AccessScope;
  allowedFolders: string[];
  agentSummary: string;
  anomalies: string[];
}

export interface RepoAccessSession {
  id: string;
  jwt: string;
  repoFullName: string;
  repoId: number;
  owner: string;
  repo: string;
  scopes: AccessScope;
  expiresAt: number;
  createdAt: number;
  deviceFingerprint: string;
  deviceLabel: string;
  ipAddress: string;
  status: SessionStatus;
  createdBy: string;
  durationHours: number;
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  action:
    | "session_created"
    | "session_revoked"
    | "session_expired"
    | "repo_imported"
    | "file_read"
    | "file_write"
    | "anomaly_detected"
    | "login"
    | "logout";
  sessionId?: string;
  repoFullName?: string;
  severity: "info" | "warning" | "critical";
  details: string;
  deviceFingerprint: string;
  actor: string;
}

export interface SessionJwtPayload {
  sub: string;
  sid: string;
  repo: string;
  scopes: AccessScope;
  exp: number;
  iat: number;
  dfp: string;
}

export const SESSION_DURATIONS = [
  { label: "1 hour", hours: 1 },
  { label: "4 hours", hours: 4 },
  { label: "24 hours", hours: 24 },
  { label: "7 days", hours: 168 },
] as const;

export const FOLDER_PRESETS = [
  { label: "Full repository", value: [] as string[] },
  { label: "src/ only", value: ["src"] },
  { label: "app/ only", value: ["app"] },
  { label: "components/ only", value: ["components"] },
  { label: "lib/ + utils/", value: ["lib", "utils"] },
] as const;
