export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: "ai-products",
    name: "AI Product Engineering",
    description:
      "End-to-end design, development and deployment of AI-powered products. From LLM-based applications and multi-agent systems to computer vision and NLP pipelines — built for production from day one.",
    icon: "Brain",
  },
  {
    id: "mvp-development",
    name: "MVP & Rapid Prototyping",
    description:
      "Turn ideas into working products fast. We scope, design, build and ship MVPs with clean architecture that scales — so you validate with real users, not slide decks.",
    icon: "Zap",
  },
  {
    id: "full-stack",
    name: "Full-Stack Development",
    description:
      "React, Next.js, Node, Python, Go, Rust — whatever the stack demands. Responsive frontends, robust APIs, real-time systems and everything in between.",
    icon: "Layers",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    description:
      "AWS, GCP, Azure — Kubernetes, Terraform, CI/CD pipelines. We architect, deploy and manage cloud infrastructure built for reliability, security and scale.",
    icon: "Radio",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & Threat Intelligence",
    description:
      "AI-native security products and capabilities — dark web intelligence, autonomous incident response, distributed detection and zero-trust architecture. Proven by Inscrape, Nirvana and SwarmScope.",
    icon: "Shield",
  },
  {
    id: "data-ml",
    name: "Data Engineering & ML",
    description:
      "Data pipelines, feature stores, model training and MLOps. We build the infrastructure that turns raw data into production ML systems — reliable, monitored and scalable.",
    icon: "FileCheck",
  },
];
