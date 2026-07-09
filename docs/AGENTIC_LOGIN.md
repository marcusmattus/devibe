# Agentic Repo-Based Login System

DeVibe Cloud Mobile includes an **Agentic Repo-Based Login System** for secure remote developer collaboration — ideal for freelancers, open-source contributors, and distributed teams.

## Overview

Traditional login grants blanket access. The agentic system grants **time-limited, scoped sessions** based on GitHub repository permissions, with AI security analysis and full audit logging.

## Flow

1. **Connect GitHub** — Device flow OAuth or Personal Access Token
2. **Select repository** — Browse repos on the Repositories screen
3. **Request Scoped Access** — Security Agent analyzes:
   - Private vs public visibility
   - Owner vs collaborator permissions
   - Risk score and anomalies
4. **Configure session** — Choose duration, read/write scope, and folder restrictions
5. **Agent creates JWT session** — Short-lived token bound to device fingerprint
6. **Import & edit** — Repo opens in Monaco Editor with enforced permissions
7. **Audit trail** — All actions logged in Access Control
8. **Auto-revoke** — Sessions expire or revoke on anomaly detection

## Security Features

| Feature | Implementation |
|---------|----------------|
| OAuth2 + GitHub API | Device flow + PAT fallback |
| Fine-grained permissions | Read/write contents, folder scope |
| Short-lived JWT tokens | Client-signed session tokens with expiry |
| Device fingerprinting | SHA-256 device ID via SecureStore |
| IP allowlisting | Device fingerprint binding (toggle in Access Control) |
| AI anomaly detection | Rate limiting + fingerprint mismatch detection |
| Audit log | Persistent event log in Access Control screen |

## Permission Scopes

- **Contents**: `read` or `write`
- **Folders**: Full repo, or restricted to `app/`, `src/`, `components/`, etc.
- **Duration**: 1 hour, 4 hours, 24 hours, or 7 days
- **Issues / PRs**: Scoped flags (for future GitHub API integration)

## Freelancer Use Cases

### Open-source contribution
A maintainer shares a private repo. The freelancer signs in with GitHub, requests **read/write on `src/` only** for 24 hours, and edits code in Monaco. All file writes are audit-logged.

### Client handoff
A client grants collaborator access. The freelancer gets a **read-only session** on `app/` to review code before a scoped write session for bug fixes.

### Bug bounty workflow
Security researchers receive **1-hour read-only** sessions. Anomaly detection revokes access if device fingerprint changes.

## Screens

- **Repositories** — Browse GitHub repos, request scoped access
- **Access Control** — Active sessions, security settings, audit log
- **Workspace** — Session badge, collaboration indicator, permission-enforced editing

## Configuration

```bash
# .env.local
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_oauth_app_client_id
```

Enable **Device Flow** on your GitHub OAuth App.

Alternatively, use a Personal Access Token with `repo` and `read:user` scopes.

## Architecture

```
lib/agentic/
  permissionAgent.ts   # AI security analysis
  sessionManager.ts    # Session creation & expiry
  jwt.ts               # Signed session tokens
  deviceFingerprint.ts # Device identity

stores/
  authStore.ts         # GitHub OAuth
  agenticAuthStore.ts  # Sessions, audit, permissions

components/agentic/
  AgenticLoginModal.tsx
  SessionBadge.tsx
  AuditLogList.tsx
  CollaborationIndicator.tsx
```

## Production Notes

This mobile client implements the agentic layer client-side for demo and prototyping. Production deployments should add:

- Server-side JWT signing and validation
- GitHub App webhooks for permission changes
- Supabase Auth for team management
- Real IP allowlisting via backend proxy
- Centralized audit log storage
