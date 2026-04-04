import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult, SectionId, SectionIds } from "../../core/types.js";

const InputSchema = z.object({
  sections: z.union([z.array(z.string()), z.literal("all")]).default("all"),
  generateStories: z.boolean().default(true),
  componentStyle: z.enum(["functional", "arrow"]).default("arrow"),
  stateManagement: z.enum(["local", "zustand", "context"]).default("local"),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  components: z.array(
    z.object({
      sectionId: z.string(),
      files: z.array(z.object({ path: z.string(), type: z.string() })),
    })
  ),
  appTsx: z.string(),
  dataFiles: z.array(z.string()),
});

type Output = z.infer<typeof OutputSchema>;

interface SectionSpec {
  id: SectionId;
  name: string;
  componentName: string;
  description: string;
  subcomponents: string[];
  dataFile?: string;
}

const SECTION_SPECS: SectionSpec[] = [
  {
    id: "preloader", name: "Preloader", componentName: "Preloader",
    description: "Full-screen loading overlay with Aletheia AI logo pulsing animation, minimum 1.5s display, fade-out exit",
    subcomponents: [],
  },
  {
    id: "navbar", name: "Navbar", componentName: "Navbar",
    description: "Fixed navigation bar with frosted glass effect. Transparent at top, opaque on scroll. Logo left, nav links center, CTA right. Mobile hamburger menu.",
    subcomponents: ["NavLink", "MobileMenu"],
  },
  {
    id: "hero", name: "Hero", componentName: "Hero",
    description: "Full-viewport hero section with animated headline, subheadline, two CTAs (primary + secondary), particle/grid background, scroll indicator chevron",
    subcomponents: ["HeroParticles", "HeroCTA"],
  },
  {
    id: "marquee", name: "Marquee", componentName: "MarqueeStrip",
    description: "Two infinite-scroll keyword strips moving in opposite directions. Keywords: AI, Cybersecurity, Machine Learning, etc. Pure CSS animation.",
    subcomponents: [],
  },
  {
    id: "about", name: "About", componentName: "About",
    description: "Company story with split layout (text + visual). Trust cards showing certifications, years, team size, clients served. Uses GlassPanel cards.",
    subcomponents: ["TrustCard"],
  },
  {
    id: "services", name: "Services", componentName: "Services",
    description: "6-card grid of services. Each card: SVG icon, title, description, hover glow. Grid: 3x2 desktop, 2x3 tablet, 1 column mobile.",
    subcomponents: ["ServiceCard"],
    dataFile: "services",
  },
  {
    id: "products", name: "Products", componentName: "Products",
    description: "3 SaaS product showcases: Inscrape (cyan-blue), Nirvana (coral-red), SwarmScope (purple-cyan). Each with gradient accent, logo, tagline, features, CTA.",
    subcomponents: ["ProductCard"],
    dataFile: "products",
  },
  {
    id: "stats", name: "Stats", componentName: "Stats",
    description: "Animated counters: 150+ clients, 99.9% uptime, 24/7 monitoring, 50M+ threats blocked. Count-up triggered by IntersectionObserver.",
    subcomponents: ["StatCounter"],
    dataFile: "stats",
  },
  {
    id: "case-studies", name: "Case Studies", componentName: "CaseStudies",
    description: "Carousel of 3-5 case study slides. Each: client, industry, challenge, solution, results. Arrow + dot navigation, auto-advance, keyboard accessible.",
    subcomponents: ["CaseStudySlide"],
    dataFile: "caseStudies",
  },
  {
    id: "testimonials", name: "Testimonials", componentName: "Testimonials",
    description: "Testimonial carousel. Each card: quote, author, role, company, avatar. Auto-rotate, pause on hover. 1 card mobile, 2 tablet, 3 desktop.",
    subcomponents: ["TestimonialCard"],
    dataFile: "testimonials",
  },
  {
    id: "tech-ribbon", name: "Tech Ribbon", componentName: "TechRibbon",
    description: "Auto-scrolling logo strip of tech stack: React, Python, AWS, TensorFlow, etc. Grayscale default, color on hover. Infinite loop.",
    subcomponents: ["TechLogo"],
  },
  {
    id: "contact", name: "Contact", componentName: "Contact",
    description: "Split layout: CTA text left, form right. Fields: name, email, company, service interest dropdown, message. Zod + react-hook-form validation.",
    subcomponents: ["ContactForm"],
  },
  {
    id: "footer", name: "Footer", componentName: "Footer",
    description: "Multi-column: company info, quick links, services, legal. Social icons, certification badges, copyright, back-to-top button.",
    subcomponents: ["FooterColumn", "CertBadge"],
  },
];

