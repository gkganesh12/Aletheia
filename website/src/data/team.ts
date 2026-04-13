export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export const team: TeamMember[] = [
  {
    name: "Ganesh Khetawat",
    role: "Founder & CEO",
    bio: "CS student, Certified Ethical Hacker and full-stack engineer with deep expertise across AI/ML, cybersecurity and systems architecture. Ganesh founded Aletheia AI with a simple belief: technology should solve real problems, not just showcase intelligence. He has shipped three SaaS products, published packages on PyPI and npm, and built complex systems spanning multi-agent simulations, dual-engine RAG pipelines and intelligent alert platforms.",
    avatar: "/images/founder/ganesh-khetawat.png",
  },
];
