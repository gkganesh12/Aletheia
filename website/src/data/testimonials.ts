export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Nirvana cut our mean-time-to-contain by 94%. It stopped a ransomware attempt in under three minutes — something our previous SOC tooling would have taken hours to even surface.",
    author: "Priya Mehta",
    role: "Chief Information Security Officer",
    company: "NovaCrest Financial",
  },
  {
    id: "testimonial-2",
    quote:
      "We needed an MVP in six weeks. Aletheia's team scoped it, built it and deployed it on time with an architecture that actually scaled when we got our first wave of users. No throwaway code.",
    author: "James Whitfield",
    role: "CTO",
    company: "Helios Health Systems",
  },
  {
    id: "testimonial-3",
    quote:
      "Inscrape surfaced a credential dump in our first week that we had no idea existed. The entity resolution connected fragmented dark web mentions into a coherent threat picture no other tool caught.",
    author: "Sofia Reyes",
    role: "Head of Threat Intelligence",
    company: "Meridian Commerce",
  },
  {
    id: "testimonial-4",
    quote:
      "SwarmScope gave us visibility we didn't know was possible. Shadow IT, misconfigured cloud buckets, lateral movement attempts — it catches everything. Our board finally sleeps at night.",
    author: "Daniel Okonkwo",
    role: "Director of Infrastructure",
    company: "Atlas Logistics Group",
  },
  {
    id: "testimonial-5",
    quote:
      "Their engineering team built our entire AI pipeline — data ingestion, model training, deployment and monitoring. Production-grade from day one. We couldn't have done it in-house that fast.",
    author: "Emily Chen",
    role: "VP of Engineering",
    company: "Quantum Biotech",
  },
];
