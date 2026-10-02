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
npm run dev          # Build the static site and serve it on http://localhost:3000 (from root)
npm run build        # Generate the site into website/dist
npm test             # Rebuild and check every page (titles, descriptions, links, images)
```

Or run directly in `website/` with the same script names. The old React app is still in `website/src`
(`npm run legacy:dev` / `legacy:build` inside `website/`) but is no longer what gets deployed.

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

**The live site is plain HTML, CSS and JS** in `website/site/`, generated into `website/dist` by
`website/scripts/build-site.mjs` (Node, no dependencies). Do not convert it to React; the owner asked for it to stay HTML.

- `website/site/index.html` — the homepage, hand-written. Motion in `site/js/main.js` (GSAP ScrollTrigger, SplitText, DrawSVG, Lenis; vendored in `site/assets/vendor`).
- `website/site/data/content.json` — blog posts, case studies, services, products, industries, careers, FAQs.
- `website/scripts/build-site.mjs` — generates every other page with clean URLs (`/about`, `/blog/<slug>`, `/services/<slug>` …), and the shared head, nav, footer, cookie notice, sitemap, robots.txt, RSS and structured data.
- `website/site/js/chrome.js` — menus, cookie consent (Google Analytics loads only after "accept"), contact and application forms (Web3Forms).
- `website/scripts/build-site.test.mjs` — checks every generated page.

**Design system** (`site/css/site.css`): paper `#f5f0e6`, ink, indigo night `#0f1136`, cobalt `#2747ff`, marigold `#ffb400`, sindoor `#f24b2a`. Bricolage Grotesque for everything, Fraunces italic for the emphasised word, JetBrains Mono for labels. The logo is the real lockup in `site/assets/brand`; never redraw it.

**Legacy:** `website/src` is the previous React 19 + Vite + Tailwind app, kept for reference only.

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

- Site content lives in `website/site/data/content.json` or the templates in `build-site.mjs`, not scattered through pages
- Every page needs a unique title, a description, one `<h1>` and sized images; `npm test` enforces this
- Internal links use clean URLs without `.html`
