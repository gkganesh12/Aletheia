export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: [string, string, string, string, string];
  gradient: [string, string];
}

export const products: Product[] = [
  {
    id: "inscrape",
    name: "Inscrape",
    tagline: "AI-Powered Web Scraping",
    description:
      "A Python SDK for intelligent web scraping — extract structured data from any URL, scrape social media profiles, capture screenshots and get clean Markdown output. Published on PyPI with full async support.",
    features: [
      "3-line SDK — scrape any URL with structured JSON output",
      "Instagram and X/Twitter profile extraction built-in",
      "Full-page and element-targeted PNG screenshots",
      "Clean Markdown extraction from any webpage",
      "Async support with typed error handling and rate-limit awareness",
    ],
    gradient: ["#6366f1", "#06b6d4"],
  },
  {
    id: "nirvana",
    name: "Nirvana",
    tagline: "Silence the Noise",
    description:
      "An intelligent alert management platform that deduplicates, routes and prioritises alerts from monitoring tools like Sentry and Datadog. Nirvana cuts alert noise by up to 90% so your team focuses on what actually matters.",
    features: [
      "Unified alert inbox aggregating Sentry, Datadog and more",
      "Intelligent deduplication that reduces noise by 60-90%",
      "Smart routing to Slack with interactive actions (ACK, Snooze, Resolve)",
      "Automatic escalation for unacknowledged critical alerts",
      "Dashboard and analytics for alert metrics and team performance",
    ],
    gradient: ["#ff6b6b", "#ff3d71"],
  },
  {
    id: "swarmscope",
    name: "SwarmScope",
    tagline: "Simulate Everything.",
    description:
      "A multi-agent simulation engine that converts unstructured data into living simulations with 5,000+ autonomous agents — each with personalities, memory and evolving social dynamics. Upload a PDF, get a world.",
    features: [
      "Upload any data (PDFs, text, Markdown) to auto-generate agent swarms",
      "GraphRAG pipeline for entity and relationship extraction",
      "5,000+ concurrent agents with dynamic memory and social dynamics",
      "Post-simulation analysis via built-in ReportAgent",
      "Interactive agent chat — talk to any simulated entity",
    ],
    gradient: ["#8b5cf6", "#06b6d4"],
  },
];
