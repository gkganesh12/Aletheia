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
    id: "fullstack-engineer",
    title: "Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (India preferred)",
    type: "Full-time / Contract",
    description:
      "Build production applications across our products and client projects. You will work with React, Next.js, Node.js, Python and TypeScript — shipping real features to real users. We are a small team, so you will have significant ownership and impact from day one.",
    requirements: [
      "2+ years building full-stack applications with React/Next.js and Node.js or Python",
      "Strong TypeScript skills and comfort with both frontend and backend",
      "Experience with PostgreSQL, Redis or similar databases",
      "Familiarity with Docker and cloud deployment (AWS, GCP or Vercel)",
      "Ability to ship independently — we don't micromanage",
      "Bonus: experience with AI/ML integration, blockchain or real-time systems",
    ],
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote (India preferred)",
    type: "Full-time / Contract",
    description:
      "Design and build AI-powered features across our products — from RAG pipelines and multi-agent systems to custom ML models. You will work on SwarmScope's simulation engine, Inscrape's extraction intelligence and client AI projects.",
    requirements: [
      "2+ years building ML/AI applications in Python",
      "Experience with LLMs, RAG pipelines or multi-agent systems",
      "Proficiency in PyTorch, LangChain or similar ML/AI frameworks",
      "Familiarity with vector databases (Pinecone, Weaviate) and knowledge graphs (Neo4j)",
      "Strong Python and API development skills (FastAPI/Flask)",
      "Bonus: published packages, open-source contributions or research experience",
    ],
  },
  {
    id: "blockchain-developer",
    title: "Blockchain Developer",
    department: "Engineering",
    location: "Remote",
    type: "Contract / Part-time",
    description:
      "Build smart contracts and decentralised applications for client projects. You will work with Solidity, Hardhat and full-stack Web3 tooling — shipping DApps, token systems and NFT platforms.",
    requirements: [
      "1+ years of Solidity smart contract development",
      "Experience with Hardhat, Ethers.js or Web3.js",
      "Understanding of ERC-20, ERC-721 and other token standards",
      "Security awareness — common smart contract vulnerabilities and mitigations",
      "Frontend skills (React + Web3 wallet integration) preferred",
      "Bonus: smart contract auditing experience",
    ],
  },
  {
    id: "security-researcher",
    title: "Security Researcher / Pentester",
    department: "Security",
    location: "Remote (India preferred)",
    type: "Contract / Part-time",
    description:
      "Conduct penetration tests, vulnerability assessments and security audits for client engagements. You will test web applications, APIs, cloud infrastructure and networks — finding what automated tools miss.",
    requirements: [
      "Hands-on experience with web application and API penetration testing",
      "Proficiency with Burp Suite, Nmap, Metasploit or similar tools",
      "Understanding of OWASP Top 10, common vulnerability classes and remediation",
      "CEH, OSCP or equivalent certification preferred",
      "Strong report writing skills — findings must be clear and actionable",
      "Bonus: cloud security experience (AWS/GCP), bug bounty track record",
    ],
  },
];
