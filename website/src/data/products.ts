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
    tagline: "Intelligence at Scale",
    description:
      "An AI-powered OSINT platform that continuously scrapes, enriches and correlates data from the surface, deep and dark web. Inscrape transforms raw noise into actionable threat intelligence with sub-second latency.",
    features: [
      "Multi-source dark web monitoring with automated entity resolution",
      "Natural-language query interface powered by fine-tuned LLMs",
      "Real-time alerting with configurable risk-scoring thresholds",
      "Graph-based relationship mapping across threat actors and TTPs",
      "API-first architecture with native SIEM and SOAR integrations",
    ],
    gradient: ["#00d4ff", "#0077ff"],
  },
  {
    id: "nirvana",
    name: "Nirvana",
    tagline: "Breach-Proof by Design",
    description:
      "A self-healing security orchestration platform that detects, contains and remediates threats autonomously. Nirvana closes the loop between detection and response so your SOC can focus on strategy instead of firefighting.",
    features: [
      "Autonomous containment with rollback-safe remediation actions",
      "Adaptive playbooks that evolve based on attacker behaviour patterns",
      "Cross-environment coverage spanning cloud, on-prem and hybrid estates",
      "AI-generated post-incident reports with compliance-ready formatting",
      "Deception-layer integration with dynamic honeypot orchestration",
    ],
    gradient: ["#ff6b6b", "#ff3d71"],
  },
  {
    id: "swarmscope",
    name: "SwarmScope",
    tagline: "See Everything. Miss Nothing.",
    description:
      "A distributed AI sensor network that provides full-spectrum visibility across your attack surface. SwarmScope deploys lightweight agents that collaborate as a swarm to detect anomalies no single tool can catch.",
    features: [
      "Swarm-intelligence anomaly detection across network, endpoint and cloud",
      "Sub-millisecond lateral-movement detection using behavioural graph analysis",
      "Zero-trust posture scoring with continuous micro-segmentation validation",
      "Unified asset inventory with automatic shadow-IT discovery",
      "Predictive risk modelling with Monte Carlo attack-path simulation",
    ],
    gradient: ["#a855f7", "#00d4ff"],
  },
];