export class ComponentGenAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "component-gen";
  readonly description =
    "Generate all 13 PRD section components with TypeScript, responsive layouts, semantic HTML, ARIA, and Storybook stories";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    const sections = input.sections === "all"
      ? SECTION_SPECS
      : SECTION_SPECS.filter((s) => (input.sections as string[]).includes(s.id));

    const steps = sections.map((section) => ({
      id: section.id,
      description: `Generate ${section.componentName} section (${section.subcomponents.length} subcomponents)`,
      files: [
        `${this.outputDir}/src/components/sections/${section.componentName}/index.tsx`,
        ...section.subcomponents.map(
          (sub) => `${this.outputDir}/src/components/sections/${section.componentName}/${sub}.tsx`
        ),
        `${this.outputDir}/src/components/sections/${section.componentName}/types.ts`,
        ...(input.generateStories
          ? [`${this.outputDir}/src/components/sections/${section.componentName}/${section.componentName}.stories.tsx`]
          : []),
      ],
      action: "create" as const,
    }));

    return {
      description: `Generate ${sections.length} section components with subcomponents, types, and Storybook stories`,
      steps,
      estimatedFiles: sections.length * 5,
      estimatedTokens: sections.length * 10000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const sections = input.sections === "all"
      ? SECTION_SPECS
      : SECTION_SPECS.filter((s) => (input.sections as string[]).includes(s.id));

    const components: Output["components"] = [];
    const dataFiles: string[] = [];

    // Generate data files first
    this.updateSpinner("Generating static data files...");
    await this.generateDataFiles(dataFiles);

    // Generate each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      this.updateSpinner(`Generating ${section.componentName} (${i + 1}/${sections.length})...`);

      const files = await this.generateSection(section, input.generateStories);
      components.push({ sectionId: section.id, files });
    }

    // Generate/update App.tsx
    this.updateSpinner("Wiring up App.tsx...");
    const appTsxPath = await this.generateAppTsx(sections);

    return { components, appTsx: appTsxPath, dataFiles };
  }

  private async generateSection(
    section: SectionSpec,
    generateStories: boolean
  ): Promise<{ path: string; type: string }[]> {
    const sectionDir = `${this.outputDir}/src/components/sections/${section.componentName}`;
    const files: { path: string; type: string }[] = [];

    // Types file
    const typesCode = await this.askClaudeForCode(
      `Generate TypeScript types for the "${section.name}" section component.
Section description: ${section.description}
Subcomponents: ${section.subcomponents.join(", ") || "none"}
${section.dataFile ? `Data file import: "@/data/${section.dataFile}"` : ""}

Export interfaces for all props. Include any data types this section needs.
Use strict types, no "any".`
    );
    await this.fileOps.writeFile(`${sectionDir}/types.ts`, typesCode);
    files.push({ path: `${sectionDir}/types.ts`, type: "type" });

    // Subcomponents
    for (const sub of section.subcomponents) {
      const subCode = await this.askClaudeForCode(
        `Generate a React TypeScript component "${sub}" for the ${section.name} section.
Parent section: ${section.description}
This is a subcomponent used within the ${section.componentName} section.

Requirements:
- Import types from "./types"
- Use Tailwind CSS (dark theme)
- Import cn from "@/lib/utils"
- Proper TypeScript props
- Semantic HTML with ARIA attributes
- Responsive (mobile-first)
- Export as default

For ${sub}, it should be a focused, reusable component within this section.`
      );
      await this.fileOps.writeFile(`${sectionDir}/${sub}.tsx`, subCode);
      files.push({ path: `${sectionDir}/${sub}.tsx`, type: "component" });
    }

    // Main section component
    const mainCode = await this.askClaudeForCode(
      `Generate the main React TypeScript component for the "${section.name}" section of the Aletheia AI website.

SECTION SPEC:
${section.description}

SUBCOMPONENTS AVAILABLE: ${section.subcomponents.join(", ") || "none"}
${section.dataFile ? `DATA IMPORT: import { ${section.dataFile} } from "@/data/${section.dataFile}"` : ""}

REQUIREMENTS:
- Export as default function component
- Wrap in <section id="${section.id}" aria-label="${section.name}">
- Use <Container> wrapper from "@/components/ui/Container"
- Use <SectionHeading> for section title from "@/components/ui/SectionHeading"
- Import cn from "@/lib/utils"
- Import subcomponents from "./${section.subcomponents[0]}" etc.
- Responsive: works at 375px, 768px, 1024px, 1440px
- Use Tailwind CSS classes (dark theme)
- Semantic HTML (sections, articles, headings, lists)
- ARIA labels on interactive elements
- No hardcoded content strings — import from data files or use placeholder constants at top

Generate ONLY the TypeScript/React code.`
    );
    await this.fileOps.writeFile(`${sectionDir}/index.tsx`, mainCode);
    files.push({ path: `${sectionDir}/index.tsx`, type: "component" });

    // Storybook stories
    if (generateStories) {
      const storyCode = await this.askClaudeForCode(
        `Generate a Storybook story file for the "${section.componentName}" React section component.

Import from "./index" (default export).
Use CSF3 format with Meta and StoryObj.
Include stories:
1. Default — renders with default props
2. Mobile — viewport set to 375px
3. Desktop — viewport set to 1440px
4. DarkTheme — with dark background
5. LightTheme — with light background (className="light" on wrapper)

Set layout to "fullscreen". Proper TypeScript typing.`
      );
      const storyPath = `${sectionDir}/${section.componentName}.stories.tsx`;
      await this.fileOps.writeFile(storyPath, storyCode);
      files.push({ path: storyPath, type: "story" });
    }

    return files;
  }

  private async generateDataFiles(dataFiles: string[]): Promise<void> {
    const dataDir = `${this.outputDir}/src/data`;

    // Services data
    const servicesCode = await this.askClaudeForCode(
      `Generate a TypeScript data file exporting an array of 6 services for an AI/cybersecurity agency.

Each service: { id: string, name: string, description: string (2-3 sentences), icon: string (icon component name) }

Services: AI Strategy & Consulting, Custom AI/ML Development, Cybersecurity Auditing, Threat Intelligence, Data Engineering & Pipelines, AI Agent Development.

Export as "export const services = [...]" with proper TypeScript typing.`
    );
    const servicesPath = `${dataDir}/services.ts`;
    await this.fileOps.writeFile(servicesPath, servicesCode);
    dataFiles.push(servicesPath);

    // Products data
    const productsCode = await this.askClaudeForCode(
      `Generate a TypeScript data file for 3 SaaS products:

1. Inscrape — AI-Powered Web Scraping & Data Extraction. Gradient: ["#00D4FF", "#0066FF"]
2. Nirvana — Autonomous Security Monitoring. Gradient: ["#FF6B6B", "#FF2D55"]
3. SwarmScope — Multi-Agent AI Observability. Gradient: ["#7B61FF", "#00D4FF"]

Each: { id, name, tagline, description (2-3 sentences), features (4-5 strings), icon, gradient: [string, string] }

Export as "export const products = [...]" with TypeScript typing.`
    );
    await this.fileOps.writeFile(`${dataDir}/products.ts`, productsCode);
    dataFiles.push(`${dataDir}/products.ts`);

    // Stats data
    const statsCode = await this.askClaudeForCode(
      `Generate a TypeScript data file for animated stats:

4 stats: { id, label, value: number, suffix: string, prefix?: string }
- 150+ enterprise clients
- 99.9% uptime guarantee
- 24/7 monitoring & response
- 50M+ threats blocked

Export as "export const stats = [...]".`
    );
    await this.fileOps.writeFile(`${dataDir}/stats.ts`, statsCode);
    dataFiles.push(`${dataDir}/stats.ts`);

    // Testimonials data
    const testimonialsCode = await this.askClaudeForCode(
      `Generate a TypeScript data file with 5 placeholder testimonials for an AI/cybersecurity agency.

Each: { id, quote (2-3 sentences), author, role, company, avatar (placeholder URL like "/images/avatars/1.jpg") }

Mark as placeholder with a comment. Export as "export const testimonials = [...]".`
    );
    await this.fileOps.writeFile(`${dataDir}/testimonials.ts`, testimonialsCode);
    dataFiles.push(`${dataDir}/testimonials.ts`);

    // Case studies data
    const caseStudiesCode = await this.askClaudeForCode(
      `Generate a TypeScript data file with 4 placeholder case studies for an AI/cybersecurity agency.

Each: { id, title, client, industry, challenge (1-2 sentences), solution (1-2 sentences), results: string[] (3 metrics), image: string (placeholder) }

Mark as placeholder. Export as "export const caseStudies = [...]".`
    );
    await this.fileOps.writeFile(`${dataDir}/caseStudies.ts`, caseStudiesCode);
    dataFiles.push(`${dataDir}/caseStudies.ts`);

    // Navigation data
    const navCode = `export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;

export type NavLink = (typeof navLinks)[number];
`;
    await this.fileOps.writeFile(`${dataDir}/navigation.ts`, navCode);
    dataFiles.push(`${dataDir}/navigation.ts`);
  }

  private async generateAppTsx(sections: SectionSpec[]): Promise<string> {
    const imports = sections
      .filter((s) => s.id !== "preloader")
      .map((s) => `import ${s.componentName} from "@/components/sections/${s.componentName}";`)
      .join("\n");

    const sectionElements = sections
      .filter((s) => s.id !== "preloader" && s.id !== "navbar" && s.id !== "footer")
      .map((s) => `        <${s.componentName} />`)
      .join("\n");

    const appCode = `import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import Preloader from "@/components/shared/Preloader";
import CustomCursor from "@/components/shared/CustomCursor";
${imports}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <HelmetProvider>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <Navbar />
      <main>
${sectionElements}
      </main>
      <Footer />
    </HelmetProvider>
  );
}
`;

    const appPath = `${this.outputDir}/src/App.tsx`;
    await this.fileOps.writeFile(appPath, appCode);
    return appPath;
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.components.length < 10) {
      warnings.push(`Only ${output.components.length} sections generated, expected 13`);
    }

    const appExists = await this.fileOps.fileExists(output.appTsx);
    if (!appExists) errors.push("App.tsx not generated");

    if (output.dataFiles.length < 4) {
      warnings.push("Expected at least 4 data files");
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
