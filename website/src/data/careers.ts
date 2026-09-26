export interface JobListing {
  id: string;
  title: string;
  department: string;
  location?: string;
  type?: string;
  description: string;
  requirements: string[];
}

export const careers: JobListing[] = [
  {
    id: "full-stack-developer-intern",
    title: "Full Stack Developer Intern",
    department: "Engineering",
    type: "Internship",
    description:
      "Help build websites and web applications across the frontend and backend. Work on interfaces, APIs and integrations alongside the team.",
    requirements: [
      "Working knowledge of HTML, CSS and JavaScript",
      "Interest in frontend and backend development",
      "Share a project, GitHub profile or CV",
    ],
  },
  {
    id: "ai-intern",
    title: "AI Intern",
    department: "Engineering",
    type: "Internship",
    description:
      "Help prototype and evaluate AI features, work with data and connect models to useful applications. Bring your curiosity and projects you have explored.",
    requirements: [
      "Familiarity with Python and basic AI concepts",
      "Interest in LLM applications, data or machine learning",
      "Share a project, GitHub profile or CV",
    ],
  },
  {
    id: "rust-python-intern",
    title: "Rust/Python Intern",
    department: "Engineering",
    type: "Internship",
    description:
      "Build tools, backend features and integrations using Rust or Python. Experience with either language is welcome; you do not need to know both.",
    requirements: [
      "Working knowledge of Rust or Python",
      "Interest in APIs, automation or developer tools",
      "Share a project, GitHub profile or CV",
    ],
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    description:
      "Design clear user journeys and usable interfaces for websites and AI products. Turn ideas into wireframes, prototypes and designs the team can build.",
    requirements: [
      "A portfolio showing interface design and your process",
      "Interest in usability, accessibility and interaction design",
      "Comfort collaborating with developers",
    ],
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    department: "Design",
    description:
      "Create visual identities, social graphics and marketing materials for Aletheia AI and its projects. Bring care for typography, colour and composition.",
    requirements: [
      "A portfolio of visual design work",
      "Attention to typography, layout and brand consistency",
      "Ability to prepare assets for web and print",
    ],
  },
  {
    id: "software-engineer",
    title: "Software Engineer",
    department: "Engineering",
    description:
      "Build and maintain reliable software across products and client projects. Work on features, integrations, testing and the details that make software useful.",
    requirements: [
      "Experience building and debugging software",
      "Comfort with Git, APIs and testing",
      "Share relevant projects, a GitHub profile or CV",
    ],
  },
];
