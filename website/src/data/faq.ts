export interface FAQItem {
  question: string;
  answer: string;
}

export const homepageFAQ: FAQItem[] = [
  {
    question: "What does Aletheia AI do?",
    answer:
      "We are an engineering-first AI company. We build our own products — Inscrape, Nirvana and SwarmScope — in the cybersecurity space, and we also build for others. If you need an MVP shipped, an AI-powered product built, a full-stack platform engineered or cloud infrastructure deployed, our team can take it from idea to production.",
  },
  {
    question: "What kind of projects can you build?",
    answer:
      "Anything that needs strong engineering. AI-powered products, SaaS platforms, internal tools, data pipelines, multi-agent systems, cloud-native applications, mobile backends — you name it. Our cybersecurity products are the proof of our engineering depth, but our capabilities span the full stack. We work with startups shipping their first MVP and established companies building complex systems.",
  },
  {
    question: "Do you only do cybersecurity?",
    answer:
      "No. Cybersecurity is where our products live — Inscrape for threat intelligence, Nirvana for autonomous incident response and SwarmScope for distributed detection. But our engineering team builds across all domains: AI/ML, full-stack web and mobile, cloud infrastructure, data engineering and more. The products demonstrate what we can build; we bring the same engineering quality to every project.",
  },
  {
    question: "How do you approach MVP development?",
    answer:
      "We scope tightly, build fast and ship clean. We start by understanding the core problem and the simplest product that validates it. Then we design a scalable architecture — not throwaway code — and deliver a working product you can put in front of real users. Most MVPs ship within weeks, not months. We use modern stacks (React, Next.js, Node, Python, Go) and deploy on cloud infrastructure that scales when you need it.",
  },
  {
    question: "Can your security products be deployed on-premise?",
    answer:
      "Yes. All three products — Inscrape, Nirvana and SwarmScope — support on-premise and air-gapped deployment options alongside our SaaS offering. Many organisations in regulated industries require data residency controls, and our Enterprise tier includes dedicated deployment engineering support.",
  },
  {
    question: "How do you handle data privacy and confidentiality?",
    answer:
      "Security and confidentiality are foundational to everything we do. All client data is encrypted at rest and in transit, access is governed by strict role-based controls, and our systems are built to SOC 2 and ISO 27001 standards. For sensitive projects, we offer NDA-protected workflows and dedicated infrastructure options.",
  },
];

export const contactFAQ: FAQItem[] = [
  {
    question: "What is the best way to get in touch?",
    answer:
      "The fastest way is to fill out the contact form on this page. A member of our team will respond within 24 hours on business days. For urgent product support, email support@aletheia-ai.com directly — our team monitors this channel around the clock.",
  },
  {
    question: "Can I schedule a demo or discuss a project?",
    answer:
      "Absolutely. Submit a contact form request and let us know what you're looking for — whether it's a product demo for Inscrape, Nirvana or SwarmScope, or a conversation about a custom build. We will set up a call with the right person on our engineering team.",
  },
  {
    question: "Do you offer free trials?",
    answer:
      "Yes. Inscrape and SwarmScope offer 14-day free trials on their Starter and Pro tiers. Nirvana offers a guided proof-of-value engagement where we deploy the platform in a controlled segment of your environment and demonstrate containment capabilities against simulated threats. Contact us to get started with any of these options.",
  },
  {
    question: "What information should I include in my inquiry?",
    answer:
      "The more context you provide, the faster we can route your request to the right team. It helps to include your organisation's industry, approximate size (endpoints, employees or revenue range), the challenge or use case you are trying to address and any specific products or services you are interested in. Do not include sensitive security details in the contact form — we will set up a secure channel for those discussions.",
  },
  {
    question: "Where are you located?",
    answer:
      "Aletheia AI is headquartered in Pune, India. We work with clients globally and all onboarding and support is conducted remotely. For Enterprise product customers, on-site deployment engineering is available.",
  },
];
