export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export const careers: JobListing[] = [
  {
    id: "senior-ml-engineer",
    title: "Senior ML Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Design, train and deploy production ML models that power our core products. You will work across the full model lifecycle — from data exploration and architecture design through training, optimisation and deployment — building the intelligence layer behind Inscrape, Nirvana and SwarmScope. This role demands deep hands-on experience with PyTorch or JAX, a strong understanding of MLOps best practices and the ability to translate research breakthroughs into production-grade systems.",
    requirements: [
      "5+ years of experience building and deploying ML models in production environments",
      "Deep proficiency in PyTorch, TensorFlow or JAX with experience training models at scale",
      "Strong understanding of MLOps tooling: experiment tracking, model versioning, feature stores and CI/CD for ML",
      "Experience with transformer architectures, graph neural networks or reinforcement learning",
      "Familiarity with distributed training frameworks (DeepSpeed, FSDP, Ray Train)",
      "Strong software engineering skills in Python; experience with Rust or Go is a plus",
      "Published research or demonstrated contributions to open-source ML projects preferred",
    ],
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer — Distributed Systems",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Build the high-throughput, low-latency distributed systems that form the backbone of our platform. You will design and implement event-driven architectures, real-time stream processing pipelines and fault-tolerant microservices that process billions of security signals daily. This role is ideal for engineers who love building systems that must be both blazingly fast and uncompromisingly reliable.",
    requirements: [
      "4+ years of experience building production distributed systems",
      "Strong proficiency in Go, Rust or Java with a focus on concurrent and networked programming",
      "Experience with stream processing frameworks: Apache Kafka, Flink or Kafka Streams",
      "Deep understanding of distributed systems concepts: consensus, replication, partitioning, consistency models",
      "Experience with Kubernetes, container orchestration and infrastructure-as-code (Terraform)",
      "Familiarity with observability tooling: Prometheus, Grafana, OpenTelemetry, distributed tracing",
    ],
  },
  {
    id: "senior-security-researcher",
    title: "Senior Security Researcher",
    department: "Security",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Conduct original research into emerging cyber threats, develop novel detection methodologies and contribute to the intelligence capabilities that differentiate our products. You will analyse malware, reverse-engineer adversary tooling, study threat actor TTPs and publish findings that advance both our products and the broader security community. This role bridges the gap between cutting-edge research and operational security impact.",
    requirements: [
      "5+ years of experience in security research, threat intelligence or malware analysis",
      "Strong reverse engineering skills with experience using IDA Pro, Ghidra or Binary Ninja",
      "Deep knowledge of the MITRE ATT&CK framework and adversary emulation methodologies",
      "Experience with programming and scripting in Python, C/C++ or assembly",
      "Track record of published research: conference talks (Black Hat, DEF CON, RSA), blog posts or CVE discoveries",
      "Familiarity with ML/AI concepts as applied to detection and threat analysis",
      "Active participation in the security community (CTFs, open-source tools, responsible disclosure)",
    ],
  },
  {
    id: "penetration-tester",
    title: "Senior Penetration Tester",
    department: "Security",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Lead offensive security engagements across network, web application, cloud and mobile attack surfaces. You will conduct penetration tests, red team exercises and adversary simulations for our clients — identifying vulnerabilities, demonstrating impact and providing actionable remediation guidance. You will also contribute to our internal tooling and help train junior team members in offensive techniques.",
    requirements: [
      "4+ years of professional penetration testing or red team experience",
      "OSCP, OSCE, OSEP, GPEN or equivalent offensive security certifications",
      "Expertise in web application security: OWASP Top 10, API security, authentication bypasses",
      "Experience with cloud penetration testing across AWS, Azure or GCP",
      "Proficiency with offensive tooling: Burp Suite, Cobalt Strike, Impacket, BloodHound",
      "Strong report-writing skills with the ability to communicate findings to technical and executive audiences",
      "Experience developing custom tools, exploits or automation for offensive engagements",
    ],
  },
  {
    id: "ai-research-scientist",
    title: "AI Research Scientist — Adversarial ML",
    department: "Research",
    location: "Remote (Global)",
    type: "Full-time",
    description:
      "Push the boundaries of adversarial machine learning research and translate findings into practical defences for our products and clients. You will design novel attack and defence techniques, conduct red-team assessments of ML systems, develop robustness evaluation frameworks and publish research that shapes the field. This role offers the rare opportunity to do world-class research with direct, immediate production impact.",
    requirements: [
      "PhD in machine learning, computer science or a related field with a focus on adversarial robustness, AI safety or security",
      "Published papers at top-tier venues: NeurIPS, ICML, ICLR, CCS, USENIX Security or IEEE S&P",
      "Deep expertise in adversarial attacks and defences: evasion, poisoning, backdoor and model extraction attacks",
      "Strong implementation skills in PyTorch or JAX with experience running large-scale experiments",
      "Familiarity with the MITRE ATLAS framework and practical ML security assessment methodologies",
      "Ability to communicate complex technical concepts to both research and engineering audiences",
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Design, build and operate the data infrastructure that powers our AI products and client engagements. You will architect real-time and batch data pipelines, build feature stores, implement data quality frameworks and ensure our data platform scales reliably as our product usage grows. This role is central to every product and service we deliver — because our AI is only as good as the data that feeds it.",
    requirements: [
      "4+ years of experience in data engineering with a focus on large-scale data pipelines",
      "Strong proficiency in Python and SQL with experience in Spark, Flink or similar processing frameworks",
      "Experience with modern data stack: dbt, Airflow, Snowflake, Databricks or equivalent tools",
      "Familiarity with streaming architectures: Kafka, Kinesis, Pub/Sub",
      "Experience with data quality frameworks: Great Expectations, Soda or custom validation pipelines",
      "Understanding of data modelling patterns, slowly changing dimensions and event sourcing",
      "Experience with cloud data services on AWS, GCP or Azure",
    ],
  },
  {
    id: "product-designer",
    title: "Senior Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Shape the user experience of security and intelligence products used by analysts, engineers and executives at the world's most security-conscious organisations. You will own end-to-end design for features across Inscrape, Nirvana and SwarmScope — from user research and information architecture through interaction design, prototyping and visual polish. This role demands the ability to make complex data intuitive without dumbing it down.",
    requirements: [
      "6+ years of product design experience, ideally in B2B SaaS, security tooling or data-intensive applications",
      "Strong portfolio demonstrating expertise in complex information design, data visualisation and dashboard UX",
      "Proficiency in Figma with experience building and maintaining design systems",
      "Experience conducting user research: interviews, usability testing, contextual inquiry",
      "Understanding of front-end implementation constraints and ability to collaborate closely with engineers",
      "Familiarity with cybersecurity concepts and workflows is a strong plus",
      "Excellent communication skills and ability to articulate design rationale to stakeholders",
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps / Site Reliability Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description:
      "Build and maintain the infrastructure platform that runs our products across multi-cloud and on-premise customer environments. You will own CI/CD pipelines, Kubernetes cluster management, observability infrastructure, incident response automation and infrastructure-as-code for both our SaaS platform and customer-deployed instances. Reliability, security and developer experience are your core metrics.",
    requirements: [
      "4+ years of experience in DevOps, SRE or platform engineering roles",
      "Deep expertise with Kubernetes: cluster lifecycle management, networking, security policies and autoscaling",
      "Strong infrastructure-as-code skills with Terraform, Pulumi or Crossplane",
      "Experience with CI/CD platforms: GitHub Actions, GitLab CI, ArgoCD or Flux",
      "Proficiency with observability stack: Prometheus, Grafana, Loki, OpenTelemetry, PagerDuty",
      "Experience operating in multi-cloud environments (AWS, Azure, GCP)",
      "Strong scripting skills in Bash, Python or Go",
      "Security-conscious mindset: experience with image scanning, RBAC hardening and secrets management",
    ],
  },
];
