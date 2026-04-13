export interface Industry {
  slug: string;
  name: string;
  icon: string;
  description: string;
  challenges: string[];
  solutions: string[];
  stats: { value: string; label: string }[];
  useCases: string[];
}

export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Healthcare & EdTech",
    icon: "heart",
    description:
      "AI-powered platforms for healthcare systems and educational institutions — from patient data analysis to cognitive assessment pipelines and adaptive learning tools.",
    challenges: [
      "Complex data processing across medical and educational records",
      "HIPAA and FERPA compliance requirements",
      "Need for intelligent assessment and diagnostic tools",
      "Real-time analytics for student/patient outcomes",
    ],
    solutions: [
      "Dual-engine RAG+HAG systems for assessment analysis (HeuriSight)",
      "Knowledge graph construction for competency mapping",
      "AI-powered diagnostic and triage tools",
      "Compliance-aware data pipelines",
    ],
    stats: [
      { value: "Dual-Engine", label: "RAG+HAG Shipped" },
      { value: "10", label: "Cognitive Categories" },
      { value: "Production", label: "Live Systems" },
    ],
    useCases: [
      "AI-assisted educational assessment",
      "Cognitive pattern extraction from student work",
      "Knowledge graph-powered competency mapping",
      "Adaptive learning and at-risk identification",
    ],
  },
  {
    slug: "saas-startups",
    name: "SaaS & Startups",
    icon: "building",
    description:
      "MVP development, full-stack platform engineering and AI product integration for startups that need to ship fast without sacrificing code quality.",
    challenges: [
      "Tight timelines and limited budgets",
      "Need for scalable architecture from day one",
      "AI/ML integration complexity",
      "Going from idea to live product quickly",
    ],
    solutions: [
      "Rapid MVP development with production-grade architecture",
      "Full-stack platforms (React, Next.js, Node, Python)",
      "AI product integration (LLMs, RAG, agents)",
      "Cloud deployment and CI/CD setup",
    ],
    stats: [
      { value: "< 6 weeks", label: "Typical MVP Delivery" },
      { value: "10+", label: "Projects Shipped" },
      { value: "Production", label: "Always Deployed" },
    ],
    useCases: [
      "MVP development for seed-stage startups",
      "SaaS platform engineering",
      "AI feature integration into existing products",
      "Technical co-founder-as-a-service",
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    icon: "code",
    description:
      "CLI tools, SDKs, APIs and developer infrastructure — published packages on PyPI and npm with production-grade documentation and developer experience.",
    challenges: [
      "Developer experience must be exceptional",
      "APIs need to be intuitive and well-documented",
      "SDKs must support async, typing and error handling",
      "Open-source maintenance and community building",
    ],
    solutions: [
      "Python SDKs with async support and typed errors (Inscrape)",
      "TypeScript CLIs with interactive REPL and plugin systems (CodeCraft)",
      "API-first architecture for cross-language support",
      "Comprehensive documentation and test suites",
    ],
    stats: [
      { value: "2", label: "Published Packages" },
      { value: "PyPI + npm", label: "Package Registries" },
      { value: "v1.0", label: "Production Releases" },
    ],
    useCases: [
      "SDK and API development",
      "CLI tools for developer workflows",
      "AI-powered developer tooling",
      "Package publishing and maintenance",
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    icon: "shield",
    description:
      "Security auditing, penetration testing and AI-powered alert management for organisations that take security seriously.",
    challenges: [
      "Alert fatigue from too many monitoring tools",
      "Unknown vulnerabilities across web, API and cloud",
      "Compliance requirements (SOC 2, ISO 27001, GDPR)",
      "Need for proactive, not reactive security posture",
    ],
    solutions: [
      "Intelligent alert deduplication and routing (Nirvana)",
      "Penetration testing and vulnerability assessments",
      "Cloud security audits (AWS, GCP, Azure)",
      "Secure architecture design and review",
    ],
    stats: [
      { value: "90%", label: "Alert Noise Reduction" },
      { value: "CEH", label: "Certified Team" },
      { value: "OWASP", label: "Top 10 Coverage" },
    ],
    useCases: [
      "Alert management for engineering teams",
      "Web application penetration testing",
      "Cloud infrastructure security audits",
      "Secure architecture review and hardening",
    ],
  },
  {
    slug: "blockchain",
    name: "Blockchain & Web3",
    icon: "link",
    description:
      "Smart contract development, decentralised application engineering and token systems for Web3 projects that need real engineering, not hype.",
    challenges: [
      "Smart contract security is critical — bugs cost real money",
      "Full-stack DApp development requires Web2 + Web3 skills",
      "Gas optimisation impacts user experience",
      "Rapidly evolving standards and tooling",
    ],
    solutions: [
      "Solidity smart contract development with security auditing",
      "Full-stack DApp architecture with Web3 wallet integration",
      "Token and NFT system implementation",
      "Gas optimisation and deployment automation",
    ],
    stats: [
      { value: "Solidity", label: "Smart Contracts" },
      { value: "Full-Stack", label: "DApp Development" },
      { value: "Multi-Chain", label: "Ethereum, Polygon+" },
    ],
    useCases: [
      "Smart contract development and auditing",
      "DApp frontend with Web3 wallet integration",
      "Token and NFT marketplace development",
      "Cross-chain application engineering",
    ],
  },
];
