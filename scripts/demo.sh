#!/usr/bin/env bash
# DeVibe Cloud Mobile — Interactive Demo Script
set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         DeVibe Cloud Mobile — Demo Walkthrough           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

echo "▸ Step 1: Start the Expo dev server"
echo "  Run: npm start      (QR code for physical device via Expo Go)"
echo "  Run: npm run ios    (iPhone via Expo Go or simulator)"
echo "  Run: npm run android"
echo ""

echo "▸ Step 2: Explore the DeVibe Dashboard"
echo "  • Drawer nav: Home, Projects, Workspace, Agents, Cloud Factory"
echo "  • Top bar: greeting, search, credits, notifications"
echo "  • Main area: Monaco Editor + Live Preview + Agent Chat"
echo "  • Right panel: Cloud status, Activity feed, Agent team"
echo ""

echo "▸ Step 3: Monaco Editor Demo"
echo "  • Open Workspace from the drawer"
echo "  • Switch to Files tab, then Editor tab"
echo "  • Edit Expo project files with syntax highlighting"
echo "  • Tap ⌘ floating button for Command Palette"
echo ""

echo "▸ Step 4: DeVibe Cloud AI Demo"
echo "  Try these prompts in the AI Chat tab:"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │ 'Add a dark mode toggle'                                │"
echo "  │ 'Fix production bug'                                    │"
echo "  │ 'Generate AWS terraform for production'                 │"
echo "  │ 'Deploy to production'                                  │"
echo "  └─────────────────────────────────────────────────────────┘"
echo ""

echo "▸ Step 5: Cloud Factory Demo"
echo "  • Open Cloud Factory from the drawer"
echo "  • Toggle AWS or GCP"
echo "  • Review resources and deploy targets"
echo ""

echo "▸ Step 6: Review Generated Terraform"
echo "  AWS:  infra/terraform/aws/main.tf"
echo "  GCP:  infra/terraform/gcp/main.tf"
echo "  PRD:  docs/PRD.md"
echo ""

echo "✓ Demo complete! DeVibe Cloud Mobile is ready for vibe coding."
echo ""
