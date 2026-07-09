# DeVibe Cloud Mobile

The DeVibe mobile companion for production Expo apps. A full-featured Expo (React Native) app that brings the VS Code + Cursor experience to your iPhone — with Monaco Editor, multi-agent AI, and production cloud infrastructure generation.

![DeVibe Cloud Mobile](https://img.shields.io/badge/Expo-SDK%2057-4630EB?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=flat-square)
![Theme](https://img.shields.io/badge/UI-DeVibe%20Dark%20Neon-A855F7?style=flat-square)

## Features

- **Monaco Editor** — Full VS Code engine in a WebView with custom `devibe-dark` theme, syntax highlighting, and multi-file editing
- **DeVibe Cloud AI** — Multi-agent team (Frontend, Backend, Cloud DevOps, QA, Security) with real-time code patches
- **DeVibe UI** — Dark futuristic purple/blue neon theme with glassmorphism, glowing elements, and animated neon orb
- **Live Preview & Deploy** — Expo/web preview with one-click deploy to EAS, Vercel, AWS, or GCP
- **Cloud Factory** — Terraform templates for AWS & GCP with auto-scaling, monitoring, and storage
- **Production Bug Fixing** — AI-driven diagnosis and patch generation workflow
- **Command Palette** — Cursor-style ⌘K command palette for quick navigation
- **GitHub Integration** — Sign in with GitHub (device flow or PAT), browse repositories, and import code into the workspace

## GitHub Sign-In

DeVibe Cloud Mobile supports GitHub authentication so you can browse and import your repositories.

### Option A: OAuth Device Flow (recommended)

1. Create a [GitHub OAuth App](https://github.com/settings/developers) (type: OAuth App)
2. Enable **Device Flow** in the app settings
3. Copy the **Client ID** and add it to `.env.local`:

```bash
cp .env.example .env.local
# Edit .env.local:
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_client_id
```

4. Restart the Expo dev server
5. Open **Repositories** in the drawer → **Sign in with GitHub**
6. Enter the device code shown in the app on GitHub

### Option B: Personal Access Token

1. Create a [GitHub PAT](https://github.com/settings/tokens) with `repo` and `read:user` scopes
2. Open **Settings** or **Repositories** → **Use Personal Access Token**
3. Paste your token and connect

Imported repos appear in **Projects** and open in the **Workspace** with files loaded from the default branch.

## Agentic Repo-Based Login

For secure freelancer and open-source collaboration, use the **Agentic Repo-Based Login System**:

1. Open **Repositories** → **Request Scoped Access** on any repo
2. Security Agent analyzes permissions and risk
3. Configure session duration, read/write scope, and folder restrictions
4. Manage sessions and audit logs in **Access Control**

See [docs/AGENTIC_LOGIN.md](docs/AGENTIC_LOGIN.md) for full documentation.

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- **[Expo Go](https://expo.dev/go)** from the App Store (supports SDK 54)
- Xcode (for iOS simulator, macOS only)

> **Note:** This project uses **Expo SDK 54** for compatibility with the App Store version of Expo Go. SDK 57+ requires a development build.

### Install & Run

```bash
# Clone and install
git clone <repo-url>
cd devibe-cloud-mobile
npm install

# Start Expo dev server
npm start

# Run on iOS simulator (macOS)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

Scan the QR code with Expo Go on your iPhone to test on device.

### Splash & Login

On launch, the app shows a **DeVibe splash screen** (animated logo + neon progress bar), then routes to the **login gateway** if not signed in.

Sign-in options:
- **GitHub** — Device flow OAuth for repo access
- **Stripe** — Connect OAuth for payments & billing (demo mode without client ID)
- **Email** — Email/password sign-in
- **Continue without signing in** — Guest mode

```bash
# Optional Stripe Connect
EXPO_PUBLIC_STRIPE_CLIENT_ID=ca_...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Type Check

```bash
npm run lint
```

## Project Structure

```
devibe-cloud-mobile/
├── app/                    # Expo Router screens
│   └── (drawer)/           # Drawer navigation screens
│       ├── index.tsx       # Home dashboard (DeVibe style)
│       ├── workspace.tsx   # Monaco Editor + Preview + AI Chat
│       ├── agents.tsx      # Multi-agent team
│       ├── cloud.tsx       # Cloud Factory & deploy
│       └── ...
├── components/
│   ├── ui/                 # GlassCard, GlowButton, NeonOrb
│   ├── layout/             # TopBar, DrawerContent
│   ├── home/               # Dashboard sections
│   ├── workspace/          # Monaco, FileExplorer, AgentChat
│   └── right-panel/        # Credits, Activity, Usage chart
├── stores/                 # Zustand state management
├── constants/              # Theme, sample projects
├── infra/terraform/        # AWS & GCP Terraform modules
└── docs/PRD.md             # Product requirements
```

## Demo Script

1. **Home Dashboard** — Open the app, see the DeVibe greeting, neon orb, and quick action chips
2. **AI Prompt** — Type "Build a SaaS landing page" in the hero input or floating chat bar
3. **Workspace** — Navigate to Workspace via drawer or tap a project
4. **Monaco Editor** — Switch to Editor tab, edit TypeScript with purple syntax theme
5. **File Explorer** — Browse project files in the Files tab
6. **AI Chat** — Switch to AI Chat tab, ask "Fix production bug" → get a code patch → tap Apply
7. **Live Preview** — Switch to Preview tab, see the rendered app preview
8. **Command Palette** — Tap the ⌘ floating button or search bar shortcut
9. **Cloud Factory** — Open Cloud Factory, toggle AWS/GCP, review resources, deploy
10. **Right Panel** — Tap panel icon for credits ring, active agents, activity timeline

## Configuration

Add API keys in **Settings** (drawer → Settings):

- OpenAI API Key
- Anthropic API Key
- Supabase URL & Anon Key

## Cloud Infrastructure

Pre-built Terraform modules for production scale:

```bash
# AWS
cd infra/terraform/aws
terraform init && terraform plan

# GCP
cd infra/terraform/gcp
terraform init && terraform plan
```

Includes: auto-scaling compute, HA databases with read replicas, CDN-backed storage, and monitoring alerts.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Expo SDK 57 + TypeScript |
| Editor | Monaco Editor 0.52 (WebView) |
| UI | NativeWind 4, expo-blur, Reanimated 3 |
| State | Zustand + TanStack Query |
| Icons | Lucide React Native |
| Navigation | Expo Router + Drawer |

## Expo to Production

DeVibe Cloud Mobile helps bridge the gap from Expo development to production:

1. **EAS Build** — Pre-configured `eas.json` in sample projects
2. **Cloud Infra** — Generate Terraform for your backend
3. **One-Click Deploy** — Deploy to EAS, Vercel, AWS, or GCP from Cloud Factory
4. **Bug Fixing** — AI agents diagnose and patch production issues
5. **Scale** — Auto-scaling, monitoring, and cost-optimized storage for 100k+ users

## License

MIT
