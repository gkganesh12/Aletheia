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
    tagline: "Intelligence at Scale",
    description:
      "Inscrape is an AI-powered open-source intelligence (OSINT) platform that continuously scrapes, enriches and correlates data from the surface, deep and dark web. It transforms raw noise into actionable threat intelligence with sub-second latency — giving security teams the visibility they need to stay ahead of adversaries who operate in the shadows. Whether you are tracking credential leaks, monitoring threat actor chatter or mapping adversary infrastructure, Inscrape delivers the signal while eliminating the noise.",
    gradient: ["#00d4ff", "#0077ff"],
    features: [
      {
        title: "Dark Web Monitoring",
        description:
          "Automated, continuous surveillance of 200+ dark web marketplaces, forums, paste sites and Telegram channels. Entity resolution algorithms link fragmented data across sources to build comprehensive exposure profiles.",
        icon: "Globe",
      },
      {
        title: "Natural Language Query",
        description:
          "Ask complex intelligence questions in plain English. Fine-tuned LLMs translate natural language into structured queries across your entire intelligence corpus, making analysis accessible to every team member.",
        icon: "MessageSquare",
      },
      {
        title: "Real-Time Alerting",
        description:
          "Configurable alert rules with custom risk-scoring thresholds. Get notified instantly when your credentials, domains, executive names or brand assets surface anywhere across the monitored landscape.",
        icon: "Bell",
      },
      {
        title: "Threat Graph Visualisation",
        description:
          "Interactive knowledge graphs that map relationships between threat actors, TTPs, infrastructure, campaigns and your exposed assets — revealing connections invisible in flat data.",
        icon: "GitBranch",
      },
      {
        title: "API-First Architecture",
        description:
          "RESTful and GraphQL APIs with native integrations for Splunk, Sentinel, Elastic SIEM, XSOAR and other SOAR platforms. Ingest intelligence directly into your existing security workflows.",
        icon: "Code",
      },
      {
        title: "Automated Report Generation",
        description:
          "AI-generated intelligence reports tailored to different audiences — executive summaries for leadership, technical IOC packages for SOC analysts and structured STIX bundles for automated consumption.",
        icon: "FileText",
      },
    ],
    useCases: [
      "Credential leak detection and proactive password reset campaigns",
      "Threat actor tracking and adversary infrastructure mapping",
      "Brand protection and executive impersonation monitoring",
      "Supply chain risk assessment and third-party exposure monitoring",
    ],
    techStack: [
      "Python",
      "Go",
      "Apache Kafka",
      "Elasticsearch",
      "Neo4j",
      "Transformer Models",
      "Kubernetes",
      "React",
    ],
    metrics: [
      { value: "2B+", label: "Signals ingested daily" },
      { value: "200+", label: "Dark web sources monitored" },
      { value: "< 30s", label: "Average alert latency" },
      { value: "96%", label: "Precision on entity resolution" },
    ],
    pricing: [
      {
        tier: "Starter",
        price: "$2,500/mo",
        features: [
          "Up to 50 monitored keywords",
          "Surface & deep web coverage",
          "Email & Slack alerting",
          "Weekly intelligence digest",
          "REST API access",
          "5 user seats",
        ],
        cta: "Start Free Trial",
      },
      {
        tier: "Pro",
        price: "$7,500/mo",
        features: [
          "Unlimited monitored keywords",
          "Full dark web coverage",
          "Real-time alerting with custom rules",
          "Threat graph visualisation",
          "SIEM/SOAR integrations",
          "Natural language query interface",
          "Automated report generation",
          "25 user seats",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Enterprise",
        price: "Custom",
        features: [
          "Everything in Pro",
          "Dedicated intelligence analyst support",
          "Custom collection sources",
          "On-premise deployment option",
          "SLA-backed uptime guarantees",
          "Unlimited user seats",
          "Executive threat briefings",
          "Custom integrations & API priority",
        ],
        cta: "Contact Sales",
      },
    ],
  },
  {
    slug: "nirvana",
    name: "Nirvana",
    tagline: "Breach-Proof by Design",
    description:
      "Nirvana is a self-healing security orchestration platform that detects, contains and remediates threats autonomously — closing the loop between detection and response at machine speed. Built for modern SOCs drowning in alerts and hamstrung by manual playbooks, Nirvana replaces the firefighting with intelligent automation. It adapts its response strategies based on attacker behaviour, rolls back malicious changes safely and generates compliance-ready incident reports — so your analysts can focus on strategy instead of triage.",
    gradient: ["#ff6b6b", "#ff3d71"],
    features: [
      {
        title: "Autonomous Containment",
        description:
          "Automated isolation of compromised endpoints, accounts and network segments with rollback-safe remediation actions. Every autonomous action is logged with full audit trails for post-incident review.",
        icon: "ShieldOff",
      },
      {
        title: "Adaptive Playbooks",
        description:
          "Response playbooks that evolve in real time based on attacker behaviour patterns. Nirvana adjusts containment and remediation strategies mid-incident as new intelligence becomes available.",
        icon: "RefreshCw",
      },
      {
        title: "Cross-Environment Coverage",
        description:
          "Unified detection and response across cloud (AWS, Azure, GCP), on-premise, hybrid and multi-cloud environments — eliminating the blind spots that attackers exploit at environment boundaries.",
        icon: "Cloud",
      },
      {
        title: "AI Incident Reports",
        description:
          "Automatically generated post-incident reports with timeline reconstruction, root cause analysis, impact assessment and compliance-ready formatting for SOC 2, HIPAA and GDPR obligations.",
        icon: "FileCheck",
      },
      {
        title: "Deception Layer",
        description:
          "Dynamic honeypot orchestration that deploys realistic decoys across your environment. Nirvana uses attacker interactions with deception assets to enrich threat intelligence and refine detection models.",
        icon: "Eye",
      },
      {
        title: "SOC Analyst Copilot",
        description:
          "An AI assistant embedded in the analyst workflow that summarises alerts, recommends actions, auto-enriches indicators and drafts response plans — reducing mean-time-to-investigate by up to 80%.",
        icon: "Bot",
      },
    ],
    useCases: [
      "Automated ransomware containment and encrypted file rollback",
      "Cloud-native threat detection and cross-account lateral movement blocking",
      "Compliance-driven incident response with automated evidence collection",
      "SOC modernisation and alert fatigue reduction for Tier 1-2 analysts",
    ],
    techStack: [
      "Rust",
      "Python",
      "Apache Flink",
      "Redis",
      "PostgreSQL",
      "eBPF",
      "Kubernetes",
      "Terraform",
    ],
    metrics: [
      { value: "2.8 min", label: "Average time to contain" },
      { value: "87%", label: "Alert noise reduction" },
      { value: "99.99%", label: "Platform uptime" },
      { value: "0", label: "Data exfiltrations in client deployments" },
    ],
    pricing: [
      {
        tier: "Starter",
        price: "$5,000/mo",
        features: [
          "Up to 500 endpoints",
          "Single cloud environment",
          "Pre-built playbook library",
          "Email & webhook notifications",
          "Standard incident reports",
          "8x5 support",
        ],
        cta: "Start Free Trial",
      },
      {
        tier: "Pro",
        price: "$15,000/mo",
        features: [
          "Up to 5,000 endpoints",
          "Multi-cloud & hybrid coverage",
          "Adaptive playbook engine",
          "Deception layer integration",
          "SOC analyst copilot",
          "SIEM/SOAR bi-directional sync",
          "Compliance-ready reporting",
          "24x7 support",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Enterprise",
        price: "Custom",
        features: [
          "Everything in Pro",
          "Unlimited endpoints",
          "Custom playbook development",
          "Dedicated incident response retainer",
          "On-premise deployment option",
          "SLA-backed response times",
          "Quarterly threat briefings",
          "Dedicated customer success manager",
        ],
        cta: "Contact Sales",
      },
    ],
  },
  {
    slug: "swarmscope",
    name: "SwarmScope",
    tagline: "See Everything. Miss Nothing.",
    description:
      "SwarmScope is a distributed AI sensor network that delivers full-spectrum visibility across your entire attack surface. Lightweight agents deployed across network, endpoint, cloud and OT environments collaborate as an intelligent swarm — sharing observations, correlating anomalies and detecting threats that no single sensor or tool could catch alone. From shadow IT discovery to zero-trust posture scoring, SwarmScope gives security teams the comprehensive, real-time situational awareness that modern hybrid infrastructures demand.",
    gradient: ["#a855f7", "#00d4ff"],
    features: [
      {
        title: "Swarm-Intelligence Detection",
        description:
          "Distributed agents share local observations in real time, enabling collective anomaly detection that surfaces sophisticated threats — like slow lateral movement and living-off-the-land attacks — invisible to isolated sensors.",
        icon: "Radio",
      },
      {
        title: "Lateral Movement Detection",
        description:
          "Behavioural graph analysis across authentication events, process chains and network flows detects lateral movement in under one second — even when attackers use legitimate credentials and tools.",
        icon: "Activity",
      },
      {
        title: "Zero-Trust Posture Scoring",
        description:
          "Continuous, per-asset trust scoring based on configuration state, vulnerability exposure, access patterns and behavioural baselines — with automated micro-segmentation recommendations.",
        icon: "Lock",
      },
      {
        title: "Shadow IT Discovery",
        description:
          "Automatic identification of unmanaged devices, rogue cloud accounts, unsanctioned SaaS applications and forgotten infrastructure that expand your attack surface without your knowledge.",
        icon: "Search",
      },
      {
        title: "Attack Path Simulation",
        description:
          "Monte Carlo simulations model thousands of potential attack paths through your environment, identifying the most likely and most damaging routes so you can prioritise hardening efforts.",
        icon: "Map",
      },
      {
        title: "Unified Asset Inventory",
        description:
          "A single, continuously updated inventory of every asset across on-premise, cloud, OT and remote environments — with automatic classification, ownership attribution and risk tagging.",
        icon: "Database",
      },
    ],
    useCases: [
      "Hybrid infrastructure visibility across cloud, on-prem and OT environments",
      "Zero-trust architecture validation and continuous compliance monitoring",
      "Shadow IT discovery and unmanaged asset remediation programmes",
      "Attack surface reduction through data-driven micro-segmentation",
    ],
    techStack: [
      "Rust",
      "Go",
      "eBPF",
      "Apache Kafka",
      "ClickHouse",
      "Graph Neural Networks",
      "Kubernetes",
      "WebAssembly",
    ],
    metrics: [
      { value: "< 500ms", label: "Lateral movement detection time" },
      { value: "52%", label: "Average attack surface reduction" },
      { value: "340+", label: "Avg unmanaged assets discovered per deployment" },
      { value: "4.1/5.0", label: "Avg zero-trust maturity score achieved" },
    ],
    pricing: [
      {
        tier: "Starter",
        price: "$3,000/mo",
        features: [
          "Up to 250 monitored assets",
          "Network & endpoint agents",
          "Basic anomaly detection",
          "Asset inventory dashboard",
          "Weekly posture reports",
          "Email support",
        ],
        cta: "Start Free Trial",
      },
      {
        tier: "Pro",
        price: "$10,000/mo",
        features: [
          "Up to 2,500 monitored assets",
          "Network, endpoint, cloud & OT agents",
          "Swarm-intelligence detection engine",
          "Zero-trust posture scoring",
          "Attack path simulation",
          "Shadow IT discovery",
          "API & SIEM integrations",
          "24x7 support",
        ],
        cta: "Start Free Trial",
        highlighted: true,
      },
      {
        tier: "Enterprise",
        price: "Custom",
        features: [
          "Everything in Pro",
          "Unlimited monitored assets",
          "Custom detection models",
          "Dedicated deployment engineering",
          "On-premise controller option",
          "SLA-backed detection guarantees",
          "Quarterly attack surface reviews",
          "Dedicated customer success manager",
        ],
        cta: "Contact Sales",
      },
    ],
  },
];
