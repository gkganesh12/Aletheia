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
    slug: "ai-strategy-consulting",
    name: "AI Strategy & Consulting",
    overline: "Strategic Advisory",
    headline: "Turn AI Ambition into Operational Advantage",
    description:
      "Most organisations know they need AI — few know where to start or how to avoid the pitfalls. Our strategy consultants combine deep technical expertise with business acumen to build AI roadmaps that deliver measurable ROI. From executive workshops to full transformation programmes, we help you identify high-impact use cases, assess readiness, navigate regulatory complexity and build the organisational muscle to execute at scale.",
    features: [
      {
        title: "AI Readiness Assessment",
        description:
          "A comprehensive audit of your data infrastructure, talent, governance and culture to establish a clear baseline and identify the gaps standing between you and production-grade AI.",
      },
      {
        title: "Use Case Prioritisation",
        description:
          "We score and rank dozens of potential AI applications against feasibility, impact and strategic alignment — so you invest in the initiatives that move the needle fastest.",
      },
      {
        title: "Responsible AI Governance",
        description:
          "Frameworks for bias detection, explainability, privacy compliance and ethical oversight that keep your AI initiatives trustworthy, auditable and regulation-ready.",
      },
      {
        title: "Transformation Roadmapping",
        description:
          "A phased, milestone-driven plan that connects your AI strategy to concrete engineering workstreams, org design changes and KPIs — turning vision into velocity.",
      },
      {
        title: "Executive Education & Enablement",
        description:
          "Tailored workshops for C-suite and senior leadership that demystify AI, build internal champions and ensure strategic decisions are grounded in technical reality.",
      },
    ],
    technologies: [
      "Wardley Mapping",
      "TOGAF",
      "NIST AI RMF",
      "EU AI Act Compliance",
      "MLOps Maturity Models",
      "Responsible AI Toolkits",
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Landscape Analysis",
        description:
          "We conduct stakeholder interviews, audit your existing data and technology stack, map competitive dynamics and benchmark your AI maturity against industry peers.",
      },
      {
        step: 2,
        title: "Opportunity Identification",
        description:
          "Our team identifies and scores AI use cases across every business unit, evaluating each against data availability, technical feasibility, regulatory risk and projected ROI.",
      },
      {
        step: 3,
        title: "Strategy Design & Validation",
        description:
          "We synthesise findings into a multi-horizon roadmap with clear milestones, resource plans, governance structures and quick-win pilots to build early momentum.",
      },
      {
        step: 4,
        title: "Execution Support & Iteration",
        description:
          "Our consultants remain embedded through initial pilot delivery, measuring outcomes against KPIs and iterating the strategy based on real-world learnings.",
      },
    ],
    stats: [
      { value: "120+", label: "Strategy engagements delivered" },
      { value: "3.2x", label: "Average ROI on AI initiatives we advise" },
      { value: "89%", label: "Pilot-to-production conversion rate" },
      { value: "< 90 days", label: "Average time to first pilot deployment" },
    ],
  },
  {
    slug: "custom-ai-ml",
    name: "Custom AI/ML Development",
    overline: "Bespoke Intelligence",
    headline: "Models Built for Your Problem — Not Someone Else's",
    description:
      "Off-the-shelf models get you 80% of the way. The last 20% — where competitive advantage lives — demands custom work. Our ML engineering team designs, trains, validates and deploys bespoke models tailored to your domain, your data and your constraints. Whether you need a computer vision pipeline for manufacturing QA, an NLP system for contract analysis or a reinforcement learning agent for dynamic pricing, we build it to production spec from day one.",
    features: [
      {
        title: "Custom Model Architecture",
        description:
          "Purpose-built neural architectures and training pipelines designed around your specific data characteristics, latency requirements and accuracy thresholds — not generic templates.",
      },
      {
        title: "Data Strategy & Feature Engineering",
        description:
          "We help you unlock the value hidden in raw data through expert feature engineering, synthetic data generation and data augmentation strategies that maximise model performance.",
      },
      {
        title: "Model Hardening & Robustness",
        description:
          "Adversarial testing, distribution shift detection and ensemble techniques that ensure your models perform reliably in production — not just on held-out test sets.",
      },
      {
        title: "MLOps & Continuous Training",
        description:
          "Automated retraining pipelines, model versioning, A/B testing infrastructure and drift monitoring that keep your models sharp as the world changes around them.",
      },
    ],
    technologies: [
      "PyTorch",
      "TensorFlow",
      "JAX",
      "Hugging Face Transformers",
      "Ray",
      "MLflow",
      "Weights & Biases",
      "ONNX Runtime",
    ],
    process: [
      {
        step: 1,
        title: "Problem Framing & Data Audit",
        description:
          "We rigorously define the ML problem, success metrics and deployment constraints, then audit your available data for quality, volume, bias and labelling completeness.",
      },
      {
        step: 2,
        title: "Rapid Prototyping",
        description:
          "Our team builds and benchmarks multiple model architectures in a time-boxed sprint, using your real data to validate feasibility and establish performance baselines.",
      },
      {
        step: 3,
        title: "Production Engineering",
        description:
          "The winning architecture is hardened, optimised for inference speed and memory footprint, wrapped in production APIs and integrated with your existing systems.",
      },
      {
        step: 4,
        title: "Deployment & Monitoring",
        description:
          "We deploy with full observability — latency tracking, accuracy monitoring, data drift alerts and automated rollback — ensuring the model delivers value from day one.",
      },
    ],
    stats: [
      { value: "200+", label: "Custom models shipped to production" },
      { value: "97.4%", label: "Average model accuracy across projects" },
      { value: "40%", label: "Average inference cost reduction post-optimisation" },
      { value: "< 8 weeks", label: "Typical prototype-to-production timeline" },
    ],
  },
  {
    slug: "cybersecurity-auditing",
    name: "Cybersecurity Auditing",
    overline: "Defence Validation",
    headline: "Know Exactly Where You Stand — Before Attackers Do",
    description:
      "Assumptions are the enemy of security. Our auditing practice delivers unflinching, evidence-based assessments of your security posture across infrastructure, applications, cloud environments and human processes. We combine automated scanning with expert manual testing, threat modelling and compliance gap analysis to give you a prioritised, actionable roadmap for hardening your defences. Whether you need a point-in-time penetration test or a continuous assurance programme, we expose what others miss.",
    features: [
      {
        title: "Penetration Testing",
        description:
          "Black-box, grey-box and white-box assessments across network, web application, mobile and API attack surfaces — conducted by certified offensive security professionals.",
      },
      {
        title: "Cloud Security Assessment",
        description:
          "Deep-dive audits of AWS, Azure and GCP environments covering IAM misconfigurations, network exposure, storage permissions, secrets management and compliance posture.",
      },
      {
        title: "Compliance Gap Analysis",
        description:
          "Detailed mapping of your current controls against SOC 2, ISO 27001, NIST CSF, HIPAA, PCI DSS and other frameworks — with prioritised remediation recommendations.",
      },
      {
        title: "Red Team Exercises",
        description:
          "Full-scope adversary simulations that test your people, processes and technology against realistic, multi-stage attack scenarios modelled on real-world threat actors.",
      },
      {
        title: "Source Code Review",
        description:
          "Manual and automated analysis of application source code to identify vulnerabilities, insecure design patterns and cryptographic weaknesses before they reach production.",
      },
    ],
    technologies: [
      "Burp Suite Pro",
      "Cobalt Strike",
      "Nessus",
      "Semgrep",
      "ScoutSuite",
      "Prowler",
      "BloodHound",
    ],
    process: [
      {
        step: 1,
        title: "Scoping & Threat Modelling",
        description:
          "We define the engagement scope, identify critical assets, model likely threat actors and agree on rules of engagement and success criteria with your security leadership.",
      },
      {
        step: 2,
        title: "Assessment Execution",
        description:
          "Our team conducts the audit using a blend of automated tooling and hands-on manual testing, documenting every finding with full evidence chains and reproduction steps.",
      },
      {
        step: 3,
        title: "Analysis & Prioritisation",
        description:
          "Findings are risk-scored using CVSS and contextual business impact, then mapped to a prioritised remediation roadmap with clear ownership and timelines.",
      },
      {
        step: 4,
        title: "Remediation Support & Retest",
        description:
          "We work alongside your engineering teams to validate fixes, conduct retesting of critical findings and deliver a final assurance report confirming closure.",
      },
    ],
    stats: [
      { value: "500+", label: "Security audits completed" },
      { value: "12,000+", label: "Vulnerabilities identified and remediated" },
      { value: "100%", label: "Client audit pass rate post-remediation" },
      { value: "48 hrs", label: "Average time to deliver critical findings" },
    ],
  },
  {
    slug: "threat-intelligence",
    name: "Threat Intelligence",
    overline: "Proactive Defence",
    headline: "See Threats Forming — Before They Reach Your Perimeter",
    description:
      "Reactive security is a losing game. Our threat intelligence practice gives you forward-looking visibility into the adversaries, campaigns and vulnerabilities most likely to target your organisation. Powered by Inscrape and enriched by our analyst team, we deliver contextualised, actionable intelligence that integrates directly into your security operations — enabling faster decisions, smarter prioritisation and pre-emptive defensive action across every layer of your infrastructure.",
    features: [
      {
        title: "Dark Web Monitoring",
        description:
          "Continuous surveillance of dark web marketplaces, forums, paste sites and encrypted channels for leaked credentials, stolen data and chatter about your organisation or industry.",
      },
      {
        title: "Threat Actor Profiling",
        description:
          "Detailed dossiers on APT groups, ransomware operators and cybercrime syndicates relevant to your sector — including TTPs, infrastructure indicators and targeting patterns.",
      },
      {
        title: "Vulnerability Intelligence",
        description:
          "Curated feeds of emerging CVEs and zero-days prioritised by exploitability, relevance to your tech stack and active exploitation in the wild — not just CVSS scores.",
      },
      {
        title: "Brand & Executive Protection",
        description:
          "Monitoring for domain spoofing, executive impersonation, phishing kit deployments and fraudulent social media accounts that exploit your brand identity.",
      },
    ],
    technologies: [
      "Inscrape Platform",
      "MITRE ATT&CK",
      "STIX/TAXII",
      "OpenCTI",
      "VirusTotal",
      "Shodan",
      "Censys",
      "Maltego",
    ],
    process: [
      {
        step: 1,
        title: "Intelligence Requirements",
        description:
          "We work with your team to define priority intelligence requirements — the specific questions your security operations need answered to make better decisions faster.",
      },
      {
        step: 2,
        title: "Collection & Enrichment",
        description:
          "Inscrape continuously collects data across hundreds of sources while our analysts enrich, correlate and validate findings to eliminate noise and false positives.",
      },
      {
        step: 3,
        title: "Analysis & Dissemination",
        description:
          "Intelligence is packaged into strategic briefings for leadership, tactical reports for SOC analysts and machine-readable IOCs for automated ingestion into your security tools.",
      },
      {
        step: 4,
        title: "Feedback & Tuning",
        description:
          "We continuously refine collection priorities, alerting thresholds and reporting formats based on feedback loops with your analysts — ensuring intelligence stays operationally relevant.",
      },
    ],
    stats: [
      { value: "2B+", label: "Signals processed daily" },
      { value: "< 15 min", label: "Average time from detection to alert" },
      { value: "94%", label: "Actionable intelligence rate" },
      { value: "200+", label: "Dark web sources under continuous watch" },
    ],
  },
  {
    slug: "data-engineering",
    name: "Data Engineering & Pipelines",
    overline: "Data Infrastructure",
    headline: "Clean Data In. Intelligent Decisions Out.",
    description:
      "AI is only as good as the data that feeds it. Our data engineering practice designs and builds the high-performance pipelines, lakehouses and real-time streaming architectures that transform raw, messy data into ML-ready fuel. We handle everything from ingestion and transformation to quality assurance and governance — giving your data science teams a reliable foundation to build on, and your business leaders the confidence that decisions are grounded in trustworthy data.",
    features: [
      {
        title: "Real-Time Streaming Pipelines",
        description:
          "Event-driven architectures built on Kafka, Flink and Spark Streaming that process millions of events per second with exactly-once semantics and sub-second latency.",
      },
      {
        title: "Modern Data Lakehouse",
        description:
          "Unified storage layers using Delta Lake, Iceberg or Hudi that combine the flexibility of data lakes with the performance and ACID guarantees of data warehouses.",
      },
      {
        title: "Data Quality & Observability",
        description:
          "Automated data validation, anomaly detection and lineage tracking that catch issues at ingestion — not after they have corrupted your models and dashboards.",
      },
      {
        title: "Feature Store Engineering",
        description:
          "Centralised, versioned feature stores that serve consistent features to both training and inference pipelines — eliminating training-serving skew and accelerating model iteration.",
      },
      {
        title: "Data Governance & Cataloguing",
        description:
          "Metadata management, access controls, PII detection and automated classification that keep your data estate compliant, discoverable and trustworthy at scale.",
      },
    ],
    technologies: [
      "Apache Kafka",
      "Apache Spark",
      "Apache Flink",
      "dbt",
      "Airflow",
      "Snowflake",
      "Databricks",
      "Great Expectations",
    ],
    process: [
      {
        step: 1,
        title: "Data Landscape Assessment",
        description:
          "We map your existing data sources, pipelines and consumption patterns to identify bottlenecks, quality gaps and architectural debt that limit your AI ambitions.",
      },
      {
        step: 2,
        title: "Architecture Design",
        description:
          "Our engineers design a target-state architecture tailored to your scale, latency and compliance requirements — balancing best-of-breed tooling with operational simplicity.",
      },
      {
        step: 3,
        title: "Pipeline Development & Migration",
        description:
          "We build, test and deploy pipelines incrementally, migrating workloads from legacy systems with zero downtime and full data validation at every stage.",
      },
      {
        step: 4,
        title: "Operationalisation & Handover",
        description:
          "Comprehensive monitoring, alerting and runbooks are put in place alongside hands-on training for your team — ensuring long-term self-sufficiency and operational excellence.",
      },
    ],
    stats: [
      { value: "50+ PB", label: "Data processed for clients annually" },
      { value: "99.97%", label: "Pipeline uptime SLA consistently met" },
      { value: "60%", label: "Average reduction in data processing costs" },
      { value: "10x", label: "Faster time-to-insight for analytics teams" },
    ],
  },
  {
    slug: "ai-agent-development",
    name: "AI Agent Development",
    overline: "Autonomous Intelligence",
    headline: "Agents That Think, Act and Learn — On Your Behalf",
    description:
      "The next wave of AI is not models you prompt — it is agents that execute. Our agent development practice designs and builds autonomous AI systems that perceive their environment, reason about complex goals, take multi-step actions and learn from outcomes. From security operations copilots to fully autonomous workflow engines, we build agents that handle the cognitive heavy lifting so your teams can focus on judgement, creativity and strategy.",
    features: [
      {
        title: "Multi-Agent Orchestration",
        description:
          "Architectures where specialised agents collaborate, delegate and negotiate — enabling complex workflows that no single agent could handle alone, with graceful failure handling.",
      },
      {
        title: "Tool-Use & API Integration",
        description:
          "Agents equipped with the ability to call external APIs, query databases, execute code and interact with third-party platforms — extending their capabilities beyond language generation.",
      },
      {
        title: "Memory & Knowledge Management",
        description:
          "Long-term memory systems using vector databases and retrieval-augmented generation that give agents persistent context, institutional knowledge and the ability to learn from past interactions.",
      },
      {
        title: "Safety & Guardrails",
        description:
          "Configurable constraints, human-in-the-loop checkpoints, output validation and action sandboxing that ensure agents operate within safe boundaries — even in high-stakes environments.",
      },
      {
        title: "Evaluation & Observability",
        description:
          "End-to-end tracing of agent reasoning chains, action sequences and tool calls — with automated evaluation harnesses that measure task completion, cost and safety metrics.",
      },
    ],
    technologies: [
      "LangChain",
      "LangGraph",
      "CrewAI",
      "AutoGen",
      "OpenAI API",
      "Anthropic Claude API",
      "Pinecone",
      "Weaviate",
    ],
    process: [
      {
        step: 1,
        title: "Workflow Analysis & Agent Design",
        description:
          "We map the target workflow end-to-end, identify where autonomous action adds value, define agent personas and design the orchestration topology — single agent, pipeline or swarm.",
      },
      {
        step: 2,
        title: "Prototype & Capability Building",
        description:
          "We build a functional agent prototype, equip it with the necessary tools and knowledge, and test it against representative scenarios to validate the architecture.",
      },
      {
        step: 3,
        title: "Hardening & Safety Testing",
        description:
          "Red-team exercises stress-test the agent for hallucination, tool misuse, infinite loops and adversarial manipulation — with guardrails tuned until safety thresholds are met.",
      },
      {
        step: 4,
        title: "Production Deployment & Monitoring",
        description:
          "The agent is deployed with full observability, cost controls and human escalation paths — with ongoing monitoring and fine-tuning to improve task success rates over time.",
      },
    ],
    stats: [
      { value: "85%", label: "Average task automation rate" },
      { value: "35+", label: "Production agent systems deployed" },
      { value: "4.2x", label: "Productivity gain for augmented teams" },
      { value: "< 0.1%", label: "Critical safety incident rate" },
    ],
  },
];
