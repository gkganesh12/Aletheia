# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aletheia AI monorepo with two npm workspaces:
- **`website/`** — Marketing website (React 19 + TypeScript + Vite 8 + Tailwind CSS v4)
- **`agents/`** — AI dev workflow pipeline (13 agents, TypeScript + Claude API)

Node.js >= 20 required. Package manager: npm.

## Commands

### Website (primary workspace)

```bash
npm run dev          # Vite dev server (from root, proxies to website workspace)
npm run build        # TypeScript compile + Vite production build
npm run lint         # ESLint (website workspace)
npm run preview      # Preview production build locally
```

Or run directly in `website/`:
```bash
cd website && npm run dev
```

### Agents

```bash
npm run agents run                    # Full pipeline (interactive, prompts for approval)
npm run agents run -- --auto          # Non-interactive mode
npm run agents run -- --agent <name>  # Run single agent (e.g. component-gen)
npm run agents run -- --stage <id>    # Run single stage (e.g. init, build)
npm run agents status                 # Show pipeline progress
npm run agents reset                  # Clear agent state
```

Agent-specific (from `agents/` directory):
```bash
npm run build        # tsc compile
npm run test         # vitest run
npm run test:watch   # vitest watch mode
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint agents/src/
```

### Root

```bash
npm install          # Install all workspaces
```

## Architecture

### Website

**Stack:** React 19, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no PostCSS), Framer Motion, GSAP, Three.js/R3F, React Router v7, Lenis (smooth scroll).

**Import alias:** `@` → `website/src/` (configured in `vite.config.ts`).

**Build splits:** Vendor chunk (react/react-dom), Animations chunk (gsap/framer-motion).

**Routing** (`App.tsx`): Two layout modes:
- Standard routes (with Navbar, Footer, SmoothScroll, Preloader, CustomCursor): `/`, `/about`, `/services/:slug`, `/products/:slug`, `/case-studies/:slug`, `/blog/:slug`, `/contact`, `/careers`, `/industries`, `/concept`
- Standalone routes (no shared layout): `/curated-clone`

**Component organization:**
- `src/components/sections/` — Page sections (Hero, About, Services, Products, etc.)
- `src/components/shared/` — Cross-cutting components (SmoothScroll, CustomCursor, Preloader, ErrorBoundary, etc.)
- `src/components/ui/` — Primitives (Button, GradientText, SectionHeading, AnimatedCounter)
- `src/components/three/` — Three.js/R3F scenes
- `src/pages/` — Route-level page components that compose sections
- `src/data/` — All content is data-driven (products, services, testimonials, FAQ, etc.)
- `src/hooks/` — Custom hooks (useInView, useMediaQuery, useReducedMotion, useScrollDirection)

**Design system** (`src/index.css`):
- Dark theme default (primary-950: `#09090b`)
- Accent palette: Violet (`#8b5cf6`) → Indigo (`#6366f1`) → Cyan (`#06b6d4`)
- Fonts: Outfit (headings), DM Sans (body), JetBrains Mono (code)
- Utility classes: `.glass-panel`, `.gradient-text`, `.glow`, `.glow-sm`, `.noise-overlay`, `.section-alt`
- Theme tokens via Tailwind v4 `@theme` block (CSS custom properties)

**Animation approach:** Framer Motion for React component animations + GSAP for advanced timelines. `useReducedMotion` hook for accessibility.

### Agents

**Pipeline:** 7 stages, 13 agents that call the Claude API to autonomously generate/modify website code.

**Stages:** init → foundation (parallel: design-system, theme, asset-gen) → build (component-gen) → enhance (parallel: animation, content, i18n) → quality (parallel: seo-perf, cms, testing) → review (code-review) → finalize (deploy)

**Core architecture** (`agents/src/core/`):
- `base-agent.ts` — Abstract base class: plan → approve → execute → validate → approve
- `claude-client.ts` — Anthropic SDK wrapper with token tracking
- `file-ops.ts` — File CRUD with rollback capability
- `shell.ts` — Shell command execution
- `template.ts` — EJS-based code generation

**Config** (`agents/configs/`): `agents.yaml` (per-agent model/tokens/settings), `pipeline.yaml` (stage ordering/dependencies), `project.yaml` (company metadata/products)

**State:** Persisted to `agents/.state/` for checkpoint/resume.

## Environment Variables

Required: `ANTHROPIC_API_KEY`

Optional: `AGENT_MODEL_*` (per-agent model override), `VERCEL_TOKEN`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN`, `GA4_MEASUREMENT_ID`, `HOTJAR_SITE_ID`

## Key Conventions

- Content lives in `src/data/` files, not hardcoded in components
- Tailwind v4 syntax: `@import "tailwindcss"` + `@theme` block (not `tailwind.config.js`)
- Path alias `@/` for all website imports
- Pages compose section components; sections are self-contained
- Animation libraries are code-split into a separate chunk
