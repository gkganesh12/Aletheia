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
    name: "Healthcare",
    icon: "heart",
    description:
      "Protecting patient data and medical systems from sophisticated cyber threats while enabling AI-driven diagnostics and operational efficiency.",
    challenges: [
      "HIPAA compliance across distributed systems",
      "Ransomware targeting critical medical infrastructure",
      "Securing IoMT (Internet of Medical Things) devices",
      "Real-time threat detection without disrupting patient care",
    ],
    solutions: [
      "AI-powered anomaly detection for EHR systems",
      "Zero-trust architecture for hospital networks",
      "Automated compliance monitoring and reporting",
      "Threat intelligence feeds specific to healthcare APTs",
    ],
    stats: [
      { value: "99.99%", label: "EHR Uptime" },
      { value: "< 5min", label: "Incident Response" },
      { value: "100%", label: "HIPAA Compliance" },
    ],
    useCases: [
      "AI-assisted radiology triage",
      "Automated PHI breach detection",
      "Medical device vulnerability scanning",
      "Predictive patient risk scoring",
    ],
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    icon: "building",
    description:
      "Defending financial institutions against fraud, insider threats, and state-sponsored attacks while powering AI-driven trading and risk systems.",
    challenges: [
      "Real-time fraud detection at transaction scale",
      "Regulatory compliance (SOX, PCI-DSS, GDPR)",
      "Insider threat detection across thousands of employees",
      "Securing APIs and third-party integrations",
    ],
    solutions: [
      "Multi-agent AI fraud detection pipeline",
      "Behavioral analytics for insider threat monitoring",
      "Automated regulatory audit trail generation",
      "API gateway security with ML-driven anomaly detection",
    ],
    stats: [
      { value: "$2.1B", label: "Fraud Prevented" },
      { value: "< 100ms", label: "Detection Latency" },
      { value: "99.7%", label: "Accuracy Rate" },
    ],
    useCases: [
      "Real-time transaction fraud scoring",
      "Automated KYC/AML compliance",
      "Algorithmic trading system security",
      "Cross-border payment threat intelligence",
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: "graduation",
    description:
      "Securing academic institutions and EdTech platforms while building AI-powered learning tools that adapt to every student.",
    challenges: [
      "Protecting student data (FERPA compliance)",
      "Securing remote and hybrid learning infrastructure",
      "Preventing credential stuffing and account takeover",
      "Budget constraints limiting security investment",
    ],
    solutions: [
      "Cloud-native security for LMS platforms",
      "AI-driven proctoring and identity verification",
      "Affordable managed detection and response (MDR)",
      "Student data privacy automation tools",
    ],
    stats: [
      { value: "5M+", label: "Students Protected" },
      { value: "Zero", label: "Data Breaches" },
      { value: "60%", label: "Cost Reduction" },
    ],
    useCases: [
      "Adaptive AI tutoring systems",
      "Plagiarism detection with ML",
      "Campus network threat monitoring",
      "Automated accessibility compliance",
    ],
  },
  {
    slug: "insurance",
    name: "Insurance",
    icon: "shield",
    description:
      "Transforming insurance operations with AI-powered claims processing, fraud detection, and risk assessment while securing sensitive policyholder data.",
    challenges: [
      "Claims fraud detection at scale",
      "Legacy system modernization without downtime",
      "Regulatory compliance across jurisdictions",
      "Securing vast repositories of PII data",
    ],
    solutions: [
      "AI claims adjudication and fraud scoring",
      "Document intelligence for policy processing",
      "Automated underwriting risk models",
      "Data encryption and access control frameworks",
    ],
    stats: [
      { value: "40%", label: "Faster Claims" },
      { value: "87%", label: "Fraud Detection" },
      { value: "3x", label: "Processing Speed" },
    ],
    useCases: [
      "Automated claims triage and routing",
      "Computer vision for damage assessment",
      "Predictive risk scoring for underwriting",
      "Policyholder identity verification",
    ],
  },
  {
    slug: "legal",
    name: "Legal",
    icon: "scale",
    description:
      "Empowering law firms and legal departments with AI-driven document analysis, e-discovery, and privileged data protection.",
    challenges: [
      "Attorney-client privilege data protection",
      "Massive document review for e-discovery",
      "Cross-border data sovereignty compliance",
      "Securing sensitive M&A communications",
    ],
    solutions: [
      "AI-powered contract analysis and review",
      "Automated e-discovery with NLP classification",
      "Privileged communication detection and quarantine",
      "Encrypted collaboration platforms for deal rooms",
    ],
    stats: [
      { value: "90%", label: "Review Time Saved" },
      { value: "10M+", label: "Docs Processed" },
      { value: "100%", label: "Privilege Compliance" },
    ],
    useCases: [
      "Contract intelligence and clause extraction",
      "Automated legal research",
      "Regulatory change monitoring",
      "Litigation hold management",
    ],
  },
];
