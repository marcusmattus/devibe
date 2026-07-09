# VibeCursor Pro

The ultimate mobile AI coding companion. A full-featured Expo (React Native) app that brings the VS Code + Cursor experience to your iPhone.

![VibeCursor Pro](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Monaco](https://img.shields.io/badge/Monaco-Editor-A855F7?style=for-the-badge)

## Features

- **Monaco Editor** — Full VS Code engine with syntax highlighting, IntelliSense, multi-file tabs, and custom dark neon theme
- **Cursor Mobile AI** — Multi-agent team (Frontend, Backend, Cloud DevOps, QA, Security) that edits code in real-time
- **Scalable Cloud Factory** — Generate production AWS/GCP infrastructure with Terraform
- **Bug Fixing Suite** — Connect cloud logs → AI diagnosis → Monaco patches
- **Live Preview & Deploy** — Expo preview + one-click deploy to Vercel, AWS, or GCP
- **DeVibe UI** — Dark futuristic purple/blue neon theme with glassmorphism

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo Go app (for mobile testing) or iOS Simulator / Android Emulator

### Installation

```bash
git clone <repo-url>
cd vibecursor-pro
npm install
```

### Development

```bash
# Start Expo dev server (shows QR code)
npm start

# Run in web browser (recommended for full Monaco experience)
npm run web

# Run on iOS simulator (requires macOS)
npm run ios

# Run on Android emulator
npm run android
```

### Demo Walkthrough

```bash
chmod +x scripts/demo.sh
npm run demo
```

## Project Structure

```
├── app/                    # Expo Router screens
├── src/
│   ├── components/
│   │   ├── ai/             # Agent chat, inline edits
│   │   ├── cloud/          # Cloud Factory, Bug Fix, Deploy views
│   │   ├── editor/         # Monaco, File Explorer, Command Palette
│   │   ├── layout/         # Sidebar, TopBar, Dashboard
│   │   ├── preview/        # Live Preview panel
│   │   └── ui/             # GlassPanel, NeonButton
│   ├── data/               # Sample project files
│   ├── services/           # AI, Cloud Factory, Bug Fix services
│   ├── stores/             # Zustand state (editor, agents, cloud, UI)
│   ├── theme/              # DeVibe theme tokens
│   └── types/              # TypeScript interfaces
├── cloud/
│   ├── aws/                # AWS Terraform (Lambda, RDS, S3, CloudWatch)
│   └── gcp/                # GCP Terraform (Cloud Run, Cloud SQL, GCS)
├── docs/
│   └── PRD.md              # Product Requirements Document
└── scripts/
    └── demo.sh             # Interactive demo script
```

## AI Agent Demo Prompts

Try these in the Agent Chat sidebar:

| Prompt | Agent | Result |
|--------|-------|--------|
| "Add a dark mode toggle to App.tsx" | Frontend | Edits App.tsx with theme toggle |
| "Enhance Button with glow effects" | Frontend | Adds neon shadow to Button.tsx |
| "Generate AWS terraform" | Cloud DevOps | Creates production infrastructure |
| "Fix the auth null reference bug" | QA | Patches useAuth.ts with null guard |
| "Add retry logic to the API" | Backend | Adds exponential backoff to api.ts |

## Cloud Infrastructure

Pre-built Terraform templates for production scale (100k+ users):

**AWS** (`cloud/aws/`):
- VPC with 3 AZs
- Lambda API (auto-scale 10–1000)
- Aurora PostgreSQL Serverless v2
- S3 with Glacier lifecycle
- CloudWatch + X-Ray + SNS alerts

**GCP** (`cloud/gcp/`):
- Cloud Run (2–100 instances)
- Cloud SQL PostgreSQL HA
- GCS with Archive lifecycle
- Cloud Monitoring alerts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 57 + React Native 0.86 |
| Language | TypeScript |
| Editor | Monaco Editor (web + WebView) |
| UI | NativeWind/Tailwind, Lucide icons |
| State | Zustand + TanStack Query |
| Navigation | expo-router |
| Backend (planned) | Supabase |
| AI (planned) | OpenAI / Anthropic / Gemini |

## Environment Variables

Create a `.env` file for production AI integration:

```env
EXPO_PUBLIC_API_URL=https://your-api.example.com
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Scalability

See [docs/PRD.md](docs/PRD.md) for the full scalability section covering:
- Auto-scaling compute (Lambda / Cloud Run)
- Managed PostgreSQL with read replicas
- Object storage with lifecycle policies
- Observability and alerting
- Cost optimization for 100k+ MAU

## License

MIT
