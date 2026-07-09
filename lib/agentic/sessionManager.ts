import type { GitHubRepo } from "../github/types";
import type { AccessScope, RepoAccessSession } from "./types";
import { createSessionJwt } from "./jwt";
import {
  getDeviceFingerprint,
  getDeviceLabel,
  getSimulatedIpAddress,
} from "./deviceFingerprint";

export async function buildRepoSession(params: {
  repo: GitHubRepo;
  userLogin: string;
  scopes: AccessScope;
  durationHours: number;
}): Promise<RepoAccessSession> {
  const { repo, userLogin, scopes, durationHours } = params;
  const now = Date.now();
  const expiresAt = now + durationHours * 60 * 60 * 1000;
  const sessionId = `sess_${now}_${Math.random().toString(36).slice(2, 9)}`;
  const deviceFingerprint = await getDeviceFingerprint();
  const deviceLabel = getDeviceLabel();
  const ipAddress = await getSimulatedIpAddress();

  const jwt = await createSessionJwt({
    sub: userLogin,
    sid: sessionId,
    repo: repo.full_name,
    scopes,
    exp: Math.floor(expiresAt / 1000),
    iat: Math.floor(now / 1000),
    dfp: deviceFingerprint,
  });

  return {
    id: sessionId,
    jwt,
    repoFullName: repo.full_name,
    repoId: repo.id,
    owner: repo.owner.login,
    repo: repo.name,
    scopes,
    expiresAt,
    createdAt: now,
    deviceFingerprint,
    deviceLabel,
    ipAddress,
    status: "active",
    createdBy: userLogin,
    durationHours,
  };
}

export function isSessionExpired(session: RepoAccessSession): boolean {
  return session.expiresAt <= Date.now() || session.status === "expired";
}

export function formatSessionExpiry(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}
