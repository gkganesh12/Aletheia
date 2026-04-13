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
      "End-to-end design, development and deployment of AI-powered products. LLM applications, multi-agent systems, RAG pipelines, computer vision — built for production from day one.",
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
    id: "cybersecurity",
    name: "Cybersecurity & Auditing",
    description:
      "Security audits, penetration testing, vulnerability assessments and secure architecture design. CEH-certified team with hands-on offensive and defensive security experience.",
    icon: "Shield",
  },
  {
    id: "blockchain",
    name: "Blockchain & Web3",
    description:
      "Smart contract development, DApp architecture, token systems and decentralised platform engineering. From Solidity to full-stack Web3 applications.",
    icon: "Link",
  },
  {
    id: "data-ml",
    name: "Data Engineering & ML",
    description:
      "Data pipelines, model training, MLOps and production ML systems. We build the infrastructure that turns raw data into intelligent applications — reliable, monitored and scalable.",
    icon: "FileCheck",
  },
];
