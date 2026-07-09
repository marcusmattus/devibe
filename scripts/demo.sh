#!/usr/bin/env bash
# VibeCursor Pro — Interactive Demo Script
set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║           VibeCursor Pro — Demo Walkthrough              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

echo "▸ Step 1: Start the Expo dev server"
echo "  Run: npm run web    (desktop browser — full Monaco)"
echo "  Run: npm run ios    (iPhone via Expo Go or simulator)"
echo "  Run: npm start      (QR code for physical device)"
echo ""

echo "▸ Step 2: Explore the DeVibe Dashboard"
echo "  • Left sidebar: Editor, Cloud Factory, Bug Fix, Deploy, Git, Settings"
echo "  • Top bar: greeting, search, credits (2,847), notifications"
echo "  • Main area: Monaco Editor + Live Preview + Agent Chat"
echo "  • Right panel: Cloud status, Activity feed, Agent team"
echo ""

echo "▸ Step 3: Monaco Editor Demo"
echo "  • Click files in the Explorer (src/App.tsx, Button.tsx, etc.)"
echo "  • Edit code with full syntax highlighting + IntelliSense"
echo "  • Press ⌘K (Ctrl+K on web) to open the Command Palette"
echo ""

echo "▸ Step 4: Cursor AI Agent Demo"
echo "  Try these prompts in the Agent Chat sidebar:"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │ 'Add a dark mode toggle to App.tsx'                     │"
echo "  │ 'Enhance the Button component with glow effects'        │"
echo "  │ 'Generate AWS terraform for a production API'           │"
echo "  │ 'Fix the auth null reference bug'                       │"
echo "  └─────────────────────────────────────────────────────────┘"
echo "  Watch the agent apply edits directly in Monaco!"
echo ""

echo "▸ Step 5: Cloud Factory Demo"
echo "  • Navigate to 'Cloud Factory' in the left sidebar"
echo "  • Select AWS or GCP"
echo "  • Describe: 'A social app with real-time chat and media uploads'"
echo "  • Click 'Generate Infrastructure'"
echo "  • Review Terraform files in cloud/aws/ or cloud/gcp/"
echo ""

echo "▸ Step 6: Bug Fixing Demo"
echo "  • Navigate to 'Bug Fix Suite'"
echo "  • Click 'Auto-fix with AI' on the useAuth null reference bug"
echo "  • Review AI diagnosis and Monaco patch"
echo ""

echo "▸ Step 7: Deploy Demo"
echo "  • Navigate to 'Deploy'"
echo "  • Click 'Deploy Now' on Vercel Preview or GCP Staging"
echo "  • Check Activity feed in the right panel"
echo ""

echo "▸ Step 8: Review Generated Terraform"
echo "  AWS:  cloud/aws/main.tf"
echo "  GCP:  cloud/gcp/main.tf"
echo "  PRD:  docs/PRD.md"
echo ""

echo "✓ Demo complete! VibeCursor Pro is ready for vibe coding."
echo ""
