import type { GitHubRepo, GitHubUser } from "../github/types";
import { fetchRepoPermission } from "../github/api";
import type { AccessScope, RepoAccessAnalysis } from "./types";

export async function analyzeRepoAccess(
  repo: GitHubRepo,
  user: GitHubUser,
  token: string
): Promise<RepoAccessAnalysis> {
  const isOwner = repo.owner.login.toLowerCase() === user.login.toLowerCase();
  let githubPermission: RepoAccessAnalysis["githubPermission"] = "read";

  try {
    githubPermission = await fetchRepoPermission(token, repo.owner.login, repo.name, user.login);
  } catch {
    githubPermission = repo.private ? "none" : "read";
  }

  const anomalies: string[] = [];
  let riskScore = 10;

  if (repo.private && !isOwner && githubPermission === "none") {
    anomalies.push("No collaborator access detected on private repository");
    riskScore += 60;
  }

  if (!repo.private) {
    riskScore += 15;
    anomalies.push("Public repository — contents visible to anyone on GitHub");
  }

  if (githubPermission === "admin") {
    riskScore += 20;
    anomalies.push("Admin-level GitHub permissions — write scope recommended with caution");
  }

  const riskLevel: RepoAccessAnalysis["riskLevel"] =
    riskScore >= 60 ? "high" : riskScore >= 35 ? "medium" : "low";

  const recommendedScopes: AccessScope = {
    contents: isOwner || githubPermission === "admin" || githubPermission === "write" ? "write" : "read",
    issues: isOwner || githubPermission !== "none",
    pullRequests: isOwner || githubPermission === "write" || githubPermission === "admin",
    folders: inferAllowedFolders(repo),
  };

  const agentSummary = buildAgentSummary(repo, user, isOwner, githubPermission, riskLevel);

  return {
    repoFullName: repo.full_name,
    isPrivate: repo.private,
    isOwner,
    githubPermission,
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    recommendedScopes,
    allowedFolders: inferAllowedFolders(repo),
    agentSummary,
    anomalies,
  };
}

function inferAllowedFolders(repo: GitHubRepo): string[] {
  const name = repo.name.toLowerCase();
  if (name.includes("mobile") || name.includes("expo")) return ["app", "components", "src"];
  if (name.includes("api") || name.includes("backend")) return ["src", "lib", "api"];
  return [];
}

function buildAgentSummary(
  repo: GitHubRepo,
  user: GitHubUser,
  isOwner: boolean,
  permission: RepoAccessAnalysis["githubPermission"],
  risk: RepoAccessAnalysis["riskLevel"]
): string {
  const visibility = repo.private ? "private" : "public";
  const role = isOwner ? "owner" : permission !== "none" ? `collaborator (${permission})` : "external reader";

  return `Security Agent: @${user.login} has ${role} access to ${visibility} repo "${repo.full_name}". Risk level: ${risk}. Recommended scoped session with ${permission === "write" || isOwner ? "read/write" : "read-only"} contents access.`;
}

export function detectAccessAnomaly(
  sessionDeviceFingerprint: string,
  currentFingerprint: string,
  actionsInLastMinute: number
): string | null {
  if (sessionDeviceFingerprint !== currentFingerprint) {
    return "Device fingerprint mismatch — possible session hijack";
  }
  if (actionsInLastMinute > 30) {
    return "Unusual activity volume detected (>30 actions/min)";
  }
  return null;
}

export function isPathAllowed(path: string, folders: string[]): boolean {
  if (folders.length === 0) return true;
  return folders.some((folder) => path === folder || path.startsWith(`${folder}/`));
}
