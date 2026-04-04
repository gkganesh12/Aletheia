export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export const team: TeamMember[] = [
  {
    name: "Arjun Malhotra",
    role: "Chief Executive Officer",
    bio: "Former head of AI security research at a Fortune 50 defence contractor. Arjun founded Aletheia AI to build a company where strong engineering solves hard problems — starting with cybersecurity and expanding into every domain where AI and software can create an unfair advantage. He holds a PhD in adversarial machine learning from MIT.",
    avatar: "/images/team/arjun-malhotra.jpg",
  },
  {
    name: "Elena Rodriguez",
    role: "Chief Technology Officer",
    bio: "A systems architect with 18 years of experience building distributed platforms at scale. Before Aletheia, Elena led infrastructure engineering at a leading cloud company and was a principal engineer at AWS. She oversees all engineering — products, client projects and platform architecture. Obsessed with building systems that are as elegant as they are resilient.",
    avatar: "/images/team/elena-rodriguez.jpg",
  },
  {
    name: "Daniel Okafor",
    role: "Head of Security Engineering",
    bio: "A 15-year veteran of offensive security with experience spanning military cyber operations, red team consulting and incident response. Daniel leads the security engineering practice at Aletheia, driving the technical direction of Inscrape, Nirvana and SwarmScope. He holds OSCP, OSCE and GXPN certifications.",
    avatar: "/images/team/daniel-okafor.jpg",
  },
  {
    name: "Aisha Patel",
    role: "Head of AI Research",
    bio: "A former research scientist at DeepMind specialising in reinforcement learning and adversarial robustness. Aisha leads the AI/ML team responsible for the models powering our products and the custom AI systems we build for clients. She holds a PhD from Stanford and her research has been cited over 3,000 times.",
    avatar: "/images/team/aisha-patel.jpg",
  },
  {
    name: "Marcus Chen",
    role: "Lead Platform Engineer",
    bio: "A full-stack infrastructure engineer with deep expertise in Kubernetes, stream processing and high-performance distributed systems. Marcus previously built real-time data platforms at Datadog and Cloudflare. At Aletheia, he leads the platform and DevOps team — building the infrastructure that powers our products and our client deployments.",
    avatar: "/images/team/marcus-chen.jpg",
  },
  {
    name: "Priya Sharma",
    role: "VP of Product & Growth",
    bio: "A former McKinsey engagement manager specialising in technology transformation. Priya leads product strategy and client relationships at Aletheia, ensuring our engineering capabilities translate into real business outcomes. She has helped over 60 organisations adopt AI and ship products that scale.",
    avatar: "/images/team/priya-sharma.jpg",
  },
  {
    name: "James Okonkwo",
    role: "Head of Threat Intelligence",
    bio: "A former intelligence analyst with experience at a national cyber security organisation and a global threat intelligence firm. James leads the threat intelligence practice and the team that powers Inscrape's collection sources and detection models. A regular speaker at Black Hat and DEF CON.",
    avatar: "/images/team/james-okonkwo.jpg",
  },
  {
    name: "Sophie Laurent",
    role: "Head of Design & Experience",
    bio: "A product designer with 12 years of experience crafting complex data-rich interfaces. Sophie previously led design at a leading SIEM vendor and at a startup acquired by Palo Alto Networks. She owns the user experience across all Aletheia products and leads design for client projects — making powerful software feel simple.",
    avatar: "/images/team/sophie-laurent.jpg",
  },
];
