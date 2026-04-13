export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "heurisight-rag",
    title: "Building a Dual-Engine AI Assessment Platform",
    client: "HeuriSight Education",
    industry: "EdTech",
    challenge:
      "HeuriSight needed an AI system that could analyse student work, extract cognitive patterns and map them to educational competencies — combining document understanding with heuristic reasoning in a way no existing tool could handle.",
    solution:
      "We designed and built a dual-engine architecture combining Retrieval-Augmented Generation (RAG) with Heuristics-Augmented Generation (HAG). The system uses Pinecone for vector storage, Neo4j for knowledge graphs and a 10-category cognitive classification framework to extract decision-making patterns from student assessments.",
    results: [
      "Dual-engine RAG+HAG system processing educational assessments in production",
      "10-category cognitive classification framework with competency mapping",
      "Triple-store architecture (Pinecone + Neo4j + S3) for hybrid data coordination",
      "Facilitator dashboard with cohort analytics and at-risk student identification",
    ],
  },
  {
    id: "rd-fitness-platform",
    title: "Shipping a Modern Fitness Platform in 4 Weeks",
    client: "RD Fitness",
    industry: "Health & Fitness",
    challenge:
      "RD Fitness needed a high-impact website that drives membership sign-ups and enables class booking — built fast, looking premium and performing well on mobile. Budget was tight and timeline was aggressive.",
    solution:
      "We designed and built a complete fitness platform on Next.js with Tailwind CSS and Framer Motion. Dark, bold design system with electric orange accents. Membership conversion flow, class booking system, responsive across all devices. Deployed and live in under four weeks.",
    results: [
      "Full platform designed and deployed in under 4 weeks",
      "Mobile-first responsive design with Lighthouse score above 90",
      "Membership registration and class booking flows live",
      "Brand identity and design system created from scratch",
    ],
  },
  {
    id: "codecraft-cli",
    title: "Publishing an AI-Powered Developer CLI on npm",
    client: "Internal Product",
    industry: "Developer Tools",
    challenge:
      "Development teams lack AI assistance that understands project context, enforces architectural constraints and adapts to different engineering roles. Existing tools treat every codebase the same way.",
    solution:
      "We built CodeCraft — an AI governance CLI with role-based personas (PM, Architect, QA, Backend/Frontend Dev), slash commands for common workflows, a scope guard that prevents out-of-scope modifications, and a rule engine for architectural constraints. Published on npm as a globally installable package.",
    results: [
      "Published on npm as @gkganesh12/codecraft-cli v1.0.1",
      "Role-based personas with 9+ slash commands (/plan, /code, /verify, /review, etc.)",
      "Scope guard and rule engine for architectural constraint enforcement",
      "Interactive REPL with persistent context across sessions",
    ],
  },
  {
    id: "inscrape-sdk",
    title: "Launching an AI Scraping SDK on PyPI",
    client: "Internal Product",
    industry: "Data Infrastructure",
    challenge:
      "Web scraping is still painful — fragile selectors, browser automation overhead, unstructured output. Data teams need a simple, reliable way to extract structured data from any URL without building custom scrapers for every site.",
    solution:
      "We built Inscrape — a Python SDK that wraps an AI-powered scraping API. Three lines of code to get structured JSON from any URL. Built-in extractors for Instagram and X/Twitter. Full async support, typed error handling, screenshot capture and Markdown extraction. Published on PyPI with comprehensive documentation.",
    results: [
      "Published on PyPI as inscrape v0.1.0 (beta)",
      "3-line SDK covering URL scraping, screenshots and Markdown extraction",
      "Async support with typed exceptions for rate limits and auth errors",
      "Social media extractors for Instagram and X/Twitter profiles",
    ],
  },
];
