import { create } from "zustand";
import type { GitHubRepo } from "../lib/github/types";
import type {
  AccessScope,
  AuditEntry,
  RepoAccessAnalysis,
  RepoAccessSession,
} from "../lib/agentic/types";
import { analyzeRepoAccess, detectAccessAnomaly, isPathAllowed } from "../lib/agentic/permissionAgent";
import { buildRepoSession, formatSessionExpiry, isSessionExpired } from "../lib/agentic/sessionManager";
import { getDeviceFingerprint } from "../lib/agentic/deviceFingerprint";
import { fetchGitHubUser } from "../lib/github/api";
import { getSecureItem, setSecureItem, deleteSecureItem } from "../lib/secureStorage";
import { verifySessionJwt } from "../lib/agentic/jwt";

const SESSIONS_KEY = "agentic_sessions";
const AUDIT_KEY = "agentic_audit";
const IP_ALLOWLIST_KEY = "agentic_ip_allowlist";

interface AgenticAuthState {
  sessions: RepoAccessSession[];
  auditLog: AuditEntry[];
  activeSessionId: string | null;
  ipAllowlistEnabled: boolean;
  isHydrated: boolean;
  recentActionTimestamps: number[];
  hydrate: () => Promise<void>;
  createSession: (
    repo: GitHubRepo,
    userLogin: string,
    token: string,
    scopes: AccessScope,
    durationHours: number
  ) => Promise<RepoAccessSession>;
  analyzeRepo: (
    repo: GitHubRepo,
    userLogin: string,
    token: string
  ) => Promise<RepoAccessAnalysis>;
  revokeSession: (sessionId: string, actor: string) => Promise<void>;
  revokeAllSessions: (actor: string) => Promise<void>;
  setActiveSession: (sessionId: string | null) => void;
  getActiveSession: () => RepoAccessSession | null;
  validateActiveSession: () => Promise<boolean>;
  canWritePath: (path: string) => boolean;
  logAudit: (entry: Omit<AuditEntry, "id" | "timestamp" | "deviceFingerprint">) => Promise<void>;
  recordAction: () => Promise<void>;
  setIpAllowlistEnabled: (enabled: boolean) => Promise<void>;
  persist: () => Promise<void>;
}

export const useAgenticAuthStore = create<AgenticAuthState>((set, get) => ({
  sessions: [],
  auditLog: [],
  activeSessionId: null,
  ipAllowlistEnabled: false,
  isHydrated: false,
  recentActionTimestamps: [],

  hydrate: async () => {
    try {
      const [sessionsJson, auditJson, ipSetting] = await Promise.all([
        getSecureItem(SESSIONS_KEY),
        getSecureItem(AUDIT_KEY),
        getSecureItem(IP_ALLOWLIST_KEY),
      ]);

      const sessions: RepoAccessSession[] = sessionsJson ? JSON.parse(sessionsJson) : [];
      const auditLog: AuditEntry[] = auditJson ? JSON.parse(auditJson) : [];

      const now = Date.now();
      const updatedSessions = sessions.map((s) =>
        s.expiresAt <= now && s.status === "active" ? { ...s, status: "expired" as const } : s
      );

      set({
        sessions: updatedSessions,
        auditLog,
        ipAllowlistEnabled: ipSetting === "true",
        isHydrated: true,
      });
    } catch {
      set({ isHydrated: true });
    }
  },

  persist: async () => {
    const { sessions, auditLog, ipAllowlistEnabled } = get();
    await setSecureItem(SESSIONS_KEY, JSON.stringify(sessions));
    await setSecureItem(AUDIT_KEY, JSON.stringify(auditLog.slice(0, 200)));
    await setSecureItem(IP_ALLOWLIST_KEY, ipAllowlistEnabled ? "true" : "false");
  },

  analyzeRepo: async (repo, _userLogin, token) => {
    const user = await fetchGitHubUser(token);
    return analyzeRepoAccess(repo, user, token);
  },

  createSession: async (repo, userLogin, token, scopes, durationHours) => {
    const analysis = await get().analyzeRepo(repo, userLogin, token);

    if (analysis.riskLevel === "high" && scopes.contents === "write") {
      throw new Error("Security Agent blocked write access due to high risk score");
    }

    const session = await buildRepoSession({
      repo,
      userLogin,
      scopes,
      durationHours,
    });

    set((state) => ({
      sessions: [session, ...state.sessions.filter((s) => s.repoId !== repo.id)],
      activeSessionId: session.id,
    }));

    await get().logAudit({
      action: "session_created",
      sessionId: session.id,
      repoFullName: repo.full_name,
      severity: analysis.riskLevel === "high" ? "warning" : "info",
      details: `Scoped session created: ${scopes.contents} on ${scopes.folders.length ? scopes.folders.join(", ") : "full repo"} for ${durationHours}h`,
      actor: userLogin,
    });

    await get().persist();
    return session;
  },

  revokeSession: async (sessionId, actor) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "revoked" as const } : s
      ),
      activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
    }));

    const session = get().sessions.find((s) => s.id === sessionId);
    await get().logAudit({
      action: "session_revoked",
      sessionId,
      repoFullName: session?.repoFullName,
      severity: "info",
      details: `Session manually revoked by ${actor}`,
      actor,
    });
    await get().persist();
  },

  revokeAllSessions: async (actor) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.status === "active" ? { ...s, status: "revoked" as const } : s
      ),
      activeSessionId: null,
    }));
    await get().logAudit({
      action: "session_revoked",
      severity: "warning",
      details: `All sessions revoked (${actor})`,
      actor,
    });
    await get().persist();
  },

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    const session = sessions.find((s) => s.id === activeSessionId);
    if (!session || isSessionExpired(session) || session.status !== "active") return null;
    return session;
  },

  validateActiveSession: async () => {
    const session = get().getActiveSession();
    if (!session) return false;

    const payload = await verifySessionJwt(session.jwt);
    if (!payload) {
      await get().revokeSession(session.id, "system");
      return false;
    }

    const fingerprint = await getDeviceFingerprint();
    const anomaly = detectAccessAnomaly(
      session.deviceFingerprint,
      fingerprint,
      get().recentActionTimestamps.filter((t) => Date.now() - t < 60_000).length
    );

    if (anomaly) {
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === session.id ? { ...s, status: "suspicious" as const } : s
        ),
      }));
      await get().logAudit({
        action: "anomaly_detected",
        sessionId: session.id,
        repoFullName: session.repoFullName,
        severity: "critical",
        details: anomaly,
        actor: "security-agent",
      });
      await get().persist();
      return false;
    }

    return true;
  },

  canWritePath: (path) => {
    const session = get().getActiveSession();
    if (!session) return true;
    if (session.scopes.contents !== "write") return false;
    return isPathAllowed(path, session.scopes.folders);
  },

  logAudit: async (entry) => {
    const fingerprint = await getDeviceFingerprint();
    const auditEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      deviceFingerprint: fingerprint,
    };
    set((state) => ({
      auditLog: [auditEntry, ...state.auditLog].slice(0, 200),
    }));
    await get().persist();
  },

  recordAction: async () => {
    set((state) => ({
      recentActionTimestamps: [...state.recentActionTimestamps, Date.now()].slice(-50),
    }));
    await get().validateActiveSession();
  },

  setIpAllowlistEnabled: async (enabled) => {
    set({ ipAllowlistEnabled: enabled });
    await get().persist();
  },
}));

export { formatSessionExpiry, isSessionExpired };
