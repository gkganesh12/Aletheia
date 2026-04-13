export interface ProductDetail {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  gradient: [string, string];
  features: { title: string; description: string; icon: string }[];
  useCases: string[];
  techStack: string[];
  metrics: { value: string; label: string }[];
  pricing: {
    tier: string;
    price: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
  }[];
}

export const productDetails: ProductDetail[] = [
  {
    slug: "inscrape",
    name: "Inscrape",
    tagline: "AI-Powered Web Scraping",
    description:
      "Inscrape is a Python SDK that makes intelligent web scraping dead simple. Three lines of code to extract structured data from any URL — social media profiles, web pages, screenshots and clean Markdown. Published on PyPI with full async support, typed error handling and built-in rate-limit awareness. Stop writing fragile scrapers. Start extracting data.",
    gradient: ["#6366f1", "#06b6d4"],
    features: [
      {
        title: "3-Line Extraction",
        description:
          "Initialize the client, call scrape, get structured JSON. No complex configuration, no browser setup, no CSS selectors to maintain. Works out of the box for any URL.",
        icon: "Code",
      },
      {
        title: "Social Media Profiles",
        description:
          "Built-in extractors for Instagram and X/Twitter profiles that return structured data — followers, posts, bio, engagement metrics — as clean, typed JSON objects.",
        icon: "Globe",
      },
      {
        title: "Screenshot Capture",
        description:
          "Full-page and element-targeted PNG screenshots with configurable viewports. Capture visual snapshots of any page or specific DOM elements programmatically.",
        icon: "Camera",
      },
      {
        title: "Markdown Output",
        description:
          "Extract the readable content of any webpage as clean, formatted Markdown. Perfect for feeding content into LLMs, building knowledge bases or archiving web content.",
        icon: "FileText",
      },
      {
        title: "Async & Typed",
        description:
          "Full async support via AsyncInscrape for high-throughput pipelines. Typed error handling with specific exceptions for auth failures, rate limits and quota exhaustion.",
        icon: "Zap",
      },
      {
        title: "API-First Design",
        description:
          "RESTful API behind the SDK, so you can integrate from any language or platform. The Python SDK is the reference implementation — more SDKs coming soon.",
        icon: "Layers",
      },
    ],
    useCases: [
      "Building datasets for AI/ML training from web content",
      "Social media monitoring and competitive intelligence",
      "Content aggregation and knowledge base construction",
      "Automated visual regression testing via screenshots",
    ],
    techStack: [
      "Python",
      "httpx",
      "AsyncIO",
      "Hatchling",
      "pytest",
      "Ruff",
    ],
    metrics: [
      { value: "3", label: "Lines of code to scrape any URL" },
      { value: "v0.1", label: "Published on PyPI" },
      { value: "< 2s", label: "Average extraction time" },
      { value: "100%", label: "Async support coverage" },
    ],
    pricing: [
      {
        tier: "Free",
        price: "$0/mo",
        features: [
          "100 requests per month",
          "Basic URL scraping",
          "Markdown extraction",
          "Community support",
          "PyPI package access",
        ],
        cta: "Get Started",
      },
      {
        tier: "Pro",
        price: "$49/mo",
        features: [
          "10,000 requests per month",
          "Social media extractors",
          "Screenshot capture",
          "Async support",
          "Priority API access",
          "Email support",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Scale",
        price: "$199/mo",
        features: [
          "100,000 requests per month",
          "Everything in Pro",
          "Custom extractors",
          "Webhook delivery",
          "Dedicated support",
          "SLA guarantee",
        ],
        cta: "Contact Us",
      },
    ],
  },
  {
    slug: "nirvana",
    name: "Nirvana",
    tagline: "Silence the Noise",
    description:
      "Nirvana is an intelligent alert management platform built for engineering teams drowning in notifications. It aggregates alerts from Sentry, Datadog and other monitoring sources into a unified inbox, then intelligently deduplicates, routes and prioritises them — cutting noise by up to 90%. Interactive Slack actions let you ACK, snooze or resolve alerts without leaving your workflow. Your team stops ignoring alerts and starts responding to the ones that matter.",
    gradient: ["#ff6b6b", "#ff3d71"],
    features: [
      {
        title: "Unified Alert Inbox",
        description:
          "Aggregate alerts from Sentry, Datadog and other monitoring tools into a single, prioritised view. No more switching between dashboards or missing critical alerts buried in different channels.",
        icon: "Inbox",
      },
      {
        title: "Intelligent Deduplication",
        description:
          "Smart algorithms identify duplicate and related alerts, grouping them into single actionable incidents. Reduces alert volume by 60-90% without losing signal.",
        icon: "Filter",
      },
      {
        title: "Slack-Native Workflow",
        description:
          "Alerts route directly to the right Slack channels with interactive buttons — acknowledge, snooze or resolve without leaving Slack. Your team stays in flow.",
        icon: "MessageSquare",
      },
      {
        title: "Automatic Escalation",
        description:
          "Unacknowledged alerts automatically escalate to the next responder based on configurable rules and schedules. Critical issues never fall through the cracks.",
        icon: "AlertTriangle",
      },
      {
        title: "Alert Analytics",
        description:
          "Dashboard showing alert volume trends, response times, noisiest sources and team performance metrics. Understand your alert health at a glance.",
        icon: "BarChart",
      },
      {
        title: "Smart Routing",
        description:
          "Rule-based routing sends alerts to the right person or channel based on service, severity, time of day and on-call schedules. The right alert reaches the right engineer.",
        icon: "GitBranch",
      },
    ],
    useCases: [
      "Reducing alert fatigue for on-call engineering teams",
      "Centralising monitoring alerts from multiple tools",
      "Improving incident response times with Slack-native workflows",
      "Tracking alert health and team responsiveness metrics",
    ],
    techStack: [
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Slack API",
      "TypeScript",
      "Docker",
    ],
    metrics: [
      { value: "90%", label: "Alert noise reduction" },
      { value: "< 30s", label: "Alert delivery to Slack" },
      { value: "60%", label: "Faster incident response" },
      { value: "3", label: "Integrations (Sentry, Datadog, Slack)" },
    ],
    pricing: [
      {
        tier: "Starter",
        price: "$0/mo",
        features: [
          "Up to 1,000 alerts per month",
          "2 alert sources",
          "Slack integration",
          "Basic deduplication",
          "Email support",
        ],
        cta: "Get Started",
      },
      {
        tier: "Team",
        price: "$79/mo",
        features: [
          "Up to 25,000 alerts per month",
          "Unlimited alert sources",
          "Advanced deduplication",
          "Smart routing & escalation",
          "Alert analytics dashboard",
          "Priority support",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Business",
        price: "$249/mo",
        features: [
          "Unlimited alerts",
          "Everything in Team",
          "Custom integrations",
          "On-call schedule sync",
          "API access",
          "Dedicated support",
          "SSO & audit logs",
        ],
        cta: "Contact Us",
      },
    ],
  },
  {
    slug: "swarmscope",
    name: "SwarmScope",
    tagline: "Simulate Everything.",
    description:
      "SwarmScope is a multi-agent simulation engine that turns unstructured data into living worlds. Upload a PDF, a dataset or plain text — SwarmScope's GraphRAG pipeline extracts entities and relationships, then generates 5,000+ autonomous agents with distinct personalities, memories and evolving social dynamics. Run simulations to model scenarios, test hypotheses or explore emergent behaviour. Talk to any agent. Analyse outcomes with the built-in ReportAgent. All for about $5 per simulation run.",
    gradient: ["#8b5cf6", "#06b6d4"],
    features: [
      {
        title: "Data-to-Simulation Pipeline",
        description:
          "Upload any unstructured data — PDFs, text files, Markdown documents — and SwarmScope automatically extracts entities, relationships and context to generate a simulation-ready world.",
        icon: "Upload",
      },
      {
        title: "GraphRAG Extraction",
        description:
          "A purpose-built Graph-based Retrieval-Augmented Generation pipeline extracts entities, their attributes and inter-entity relationships, building a rich knowledge graph that powers agent generation.",
        icon: "GitBranch",
      },
      {
        title: "5,000+ Autonomous Agents",
        description:
          "Each agent has a distinct personality, goals, memory and social awareness. Agents interact, form relationships, make decisions and evolve — creating emergent behaviours that mirror real-world dynamics.",
        icon: "Users",
      },
      {
        title: "Dynamic Memory & Relationships",
        description:
          "Agents maintain persistent memory of interactions and form evolving relationships. Social dynamics shift over time based on agent actions, creating realistic long-term simulations.",
        icon: "Brain",
      },
      {
        title: "Interactive Agent Chat",
        description:
          "Talk directly to any simulated agent during or after a simulation. Ask questions, probe motivations, test responses — full conversational access to every entity in the simulation.",
        icon: "MessageSquare",
      },
      {
        title: "ReportAgent Analysis",
        description:
          "A built-in AI analyst that reviews simulation outcomes, identifies patterns, highlights unexpected emergent behaviours and generates structured reports summarising key findings.",
        icon: "FileText",
      },
    ],
    useCases: [
      "Scenario planning and strategic decision modelling",
      "Social dynamics research and behavioural analysis",
      "Training data generation through simulated interactions",
      "Educational simulations and historical scenario recreation",
    ],
    techStack: [
      "React 19",
      "FastAPI",
      "Python",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Docker",
    ],
    metrics: [
      { value: "5,000+", label: "Concurrent autonomous agents" },
      { value: "~$5", label: "Per simulation run" },
      { value: "< 60s", label: "Data-to-simulation generation" },
      { value: "GraphRAG", label: "Entity extraction pipeline" },
    ],
    pricing: [
      {
        tier: "Explorer",
        price: "$0/mo",
        features: [
          "3 simulation runs per month",
          "Up to 500 agents per simulation",
          "Basic data upload",
          "Agent chat",
          "Community support",
        ],
        cta: "Start Simulating",
      },
      {
        tier: "Researcher",
        price: "$59/mo",
        features: [
          "30 simulation runs per month",
          "Up to 5,000 agents per simulation",
          "PDF & multi-format upload",
          "GraphRAG extraction",
          "ReportAgent analysis",
          "Export simulation data",
          "Priority support",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Enterprise",
        price: "Custom",
        features: [
          "Unlimited simulations",
          "Everything in Researcher",
          "Custom agent archetypes",
          "API access",
          "Private deployment option",
          "Dedicated support",
          "Custom integrations",
        ],
        cta: "Contact Us",
      },
    ],
  },
];
