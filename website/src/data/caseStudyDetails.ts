export interface CaseStudyDetail {
  slug: string;
  title: string;
  client: string;
  industry: string;
  service: string;
  techStack: string[];
  heroImage: string;
  challenge: string;
  approach: { phase: string; description: string }[];
  solution: string;
  results: { value: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
}

export const caseStudyDetails: CaseStudyDetail[] = [
  {
    slug: "novacrest-ransomware",
    title: "Stopping a Nation-State Ransomware Campaign in Real Time",
    client: "NovaCrest Financial",
    industry: "Financial Services",
    service: "Autonomous Incident Response",
    techStack: [
      "Nirvana",
      "SwarmScope",
      "Apache Kafka",
      "eBPF",
      "Kubernetes",
      "Terraform",
    ],
    heroImage: "/images/case-studies/security-dashboard.jpg",
    challenge:
      "NovaCrest Financial, a multinational investment bank with over 12,000 endpoints across 23 offices, faced a sophisticated, multi-stage ransomware attack attributed to a nation-state APT group. The adversary had gained initial access through a compromised vendor VPN appliance and spent 11 days conducting reconnaissance and staging payloads before initiating encryption. Traditional EDR tools flagged the initial payload on the first compromised host but failed to correlate the lateral movement activity spanning multiple network segments. The SOC was overwhelmed with 4,700 fragmented alerts — most of them duplicates or low-confidence signals — and could not assemble a coherent picture of the attack in progress. With encryption beginning to propagate across file servers containing client portfolio data, the stakes were existential: regulatory penalties, client lawsuits and catastrophic reputational damage.",
    approach: [
      {
        phase: "Phase 1: Emergency Deployment",
        description:
          "Within four hours of engagement, we deployed SwarmScope sensor agents across all network segments and Nirvana's autonomous response engine integrated with NovaCrest's existing EDR and SIEM infrastructure. The swarm immediately began building a behavioural baseline while Nirvana ingested the existing alert backlog for correlation.",
      },
      {
        phase: "Phase 2: Threat Mapping & Containment",
        description:
          "SwarmScope's distributed agents detected lateral movement patterns across three previously unlinked network segments within 400 milliseconds of activation. Nirvana correlated these signals with the EDR alerts to reconstruct the full attack chain — from initial access through privilege escalation to ransomware staging. Automated containment isolated the 47 compromised hosts while preserving forensic evidence on each.",
      },
      {
        phase: "Phase 3: Remediation & Hardening",
        description:
          "Nirvana's rollback engine restored encrypted files from immutable snapshots with zero data loss. Our team then conducted a comprehensive post-incident hardening exercise: patching the vendor VPN vulnerability, implementing micro-segmentation to limit blast radius, deploying deception assets and establishing continuous monitoring through SwarmScope's zero-trust posture scoring.",
      },
    ],
    solution:
      "The combination of SwarmScope's distributed detection and Nirvana's autonomous response delivered what a 40-person SOC could not: real-time, environment-wide threat correlation and sub-three-minute containment. The swarm-intelligence approach eliminated the blind spots between network segments that the attacker had exploited, while Nirvana's adaptive playbooks adjusted containment strategies as new indicators were discovered — all without human intervention during the critical containment window.",
    results: [
      { value: "2.8 min", label: "Mean time to contain (down from 4.2 hours)" },
      { value: "$0", label: "Data exfiltrated (confirmed via forensics)" },
      { value: "$14M", label: "Estimated loss averted" },
      { value: "87%", label: "SOC alert volume reduction" },
    ],
    testimonial: {
      quote:
        "Aletheia AI cut our mean-time-to-detect by 94%. Their autonomous response platform stopped a ransomware attack in under three minutes — something our previous SOC would have taken hours to even identify.",
      author: "Priya Mehta",
      role: "Chief Information Security Officer, NovaCrest Financial",
    },
  },
  {
    slug: "helios-credential-leak",
    title: "Uncovering a Massive Credential Leak Before Exploitation",
    client: "Helios Health Systems",
    industry: "Healthcare",
    service: "Threat Intelligence & Dark Web Monitoring",
    techStack: [
      "Inscrape",
      "Neo4j",
      "Elasticsearch",
      "Python",
      "Kafka",
      "React",
    ],
    heroImage: "/images/products/tech-setup.jpg",
    challenge:
      "Helios Health Systems operates one of the largest private hospital networks in the United States, managing sensitive health records for over 6 million patients across 140 facilities. Following a breach nine months earlier that went undetected until a journalist inquiry, Helios was hit with $4.8M in HIPAA penalties and suffered severe reputational damage. The security team suspected that stolen data was still circulating on underground marketplaces but lacked any visibility into dark web activity. They had no way to know how many credentials were compromised, which systems were exposed or whether active exploitation was already underway. The clock was ticking: Helios was facing an upcoming OCR audit and needed to demonstrate proactive threat management capability.",
    approach: [
      {
        phase: "Phase 1: Rapid Intelligence Deployment",
        description:
          "We configured Inscrape to monitor over 200 dark web forums, marketplaces, paste sites and encrypted Telegram channels for any mention of Helios assets — including domain names, email patterns, employee names, facility addresses and patient data markers. Entity resolution algorithms were tuned to Helios-specific nomenclature to maximise recall while minimising false positives.",
      },
      {
        phase: "Phase 2: Exposure Mapping & Triage",
        description:
          "Within 72 hours, Inscrape surfaced 34,000 compromised credentials linked to Helios employee accounts — many bundled with VPN and remote desktop credentials. Our analysts correlated these with Helios's Active Directory to identify 2,800 accounts that were still active and had not been reset since the original breach. A threat graph revealed that three separate dark web vendors were actively selling Helios access credentials with prices indicating perceived high value.",
      },
      {
        phase: "Phase 3: Remediation & Continuous Monitoring",
        description:
          "We coordinated with Helios IT to execute a prioritised credential reset campaign, starting with the 340 accounts that had privileged access. Simultaneously, we deployed continuous monitoring rules to alert on any new Helios data appearing across the monitored landscape. Inscrape's automated reporting generated the compliance evidence documentation required for the upcoming OCR audit.",
      },
    ],
    solution:
      "Inscrape transformed Helios from a state of complete dark web blindness to proactive threat awareness in under a week. The platform's entity resolution capabilities were critical — linking fragments of data scattered across dozens of sources into a unified exposure picture that the security team could act on immediately. The ongoing monitoring capability reduced the exposure window from the nine months of the original breach to under 48 hours for any new leak.",
    results: [
      {
        value: "34,000",
        label: "Compromised credentials discovered in 72 hours",
      },
      { value: "0", label: "Confirmed account takeovers (all credentials reset in time)" },
      { value: "< 48 hrs", label: "New exposure detection window (down from 9 months)" },
      { value: "100%", label: "HIPAA compliance achieved ahead of audit" },
    ],
    testimonial: {
      quote:
        "We deployed Inscrape to monitor our brand exposure on the dark web. Within the first week it surfaced a credential dump we had no idea existed. The ROI was immediate and undeniable.",
      author: "James Whitfield",
      role: "VP of Security Operations, Helios Health Systems",
    },
  },
  {
    slug: "meridian-adversarial-ml",
    title: "Hardening Fraud Detection Models Against Adversarial Attack",
    client: "Meridian Commerce",
    industry: "E-Commerce & Fintech",
    service: "Adversarial ML Defence & Model Hardening",
    techStack: [
      "PyTorch",
      "CleverHans",
      "ART (Adversarial Robustness Toolbox)",
      "MLflow",
      "Kubernetes",
      "Python",
    ],
    heroImage: "/images/products/llm-glass.jpg",
    challenge:
      "Meridian Commerce, a high-growth e-commerce platform processing $2.1B in annual transactions, relied on an ensemble of ML models for real-time fraud detection. Over the preceding two quarters, organised fraud rings had learned to systematically evade the models using adversarial perturbation techniques — subtly modifying transaction features to stay just below detection thresholds. Chargebacks had increased 40% quarter-over-quarter despite multiple rounds of model retraining. The data science team suspected adversarial manipulation but lacked the offensive ML expertise to diagnose the attack vectors or build robust defences. Each month of delay was costing Meridian an estimated $2.3M in fraudulent chargebacks.",
    approach: [
      {
        phase: "Phase 1: Red Team Assessment",
        description:
          "Our adversarial ML team conducted a comprehensive red-team assessment of all five production fraud models. We applied gradient-based attacks (FGSM, PGD, C&W), black-box attacks (boundary attacks, HopSkipJump) and query-efficient transfer attacks to identify evasion vectors. The assessment revealed that four of five models were vulnerable to perturbations of less than 3% on key numerical features — confirming that the fraud rings were exploiting a narrow but highly effective attack surface.",
      },
      {
        phase: "Phase 2: Model Hardening",
        description:
          "We applied a multi-layered defence strategy: adversarial training using the attack vectors discovered in Phase 1, input feature sanitisation to detect and reject anomalous perturbation patterns, certified robustness bounds for critical decision boundaries and an ensemble diversification strategy that made coordinated evasion across all models computationally infeasible for attackers.",
      },
      {
        phase: "Phase 3: Validation & Continuous Defence",
        description:
          "The hardened models were validated against the MITRE ATLAS adversarial ML framework and subjected to a second round of red-team testing by a separate team to confirm robustness. We established an ongoing red-team retainer with quarterly adversarial assessments and implemented automated adversarial testing in the CI/CD pipeline to catch regressions before they reach production.",
      },
    ],
    solution:
      "The engagement transformed Meridian's fraud detection pipeline from a vulnerable, reactive system into an adversarially robust defence layer validated against industry-standard attack frameworks. The combination of adversarial training, input sanitisation and ensemble hardening created defence-in-depth that made the models resilient against both known attack classes and novel evasion techniques. The ongoing red-team retainer ensures the models evolve alongside the adversary.",
    results: [
      { value: "< 2%", label: "Fraud evasion rate (down from 23%)" },
      { value: "61%", label: "Chargeback reduction in first quarter" },
      {
        value: "ATLAS",
        label: "Robustness validated against MITRE ATLAS framework",
      },
      { value: "$8.2M", label: "Annualised fraud loss reduction" },
    ],
    testimonial: {
      quote:
        "Their team doesn't just ship software — they embed with your security org and make it stronger. The adversarial ML defence work they did on our fraud models was genuinely world-class.",
      author: "Sofia Reyes",
      role: "Head of AI Engineering, Meridian Commerce",
    },
  },
  {
    slug: "atlas-zero-trust",
    title: "Achieving Full-Spectrum Visibility Across a Hybrid Infrastructure",
    client: "Atlas Logistics Group",
    industry: "Supply Chain & Logistics",
    service: "Attack Surface Management & Zero Trust",
    techStack: [
      "SwarmScope",
      "ClickHouse",
      "Graph Neural Networks",
      "eBPF",
      "Terraform",
      "Go",
    ],
    heroImage: "/images/services/building.jpg",
    challenge:
      "Atlas Logistics Group operates across 14 countries with a sprawling hybrid infrastructure comprising legacy on-premise data centres, multi-cloud deployments across AWS and Azure, operational technology (OT) networks in warehouses and distribution centres, and a remote workforce of 8,000 employees. The security team of 12 had no unified asset inventory and relied on spreadsheets and tribal knowledge to track their environment. Shadow IT was rampant: business units regularly spun up cloud resources without security review. Most critically, the OT networks controlling conveyor systems, robotic pickers and environmental controls were completely invisible to the security team — yet several were internet-accessible. A board-level directive to achieve zero-trust architecture maturity within 12 months created urgent pressure to gain visibility fast.",
    approach: [
      {
        phase: "Phase 1: Swarm Deployment & Discovery",
        description:
          "SwarmScope agents were deployed across all network segments, cloud accounts and OT environments in a phased rollout over three weeks. The lightweight agents — averaging 12MB memory footprint — were compatible with everything from modern Kubernetes clusters to legacy Windows Server 2012 hosts and Siemens PLC controllers. Within 48 hours of full deployment, the swarm had built a complete real-time asset graph of the entire environment.",
      },
      {
        phase: "Phase 2: Risk Assessment & Prioritisation",
        description:
          "The asset graph revealed 340 previously unknown devices — including 28 internet-exposed OT controllers, 94 unmanaged cloud instances and 218 employee BYOD devices connecting to production networks. SwarmScope's attack path simulation modelled 50,000 potential attack paths and identified the 12 critical paths most likely to lead to a material breach. Zero-trust posture scores were calculated for every asset, creating a prioritised remediation backlog.",
      },
      {
        phase: "Phase 3: Hardening & Continuous Monitoring",
        description:
          "We worked with Atlas's infrastructure team to implement micro-segmentation based on SwarmScope's recommendations — isolating OT networks, enforcing least-privilege access policies and closing the 28 internet-exposed OT controllers. Continuous zero-trust posture scoring was established with automated alerts for any asset falling below threshold, ensuring the security gains were maintained as the environment evolved.",
      },
    ],
    solution:
      "SwarmScope's swarm-intelligence approach solved the fundamental visibility challenge that had paralysed Atlas's security programme. By deploying collaborative agents that share observations across environment boundaries, we eliminated the blind spots between on-prem, cloud and OT that traditional tools treat as separate domains. The continuous posture scoring mechanism transformed zero trust from a one-time project into a living, measurable programme with clear metrics for board reporting.",
    results: [
      {
        value: "340",
        label: "Unmanaged devices discovered (incl. 28 internet-exposed OT controllers)",
      },
      { value: "52%", label: "Attack surface reduction via micro-segmentation" },
      {
        value: "4.1/5.0",
        label: "Zero-trust maturity score achieved within 6 months",
      },
      {
        value: "1",
        label: "Unified dashboard across AWS, Azure, on-prem and OT",
      },
    ],
    testimonial: {
      quote:
        "SwarmScope gave us visibility we didn't know was possible. Shadow IT, misconfigured cloud buckets, lateral movement attempts — it catches everything. Our board finally sleeps at night.",
      author: "Daniel Okonkwo",
      role: "Director of Infrastructure, Atlas Logistics Group",
    },
  },
];
