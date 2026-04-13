export interface ServiceDetail {
  slug: string;
  name: string;
  overline: string;
  headline: string;
  description: string;
  features: { title: string; description: string }[];
  technologies: string[];
  process: { step: number; title: string; description: string }[];
  stats: { value: string; label: string; prefix?: string; suffix?: string }[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "ai-products",
    name: "AI Product Engineering",
    overline: "Build Intelligence",
    headline: "AI Products Built for the Real World",
    description:
      "We design and build AI-powered products from the ground up — LLM applications, multi-agent systems, RAG pipelines, computer vision and NLP. Not proof-of-concepts that look good in demos. Production systems that handle real users, real data and real edge cases. Our own products (Inscrape, Nirvana, SwarmScope) are the proof.",
    features: [
      {
        title: "LLM Application Development",
        description:
          "Custom applications built on top of large language models — chatbots, copilots, content generation systems, document analysis tools. Prompt engineering, fine-tuning and guardrails included.",
      },
      {
        title: "Multi-Agent Systems",
        description:
          "Architectures where specialised AI agents collaborate to handle complex workflows. We built SwarmScope with 5,000+ concurrent agents — we know how to make multi-agent systems work at scale.",
      },
      {
        title: "RAG Pipelines",
        description:
          "Retrieval-Augmented Generation systems that ground AI responses in your data. Vector databases, embedding strategies, chunk optimisation and hybrid search — built for accuracy.",
      },
      {
        title: "Production MLOps",
        description:
          "Model deployment, monitoring, versioning and retraining pipelines. We don't just build models — we build the infrastructure that keeps them performing in production.",
      },
    ],
    technologies: [
      "Python",
      "PyTorch",
      "LangChain",
      "OpenAI API",
      "Anthropic Claude API",
      "Pinecone",
      "FastAPI",
      "Docker",
    ],
    process: [
      {
        step: 1,
        title: "Problem Framing",
        description:
          "We define the AI problem clearly — what data you have, what outcome you need, what constraints exist. No AI for AI's sake.",
      },
      {
        step: 2,
        title: "Rapid Prototype",
        description:
          "A working prototype in days, not months. We validate the approach with real data before investing in production engineering.",
      },
      {
        step: 3,
        title: "Production Build",
        description:
          "The validated approach gets hardened — error handling, edge cases, scalability, monitoring. Built to handle real-world traffic.",
      },
      {
        step: 4,
        title: "Deploy & Monitor",
        description:
          "Deployed with full observability — latency tracking, accuracy monitoring, cost controls. We don't ship and forget.",
      },
    ],
    stats: [
      { value: "3", label: "AI products shipped to production" },
      { value: "5,000+", label: "Concurrent agents in SwarmScope" },
      { value: "Dual-Engine", label: "RAG+HAG system built (HeuriSight)" },
      { value: "< 4 weeks", label: "Typical prototype-to-production" },
    ],
  },
  {
    slug: "mvp-development",
    name: "MVP & Rapid Prototyping",
    overline: "Ship Fast",
    headline: "From Idea to Working Product — Fast",
    description:
      "You have an idea. You need it built, deployed and in front of users — without burning months or getting a codebase you'll have to throw away. We scope tightly, build fast and ship clean. Every MVP we deliver has production-grade architecture because we don't believe in throwaway code.",
    features: [
      {
        title: "Tight Scoping",
        description:
          "We help you identify the core problem and the simplest product that validates it. No feature creep, no gold plating — just the thing that matters.",
      },
      {
        title: "Scalable Architecture",
        description:
          "Clean code from day one. Modular components, proper API design, database schemas that won't need rewriting when you scale. We've done this enough to get it right the first time.",
      },
      {
        title: "Full Deployment",
        description:
          "We don't hand you a zip file. Your MVP ships on real infrastructure — CI/CD, monitoring, domain, SSL. Ready for users.",
      },
      {
        title: "Post-Launch Support",
        description:
          "We stick around for the first wave. Bug fixes, user feedback integration, performance tuning — we help you through the critical early days.",
      },
    ],
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "PostgreSQL",
      "Redis",
      "Vercel",
      "Docker",
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Scoping",
        description:
          "We understand your problem, your users and your constraints. Then we define the smallest product that validates the idea.",
      },
      {
        step: 2,
        title: "Design & Architecture",
        description:
          "Tech stack selection, database design, API structure. We make the big decisions early so development moves fast.",
      },
      {
        step: 3,
        title: "Sprint Build",
        description:
          "Focused development sprints with regular demos. You see progress every few days, not after months of silence.",
      },
      {
        step: 4,
        title: "Ship & Iterate",
        description:
          "Deployed to production, monitored and ready for users. Then we iterate based on real feedback.",
      },
    ],
    stats: [
      { value: "10+", label: "Projects shipped" },
      { value: "< 6 weeks", label: "Typical MVP delivery" },
      { value: "0", label: "Throwaway codebases" },
      { value: "100%", label: "Deployed to production" },
    ],
  },
  {
    slug: "full-stack",
    name: "Full-Stack Development",
    overline: "End-to-End Engineering",
    headline: "Frontend to Backend to Deploy",
    description:
      "We build complete applications — responsive frontends, robust backends, APIs, real-time systems, databases and deployment. Whatever the tech stack demands, we handle it. React, Next.js, Node, Python, Go, Rust, PostgreSQL, Redis, Docker, Kubernetes — we pick the right tool for the job and build it properly.",
    features: [
      {
        title: "Modern Frontends",
        description:
          "React, Next.js, TypeScript, Tailwind CSS. Responsive, accessible, performant UIs that work across devices. We care about the details.",
      },
      {
        title: "Robust APIs & Backends",
        description:
          "RESTful and GraphQL APIs built on Node.js, Python, Go or Rust. Proper error handling, validation, authentication and rate limiting.",
      },
      {
        title: "Database Design",
        description:
          "PostgreSQL, MongoDB, Redis, Neo4j — we pick the right database for your data model and design schemas that scale.",
      },
      {
        title: "Infrastructure & DevOps",
        description:
          "Docker, CI/CD pipelines, cloud deployment (AWS, GCP, Vercel). We don't just write code — we make sure it runs reliably.",
      },
    ],
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "Go",
      "Rust",
      "PostgreSQL",
    ],
    process: [
      {
        step: 1,
        title: "Requirements & Architecture",
        description:
          "We understand the full scope — features, integrations, scale requirements — and design an architecture that fits.",
      },
      {
        step: 2,
        title: "Foundation Sprint",
        description:
          "Core architecture, database schema, authentication, deployment pipeline. The foundation everything else builds on.",
      },
      {
        step: 3,
        title: "Feature Development",
        description:
          "Iterative feature development with regular deliverables. Frontend and backend built in parallel for speed.",
      },
      {
        step: 4,
        title: "QA, Deploy & Handover",
        description:
          "Thorough testing, production deployment, documentation and clean handover. Code you can maintain and extend.",
      },
    ],
    stats: [
      { value: "7+", label: "Tech stacks we ship in" },
      { value: "Full-Stack", label: "Frontend to deployment" },
      { value: "Clean", label: "Maintainable, documented code" },
      { value: "Production", label: "Always deployed, never prototype-only" },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity & Auditing",
    overline: "Defence Validation",
    headline: "Know Where You Stand Before Attackers Do",
    description:
      "Security audits, penetration testing, vulnerability assessments and secure architecture design. Our founder is CEH-certified with hands-on experience in both offensive and defensive security. We combine automated scanning with manual testing to find what automated tools miss — and we give you a prioritised, actionable remediation plan, not a 200-page PDF nobody reads.",
    features: [
      {
        title: "Penetration Testing",
        description:
          "Black-box and grey-box assessments across web applications, APIs, networks and cloud infrastructure. We think like attackers to find what they'd exploit.",
      },
      {
        title: "Vulnerability Assessment",
        description:
          "Automated and manual scanning of your infrastructure, applications and configurations. Every finding comes with severity rating, reproduction steps and fix guidance.",
      },
      {
        title: "Secure Architecture Review",
        description:
          "Review of your system architecture, authentication flows, data handling and cloud configuration. We identify design-level weaknesses before they become incidents.",
      },
      {
        title: "Remediation Support",
        description:
          "We don't just find problems — we help fix them. Prioritised remediation plans with hands-on support to implement the fixes that matter most.",
      },
    ],
    technologies: [
      "Burp Suite",
      "Nmap",
      "Metasploit",
      "Semgrep",
      "OWASP ZAP",
      "Wireshark",
      "Docker",
      "Cloud Security Tools",
    ],
    process: [
      {
        step: 1,
        title: "Scoping & Threat Modelling",
        description:
          "We define the engagement scope, identify critical assets and model the most likely threat scenarios for your specific situation.",
      },
      {
        step: 2,
        title: "Assessment Execution",
        description:
          "Automated scanning combined with manual testing. We document every finding with evidence and reproduction steps.",
      },
      {
        step: 3,
        title: "Analysis & Prioritisation",
        description:
          "Findings are risk-scored based on exploitability and business impact. You get a clear, prioritised remediation roadmap.",
      },
      {
        step: 4,
        title: "Fix & Retest",
        description:
          "We help implement fixes for critical findings and retest to confirm they're resolved. No open loops.",
      },
    ],
    stats: [
      { value: "CEH", label: "Certified Ethical Hacker" },
      { value: "OWASP", label: "Top 10 coverage in every audit" },
      { value: "Actionable", label: "Prioritised remediation, not PDF reports" },
      { value: "Full-Scope", label: "Web, API, cloud, network" },
    ],
  },
  {
    slug: "blockchain",
    name: "Blockchain & Web3",
    overline: "Decentralised Engineering",
    headline: "Smart Contracts to Full-Stack DApps",
    description:
      "We build blockchain applications that go beyond the hype — smart contracts, decentralised applications, token systems and Web3 platform engineering. From Solidity development to frontend integration, we handle the full stack of decentralised development with the same engineering rigour we bring to everything else.",
    features: [
      {
        title: "Smart Contract Development",
        description:
          "Solidity smart contracts with proper testing, gas optimisation and security auditing. We write contracts that handle real value safely.",
      },
      {
        title: "DApp Architecture",
        description:
          "Full-stack decentralised applications with Web3 wallet integration, on-chain/off-chain data architecture and responsive frontends.",
      },
      {
        title: "Token & NFT Systems",
        description:
          "ERC-20, ERC-721 and custom token standards. Minting, marketplace, governance and utility token implementations.",
      },
      {
        title: "Smart Contract Auditing",
        description:
          "Security review of existing smart contracts — reentrancy, overflow, access control and logic vulnerabilities. Manual review plus automated analysis.",
      },
    ],
    technologies: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "Web3.js",
      "IPFS",
      "The Graph",
      "React",
      "TypeScript",
    ],
    process: [
      {
        step: 1,
        title: "Architecture Design",
        description:
          "We design the on-chain/off-chain split, choose the right blockchain, plan gas optimisation and define the smart contract architecture.",
      },
      {
        step: 2,
        title: "Contract Development & Testing",
        description:
          "Smart contracts written with comprehensive test suites. Every edge case covered before deployment.",
      },
      {
        step: 3,
        title: "Frontend & Integration",
        description:
          "Web3 frontend with wallet connection, transaction handling and real-time on-chain data. Full DApp experience.",
      },
      {
        step: 4,
        title: "Audit & Deploy",
        description:
          "Security audit of all contracts, testnet deployment, mainnet deployment and monitoring setup.",
      },
    ],
    stats: [
      { value: "Solidity", label: "Primary smart contract language" },
      { value: "Full-Stack", label: "Contracts to frontend" },
      { value: "Audited", label: "Security-first development" },
      { value: "Multi-Chain", label: "Ethereum, Polygon and more" },
    ],
  },
  {
    slug: "data-ml",
    name: "Data Engineering & ML",
    overline: "Data Infrastructure",
    headline: "Clean Data In. Intelligent Decisions Out.",
    description:
      "AI is only as good as the data that feeds it. We build the pipelines, processing systems and ML infrastructure that transform raw data into intelligent applications. From data ingestion and transformation to model training and deployment — reliable, monitored and scalable. Our own products are proof: HeuriSight processes educational assessments through a dual-engine RAG+HAG pipeline, and SwarmScope's GraphRAG extracts entity graphs from unstructured text.",
    features: [
      {
        title: "Data Pipelines",
        description:
          "Ingestion, transformation, validation and delivery pipelines that handle your data reliably. Batch and real-time, depending on your needs.",
      },
      {
        title: "ML Model Development",
        description:
          "Custom model training, fine-tuning and evaluation. We build models tailored to your data and your problem — not off-the-shelf solutions that get you 80%.",
      },
      {
        title: "RAG & Knowledge Systems",
        description:
          "Retrieval-Augmented Generation pipelines, vector databases, embedding strategies and knowledge graph construction. We've built multiple production RAG systems.",
      },
      {
        title: "MLOps & Deployment",
        description:
          "Model serving, monitoring, versioning and retraining infrastructure. Production ML that stays accurate over time.",
      },
    ],
    technologies: [
      "Python",
      "PyTorch",
      "Pandas",
      "FastAPI",
      "Pinecone",
      "Neo4j",
      "PostgreSQL",
      "Docker",
    ],
    process: [
      {
        step: 1,
        title: "Data Assessment",
        description:
          "We audit your data sources, quality, volume and gaps. Understanding what you have determines what we can build.",
      },
      {
        step: 2,
        title: "Pipeline Design",
        description:
          "Architecture for data flow — ingestion, transformation, storage and serving. Designed for your scale and latency requirements.",
      },
      {
        step: 3,
        title: "Build & Validate",
        description:
          "Pipeline development with data quality checks at every stage. Models trained and validated against your success metrics.",
      },
      {
        step: 4,
        title: "Deploy & Monitor",
        description:
          "Production deployment with monitoring, alerting and documentation. Your team can operate it independently after handover.",
      },
    ],
    stats: [
      { value: "Dual-Engine", label: "RAG+HAG system shipped (HeuriSight)" },
      { value: "GraphRAG", label: "Entity extraction pipeline (SwarmScope)" },
      { value: "Production", label: "All ML systems deployed live" },
      { value: "End-to-End", label: "Data to deployment" },
    ],
  },
];
