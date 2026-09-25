export interface FeaturedProject {
  slug: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  illustrative: boolean;
}
export const featuredProjects: FeaturedProject[] = [
  {
    slug: "heurisight-rag",
    name: "HeuriSight",
    category: "AI / EDUCATION",
    summary: "Turning knowledge into a more intelligent assessment experience.",
    image: "/brand/project-heurisight.svg",
    imageAlt: "HeuriSight knowledge layers illustration",
    illustrative: true,
  },
  {
    slug: "rd-fitness-platform",
    name: "RD Fitness",
    category: "WEB / PLATFORM",
    summary: "A connected digital home for fitness and memberships.",
    image: "/brand/project-fitness.svg",
    imageAlt: "RD Fitness movement illustration",
    illustrative: true,
  },
  {
    slug: "codecraft-cli",
    name: "CodeCraft",
    category: "AI / DEVELOPER TOOLS",
    summary: "Bringing an AI coding workflow straight to the terminal.",
    image: "/brand/project-codecraft.svg",
    imageAlt: "CodeCraft terminal workflow illustration",
    illustrative: true,
  },
  {
    slug: "inscrape-sdk",
    name: "Inscrape",
    category: "DATA / PYTHON SDK",
    summary: "From the open web to structured, usable data.",
    image: "/brand/project-inscrape.svg",
    imageAlt: "Inscrape structured data illustration",
    illustrative: true,
  },
];
