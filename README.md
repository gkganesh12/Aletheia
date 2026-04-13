<p align="center">
  <img src="website/public/logo.svg" alt="Aletheia AI" width="80" height="80" />
</p>

<h1 align="center">Aletheia AI</h1>

<p align="center">
  <strong>We Build What Others Pitch</strong><br/>
  AI Engineering &bull; Cybersecurity &bull; Full-Stack Development
</p>

<p align="center">
  <a href="https://www.linkedin.com/company/aletheiaaitech"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://x.com/ai_aletheia"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
  <a href="https://github.com/Aletheia-Ai-tech"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>

---

## About

Aletheia AI is an AI engineering and cybersecurity company that ships production-grade intelligent systems. We don't just consult &mdash; we build, deploy, and maintain real products. From multi-agent architectures and RAG pipelines to penetration testing and full-stack platforms, we solve hard problems with working software.

## Products

| Product | Description |
|---------|-------------|
| **Inscrape** | AI-powered web scraping SDK &mdash; 3 lines of code to get structured JSON from any URL. Built-in extractors for Instagram and X/Twitter. Published on PyPI. |
| **Nirvana** | Alert management & deduplication platform. Aggregates Sentry, Datadog, and more. Reduces alert noise by 60&ndash;90% with smart routing to Slack. |
| **SwarmScope** | Multi-agent simulation engine supporting 5,000+ concurrent agents with memory, social dynamics, and GraphRAG entity extraction. |

## Services

- **AI Product Engineering** &mdash; LLM applications, multi-agent systems, RAG, computer vision
- **MVP & Rapid Prototyping** &mdash; Scope to ship, fast
- **Full-Stack Development** &mdash; React, Next.js, Node, Python, Go, Rust
- **Cybersecurity & Auditing** &mdash; Security audits, penetration testing, CEH-certified team
- **Blockchain & Web3** &mdash; Smart contracts, DApps, token systems
- **Data Engineering & ML** &mdash; Data pipelines, model training, MLOps

## Repository Structure

This is a monorepo with two npm workspaces:

```
.
├── website/          # Marketing website (React 19 + Vite 8 + Tailwind v4)
├── agents/           # AI dev workflow pipeline (13 agents + Claude API)
├── render.yaml       # Render deployment configuration
├── CLAUDE.md         # Project instructions for Claude Code
└── package.json      # Monorepo root
```

### Website

The marketing website built with a modern stack and a dark, premium design system.

**Tech stack:** React 19 &bull; TypeScript &bull; Vite 8 &bull; Tailwind CSS v4 &bull; Framer Motion &bull; GSAP &bull; Three.js / R3F &bull; React Router v7 &bull; Lenis

**Design system:**
- Dark theme with violet &rarr; indigo &rarr; cyan accent palette
- Fonts: Outfit (headings), DM Sans (body), JetBrains Mono (code)
- Glass morphism panels, gradient text, glow effects, noise overlays

**Pages:** Home, About, Services, Products, Case Studies, Blog, Contact, Careers, Industries

### Agents

An autonomous AI pipeline of **13 agents** that generate and modify website code using the Claude API. Agents execute across 7 stages with support for parallel execution, checkpointing, and rollback.

**Pipeline stages:**

```
init ─► foundation (parallel) ─► build ─► enhance (parallel) ─► quality (parallel) ─► review ─► finalize
         ├── design-system          │       ├── animation          ├── seo-perf          │        │
         ├── theme                  │       ├── content            ├── cms               │        │
         ├── asset-gen         component    └── i18n               └── testing        code-review  deploy
         └── deploy               gen
```

**Core agents:**
| Agent | Role |
|-------|------|
| `scaffold` | Project initialization and structure setup |
| `design-system` | Brand colors, typography, component library |
| `theme` | Dark/light theme with system preference handling |
| `asset-gen` | SVG icons, favicons, OG images, product logos |
| `component-gen` | React component generation for all page sections |
| `animation` | Framer Motion + GSAP integration, reduced-motion support |
| `content` | Brand voice copywriting and SEO messaging |
| `i18n` | Multi-language support (EN, ES, FR, DE) |
| `cms` | Sanity CMS schema & integration |
| `seo-perf` | Lighthouse optimization and analytics setup |
| `testing` | Unit, accessibility, and visual testing |
| `code-review` | Comprehensive code quality review |
| `deploy` | Vercel deployment and CI/CD pipelines |

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** (ships with Node)

### Installation

```bash
git clone https://github.com/Aletheia-Ai-tech/Aletheia.git
cd Aletheia
npm install
```

### Development

```bash
# Start the website dev server
npm run dev

# Or run from the website directory
cd website && npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview the production build
npm run preview
```

### Agents Pipeline

```bash
# Set your API key
export ANTHROPIC_API_KEY=your_key_here

# Run the full pipeline (interactive mode)
npm run agents run

# Run in non-interactive mode
npm run agents run -- --auto

# Run a specific agent
npm run agents run -- --agent component-gen

# Check pipeline status
npm run agents status

# Reset pipeline state
npm run agents reset
```

### Linting & Testing

```bash
# Lint website
npm run lint

# Lint agents
cd agents && npm run lint

# Run agent tests
cd agents && npm run test

# Type check agents
cd agents && npm run typecheck
```

## Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for the agents pipeline |
| `AGENT_MODEL_*` | No | Per-agent model overrides |
| `VERCEL_TOKEN` | No | Vercel deployment token |
| `SANITY_PROJECT_ID` | No | Sanity CMS project ID |
| `SANITY_DATASET` | No | Sanity dataset name |
| `SANITY_API_TOKEN` | No | Sanity API token |
| `GA4_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID |
| `HOTJAR_SITE_ID` | No | Hotjar site ID |

## Deployment

The website is configured for deployment on **Render** as a static site. See [`render.yaml`](render.yaml) for the full configuration.

```bash
# Build command (used by Render)
npm install && npm run build --workspace=website

# Output directory
website/dist/
```

## Case Studies

| Project | What We Built |
|---------|---------------|
| **HeuriSight** | RAG-powered analytics platform with real-time document intelligence |
| **RD Fitness** | Full-stack fitness platform with AI-driven workout and nutrition planning |
| **CodeCraft CLI** | Developer productivity CLI tool with AI-assisted code generation |
| **Inscrape SDK** | Python SDK for AI-powered web scraping, published on PyPI |

## Tech Stack at a Glance

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| **Animation** | Framer Motion, GSAP, Three.js / R3F |
| **Routing** | React Router v7, Lenis (smooth scroll) |
| **AI / Agents** | Claude API (Anthropic SDK), custom 13-agent pipeline |
| **Testing** | Vitest, Testing Library, axe-core |
| **Deployment** | Render, Vercel |
| **CMS** | Sanity (optional) |

## License

Proprietary. All rights reserved.

---

<p align="center">
  <sub>Built with precision by <strong>Aletheia AI</strong> &mdash; Pune, India</sub>
</p>
