# VibeCursor Pro — Product Requirements Document

## 1. Overview

**VibeCursor Pro** is a mobile-first AI coding companion built with Expo (React Native). It brings the VS Code + Cursor experience to iPhone (iOS-first, Android-compatible), enabling developers to vibe code, fix production bugs, generate cloud infrastructure, and deploy — all from their phone.

## 2. Goals

| Priority | Goal |
|----------|------|
| P0 | Full Monaco Editor with Cursor-style multi-agent AI editing |
| P0 | DeVibe-matching dark neon UI (purple #A855F7, electric blue accents, glassmorphism) |
| P1 | Scalable cloud infrastructure generation (AWS + GCP Terraform) |
| P1 | Production bug fixing from cloud logs → Monaco patches |
| P2 | One-click deploy to Vercel, AWS, GCP |

## 3. User Personas

- **Mobile-first developer** — codes on commute, wants full IDE power on phone
- **Indie hacker** — needs AI to scaffold apps + cloud infra quickly
- **On-call engineer** — receives alerts, needs to diagnose and patch from mobile

## 4. Core Features

### 4.1 Monaco Editor Integration
- VS Code engine via `@monaco-editor/react` (web) and WebView (iOS/Android)
- Syntax highlighting, IntelliSense, multi-file tabs, custom `vibecursor-dark` theme
- File explorer with folder tree
- Command palette (⌘K / Ctrl+K)

### 4.2 Cursor Mobile AI
- Natural language chat sidebar with 6 specialized agents:
  - Orchestrator, Frontend, Backend, Cloud DevOps, QA, Security
- Real-time code edits applied to Monaco
- Structured tool-calling architecture (extensible to OpenAI/Anthropic/Gemini APIs)
- Activity feed tracking all agent actions

### 4.3 Scalable Cloud Factory
- Describe app → generate Terraform for AWS or GCP
- Includes: auto-scaling compute, managed PostgreSQL, object storage, observability, alerting
- Cost estimates for 100k+ MAU scale

### 4.4 Production Bug Fixing Suite
- Ingest bugs from CloudWatch, Datadog, etc.
- AI diagnosis with stack trace analysis
- Auto-generate patches in Monaco with deployment safety notes

### 4.5 Live Preview & Deploy
- Expo preview panel for mobile
- Web preview on desktop
- Deploy targets: Vercel, AWS, GCP

## 5. UI/UX — DeVibe Aesthetic

| Element | Specification |
|---------|---------------|
| Background | `#030712` (void), `#0a0f1e` (abyss) |
| Accent | Purple `#A855F7`, Blue `#3B82F6`, Cyan `#00F0FF` |
| Panels | Glassmorphism: `rgba(17, 24, 39, 0.72)` + subtle borders |
| Glow | Purple/blue box-shadow on active elements |
| Layout | Left sidebar nav → Top bar → Main (editor + preview + chat) → Right panel |

## 6. Tech Stack

- **Framework:** Expo SDK 57 + TypeScript + expo-router
- **Editor:** Monaco Editor (web + WebView)
- **UI:** NativeWind/Tailwind, Lucide icons, Reanimated 3
- **State:** Zustand + TanStack Query
- **Backend (planned):** Supabase (auth, realtime, storage)
- **AI (planned):** OpenAI / Anthropic / Gemini with structured outputs
- **Cloud:** AWS SDK + GCP libraries, Terraform generation

## 7. Scalability Architecture (100k+ Users)

### 7.1 Compute
- **AWS:** Lambda with provisioned concurrency (10–1000), X-Ray tracing
- **GCP:** Cloud Run with min 2 / max 100 instances

### 7.2 Database
- **AWS:** Aurora PostgreSQL Serverless v2 (2–64 ACU auto-scale)
- **GCP:** Cloud SQL PostgreSQL HA with read replicas

### 7.3 Storage
- **AWS S3:** Lifecycle policies → Glacier after 90 days
- **GCP GCS:** Archive class transition, versioning enabled

### 7.4 Observability
- CloudWatch dashboards + SNS alerts (AWS)
- Cloud Monitoring + email notification channels (GCP)
- Error rate alarms with 5xx threshold

### 7.5 Cost Optimization
- Serverless compute (pay-per-use)
- S3/GCS lifecycle archiving
- Aurora/Cloud SQL auto-scaling bounds
- Estimated: $380–$1,200/month at 100k MAU

### 7.6 Bug Fixing Workflow
1. Cloud logs ingested → bug report created
2. QA Agent analyzes stack trace
3. Patch generated in Monaco
4. User reviews diff → deploy via safe rollout plan

## 8. Example Workflows

### New Feature
1. Open Agent Chat → "Add dark mode toggle to App.tsx"
2. Frontend Agent edits file in Monaco
3. Live Preview updates
4. Deploy to Vercel preview

### Bug Fix
1. Navigate to Bug Fix Suite
2. Select "NullReference in useAuth hook"
3. Click "Auto-fix with AI"
4. QA Agent patches `useAuth.ts` with null guard
5. Deploy to AWS Production

### Cloud Generation
1. Navigate to Cloud Factory
2. Select AWS, describe: "Social app with chat and media uploads"
3. Cloud DevOps Agent generates Terraform
4. Review resources and estimated cost
5. Deploy infrastructure

## 9. Success Metrics

- Time from prompt to working code edit < 5 seconds
- Monaco editor load time < 2 seconds on iPhone 14+
- Cloud infra generation < 30 seconds
- Bug diagnosis accuracy > 85% (with production AI APIs)

## 10. Future Roadmap

- Supabase auth integration
- Real OpenAI/Anthropic/Gemini API connections
- Git push/pull via GitHub API
- Collaborative multi-user editing
- Apple Pencil support for inline annotations
