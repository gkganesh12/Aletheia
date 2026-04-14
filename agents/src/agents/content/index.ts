import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  brandVoice: z.string().default("Professional, technically authoritative, innovative yet trustworthy"),
  targetAudience: z.string().default("CTOs, CISOs, VP Engineering at mid-market to enterprise"),
  domain: z.string().default("aletheiaai.tech"),
  products: z.array(z.any()).optional(),
  services: z.array(z.string()).optional(),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  dataFiles: z.array(z.object({ path: z.string() })),
  seoFiles: z.object({
    metaTags: z.string(),
    structuredData: z.string(),
    robotsTxt: z.string(),
    sitemapXml: z.string(),
  }),
  copyDeck: z.record(z.string()),
});

type Output = z.infer<typeof OutputSchema>;

export class ContentAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "content";
  readonly description = "Generate marketing copy, SEO metadata, structured data, alt text, robots.txt, and sitemap.xml";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(_input: Input): Promise<AgentPlan> {
    return {
      description: "Generate all marketing content, SEO metadata, and structured data",
      steps: [
        { id: "copy", description: "Generate marketing copy for all sections", files: [`${this.outputDir}/src/data/copy.ts`], action: "create" },
        { id: "seo-meta", description: "Generate SEO meta component", files: [`${this.outputDir}/src/components/shared/SEOHead.tsx`], action: "create" },
        { id: "structured-data", description: "Generate JSON-LD structured data", files: [`${this.outputDir}/src/lib/structured-data.ts`], action: "create" },
        { id: "robots", description: "Generate robots.txt", files: [`${this.outputDir}/public/robots.txt`], action: "create" },
        { id: "sitemap", description: "Generate sitemap.xml", files: [`${this.outputDir}/public/sitemap.xml`], action: "create" },
      ],
      estimatedFiles: 6,
      estimatedTokens: 40000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const dataFiles: { path: string }[] = [];
    const copyDeck: Record<string, string> = {};

    // Step 1: Generate full copy deck
    this.updateSpinner("Generating marketing copy...");
    const copyPrompt = `You are a senior copywriter for Aletheia AI, an elite AI engineering & cybersecurity agency.

Brand voice: ${input.brandVoice}
Target audience: ${input.targetAudience}

Generate a TypeScript file that exports all website copy organized by section:

export const copy = {
  hero: {
    headline: "...",       // Bold, attention-grabbing, 5-8 words
    subheadline: "...",    // 1-2 sentences expanding on the headline
    ctaPrimary: "...",     // Primary CTA button text
    ctaSecondary: "...",   // Secondary CTA button text
  },
  about: {
    overline: "...",       // Small text above heading (e.g., "Our Story")
    heading: "...",
    paragraph: "...",      // 3-4 sentences about the company
    trustCards: [
      { label: "...", value: "...", description: "..." },  // 4 trust indicators
    ],
  },
  services: {
    overline: "...",
    heading: "...",
    description: "...",    // 1-2 sentences
  },
  products: {
    overline: "...",
    heading: "...",
    description: "...",
  },
  stats: {
    overline: "...",
    heading: "...",
  },
  caseStudies: {
    overline: "...",
    heading: "...",
    description: "...",
  },
  testimonials: {
    overline: "...",
    heading: "...",
  },
  contact: {
    overline: "...",
    heading: "...",
    description: "...",    // Compelling reason to get in touch
    formLabels: {
      name: "...", email: "...", company: "...", service: "...", message: "...", submit: "...",
    },
  },
  footer: {
    tagline: "...",        // Short company tagline
    copyright: "...",
  },
} as const;

Make the copy compelling, professional, and conversion-focused. Use active voice. The hero headline should be memorable.`;

    const copyCode = await this.askClaudeForCode(copyPrompt);
    const copyPath = `${this.outputDir}/src/data/copy.ts`;
    await this.fileOps.writeFile(copyPath, copyCode);
    dataFiles.push({ path: copyPath });

    // Step 2: SEO Head component
    this.updateSpinner("Generating SEO metadata...");
    const seoCode = await this.askClaudeForCode(
      `Create a React component "SEOHead" using react-helmet-async that renders all SEO meta tags.

Props: { title?: string, description?: string, ogImage?: string, path?: string }

Default values for Aletheia AI:
- Title: "Aletheia AI — AI Engineering & Cybersecurity Agency"
- Description: compelling 155-char meta description
- OG tags (title, description, image, type, url)
- Twitter card tags (summary_large_image)
- Canonical URL using domain: ${input.domain}

Import { Helmet } from "react-helmet-async". TypeScript.`
    );
    const seoPath = `${this.outputDir}/src/components/shared/SEOHead.tsx`;
    await this.fileOps.writeFile(seoPath, seoCode);

    // Step 3: JSON-LD structured data
    this.updateSpinner("Generating structured data...");
    const ldCode = await this.askClaudeForCode(
      `Create a TypeScript file that exports JSON-LD structured data objects for:

1. organizationSchema — Organization type with name "Aletheia AI", url "https://${input.domain}", description, logo, social profiles
2. webPageSchema — WebPage type for the main page
3. productSchemas — array of 3 Product schemas for Inscrape, Nirvana, SwarmScope

Also export a helper component "StructuredData" that renders a <script type="application/ld+json"> tag.

Use proper Schema.org types. Export as named exports.`
    );
    const ldPath = `${this.outputDir}/src/lib/structured-data.ts`;
    await this.fileOps.writeFile(ldPath, ldCode);

    // Step 4: robots.txt
    this.updateSpinner("Generating robots.txt...");
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${input.domain}/sitemap.xml

# Block admin/preview paths
Disallow: /studio/
Disallow: /api/
`;
    const robotsPath = `${this.outputDir}/public/robots.txt`;
    await this.fileOps.writeFile(robotsPath, robotsTxt);

    // Step 5: sitemap.xml
    this.updateSpinner("Generating sitemap.xml...");
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${input.domain}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${input.domain}/#services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${input.domain}/#products</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://${input.domain}/#contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
    const sitemapPath = `${this.outputDir}/public/sitemap.xml`;
    await this.fileOps.writeFile(sitemapPath, sitemapXml);

    return {
      dataFiles,
      seoFiles: {
        metaTags: seoPath,
        structuredData: ldPath,
        robotsTxt: robotsPath,
        sitemapXml: sitemapPath,
      },
      copyDeck,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const file of output.dataFiles) {
      const exists = await this.fileOps.fileExists(file.path);
      if (!exists) errors.push(`Data file not found: ${file.path}`);
    }

    const robotsExists = await this.fileOps.fileExists(output.seoFiles.robotsTxt);
    if (!robotsExists) warnings.push("robots.txt not generated");

    return { valid: errors.length === 0, errors, warnings };
  }
}
