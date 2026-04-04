import { z } from "zod";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

// ─── Input / Output schemas ────────────────────────────────────────────────

const InputSchema = z.object({
  generateSvgIcons: z.boolean().default(true),
  generateFavicons: z.boolean().default(true),
  generateOgImages: z.boolean().default(true),
  generateProductLogos: z.boolean().default(true),
  generateHeroVisuals: z.boolean().default(true),
});

type AssetGenInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  icons: z.array(z.string()),
  favicons: z.array(z.string()),
  ogImages: z.array(z.string()),
  productLogos: z.array(z.string()),
  heroVisuals: z.array(z.string()),
});

type AssetGenOutput = z.infer<typeof OutputSchema>;

// ─── Constants ─────────────────────────────────────────────────────────────

const SERVICE_ICONS = [
  { name: "ai-ml", label: "AI & Machine Learning" },
  { name: "threat-intel", label: "Threat Intelligence" },
  { name: "penetration-testing", label: "Penetration Testing" },
  { name: "soc-monitoring", label: "SOC Monitoring" },
  { name: "cloud-security", label: "Cloud Security" },
  { name: "incident-response", label: "Incident Response" },
] as const;

const PRODUCT_LOGOS = [
  { id: "inscrape", name: "Inscrape", tagline: "Intelligent Web Scraping" },
  { id: "nirvana", name: "Nirvana", tagline: "AI-Powered Security Platform" },
  { id: "swarmscope", name: "SwarmScope", tagline: "Distributed Threat Analysis" },
] as const;

// ─── Agent implementation ──────────────────────────────────────────────────

export class AssetGenAgent extends BaseAgent<AssetGenInput, AssetGenOutput> {
  readonly name: AgentName = "asset-gen";
  readonly description =
    "Generates SVG icons for services, product illustrations, favicon set, OG image templates, and hero visuals for the Aletheia AI website.";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  constructor(context: AgentContext) {
    super(context);
  }

  // ─── Plan ──────────────────────────────────────────────────────────────

  async plan(input: AssetGenInput): Promise<AgentPlan> {
    const assetsPath = `${this.outputDir}/public/assets`;
    const steps: AgentPlan["steps"] = [];
    let estimatedFiles = 0;

    if (input.generateSvgIcons) {
      steps.push({
        id: "service-icons",
        description: "Generate 6 AI/cybersecurity themed service SVG icons",
        files: SERVICE_ICONS.map((icon) => `${assetsPath}/icons/${icon.name}.svg`),
        action: "create",
      });
      estimatedFiles += SERVICE_ICONS.length;
    }

    if (input.generateProductLogos) {
      steps.push({
        id: "product-logos",
        description: "Generate SVG logos for Inscrape, Nirvana, and SwarmScope",
        files: PRODUCT_LOGOS.map((p) => `${assetsPath}/logos/${p.id}.svg`),
        action: "create",
      });
      estimatedFiles += PRODUCT_LOGOS.length;
    }

    if (input.generateFavicons) {
      steps.push({
        id: "favicons",
        description: "Generate favicon SVG and web manifest icons",
        files: [
          `${assetsPath}/favicon/favicon.svg`,
          `${assetsPath}/favicon/apple-touch-icon.svg`,
        ],
        action: "create",
      });
      estimatedFiles += 2;
    }

    if (input.generateHeroVisuals) {
      steps.push({
        id: "hero-visuals",
        description: "Generate abstract hero background SVG patterns",
        files: [
          `${assetsPath}/hero/grid-pattern.svg`,
          `${assetsPath}/hero/particle-field.svg`,
          `${assetsPath}/hero/circuit-lines.svg`,
        ],
        action: "create",
      });
      estimatedFiles += 3;
    }

    if (input.generateOgImages) {
      steps.push({
        id: "og-images",
        description: "Generate OG image SVG templates for social sharing",
        files: [
          `${assetsPath}/og/og-default.svg`,
          `${assetsPath}/og/og-product.svg`,
        ],
        action: "create",
      });
      estimatedFiles += 2;
    }

    return {
      description:
        "Generate all visual SVG assets including service icons, product logos, favicons, hero patterns, and OG image templates.",
      steps,
      estimatedFiles,
      estimatedTokens: estimatedFiles * 1500,
    };
  }

  // ─── Execute ───────────────────────────────────────────────────────────

  async execute(input: AssetGenInput, plan: AgentPlan): Promise<AssetGenOutput> {
    const assetsPath = `${this.outputDir}/public/assets`;
    const output: AssetGenOutput = {
      icons: [],
      favicons: [],
      ogImages: [],
      productLogos: [],
      heroVisuals: [],
    };

    // 1. Service icons
    if (input.generateSvgIcons) {
      this.updateSpinner("Generating service icons...");
      for (const icon of SERVICE_ICONS) {
        const svg = await this.generateServiceIcon(icon.name, icon.label);
        const filePath = `${assetsPath}/icons/${icon.name}.svg`;
        await this.fileOps.writeFile(filePath, svg);
        output.icons.push(filePath);
      }
    }

    // 2. Product logos
    if (input.generateProductLogos) {
      this.updateSpinner("Generating product logos...");
      for (const product of PRODUCT_LOGOS) {
        const svg = await this.generateProductLogo(product.id, product.name, product.tagline);
        const filePath = `${assetsPath}/logos/${product.id}.svg`;
        await this.fileOps.writeFile(filePath, svg);
        output.productLogos.push(filePath);
      }
    }

    // 3. Favicons
    if (input.generateFavicons) {
      this.updateSpinner("Generating favicon set...");
      const faviconSvg = await this.generateFavicon();
      const faviconPath = `${assetsPath}/favicon/favicon.svg`;
      await this.fileOps.writeFile(faviconPath, faviconSvg);
      output.favicons.push(faviconPath);

      const appleTouchSvg = await this.generateAppleTouchIcon();
      const appleTouchPath = `${assetsPath}/favicon/apple-touch-icon.svg`;
      await this.fileOps.writeFile(appleTouchPath, appleTouchSvg);
      output.favicons.push(appleTouchPath);
    }

    // 4. Hero visuals
    if (input.generateHeroVisuals) {
      this.updateSpinner("Generating hero background patterns...");
      const heroPatterns = [
        { name: "grid-pattern", description: "Subtle grid with glowing intersection dots" },
        { name: "particle-field", description: "Scattered particles with connecting lines" },
        { name: "circuit-lines", description: "Circuit board trace lines pattern" },
      ];

      for (const pattern of heroPatterns) {
        const svg = await this.generateHeroPattern(pattern.name, pattern.description);
        const filePath = `${assetsPath}/hero/${pattern.name}.svg`;
        await this.fileOps.writeFile(filePath, svg);
        output.heroVisuals.push(filePath);
      }
    }

    // 5. OG images
    if (input.generateOgImages) {
      this.updateSpinner("Generating OG image templates...");
      const ogDefault = await this.generateOgTemplate("default");
      const ogDefaultPath = `${assetsPath}/og/og-default.svg`;
      await this.fileOps.writeFile(ogDefaultPath, ogDefault);
      output.ogImages.push(ogDefaultPath);

      const ogProduct = await this.generateOgTemplate("product");
      const ogProductPath = `${assetsPath}/og/og-product.svg`;
      await this.fileOps.writeFile(ogProductPath, ogProduct);
      output.ogImages.push(ogProductPath);
    }

    return output;
  }

  // ─── Validate ──────────────────────────────────────────────────────────

  async validate(output: AssetGenOutput): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const allFiles = [
      ...output.icons,
      ...output.favicons,
      ...output.ogImages,
      ...output.productLogos,
      ...output.heroVisuals,
    ];

    if (allFiles.length === 0) {
      errors.push("No assets were generated");
    }

    // Verify each generated file exists
    for (const filePath of allFiles) {
      const exists = await this.fileOps.fileExists(filePath);
      if (!exists) {
        errors.push(`Expected asset file not found: ${filePath}`);
      }
    }

    // Verify SVG validity by checking for opening/closing tags
    for (const filePath of allFiles) {
      const content = await this.fileOps.readFile(filePath);
      if (content) {
        if (!content.includes("<svg") || !content.includes("</svg>")) {
          errors.push(`File is not valid SVG: ${filePath}`);
        }
        if (!content.includes("viewBox")) {
          warnings.push(`SVG missing viewBox attribute: ${filePath}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ─── SVG generation helpers ───────────────────────────────────────────

  private async generateServiceIcon(name: string, label: string): Promise<string> {
    return this.askClaudeForCode(
      `Generate a single SVG icon (24x24 viewBox) for the service "${label}" (filename: ${name}.svg).

Requirements:
- Viewbox: 0 0 24 24
- Use stroke-based line art style, stroke-width="1.5", stroke-linecap="round", stroke-linejoin="round".
- Use currentColor for stroke so the icon inherits text color.
- No fill on paths (fill="none" on the svg element).
- The icon should clearly represent "${label}" in an AI/cybersecurity context.
- Keep it clean and minimal — suitable for a professional website.
- Output a complete, valid SVG element.`,
      "svg"
    );
  }

  private async generateProductLogo(id: string, name: string, tagline: string): Promise<string> {
    return this.askClaudeForCode(
      `Generate an SVG logo mark for the product "${name}" (${tagline}).

Requirements:
- Viewbox: 0 0 48 48
- Modern, geometric, abstract mark — no text in the SVG.
- Use the Aletheia brand palette: cyan (#00F0FF), electric blue (#0066FF), purple (#8B5CF6).
- Product identity hints:
  ${id === "inscrape" ? "- Inscrape: web scraping — represent with interconnected nodes or a spider web motif." : ""}
  ${id === "nirvana" ? "- Nirvana: AI security platform — represent with a shield or neural network motif." : ""}
  ${id === "swarmscope" ? "- SwarmScope: distributed threat analysis — represent with a swarm or radar motif." : ""}
- Use gradients where appropriate (define in <defs>).
- Output a complete, valid SVG element.`,
      "svg"
    );
  }

  private async generateFavicon(): Promise<string> {
    return this.askClaudeForCode(
      `Generate an SVG favicon for "Aletheia AI".

Requirements:
- Viewbox: 0 0 32 32
- A bold, recognizable logomark that works at 16x16 and 32x32.
- Use the letter "A" stylized with a cyber/AI aesthetic, or an abstract shield shape.
- Primary color: cyan (#00F0FF) with dark background (#0A0A0F).
- Output a complete, valid SVG element.`,
      "svg"
    );
  }

  private async generateAppleTouchIcon(): Promise<string> {
    return this.askClaudeForCode(
      `Generate an SVG for an Apple Touch Icon for "Aletheia AI".

Requirements:
- Viewbox: 0 0 180 180
- Rounded square format (clip to rounded rect in SVG with rx="36").
- Dark background (#0A0A0F) with the Aletheia "A" logomark in cyan (#00F0FF).
- Bolder and simpler than the favicon — optimized for app icon contexts.
- Output a complete, valid SVG element.`,
      "svg"
    );
  }

  private async generateHeroPattern(name: string, description: string): Promise<string> {
    return this.askClaudeForCode(
      `Generate an SVG background pattern: "${name}" — ${description}.

Requirements:
- Viewbox: 0 0 1440 900 (full-width hero dimensions).
- Use very low-opacity elements (0.03–0.12) so it works as a subtle background.
- Color palette: cyan (#00F0FF), blue (#0066FF), purple (#8B5CF6) at low opacity on transparent background.
- The pattern should tile or fill the space naturally.
- Include subtle animation hints via SVG <animate> or <animateTransform> where appropriate (gentle pulse, drift).
- Output a complete, valid SVG element.`,
      "svg"
    );
  }

  private async generateOgTemplate(type: "default" | "product"): Promise<string> {
    const description =
      type === "default"
        ? "Default OG image for the Aletheia AI homepage. Show company name, tagline, and a subtle tech background pattern."
        : "Product-specific OG image template. Include a placeholder area for product name and description.";

    return this.askClaudeForCode(
      `Generate an SVG template for an Open Graph image: ${description}

Requirements:
- Viewbox: 0 0 1200 630 (standard OG dimensions).
- Dark background (#0A0A0F) with a subtle gradient or pattern.
- Include the text "Aletheia AI" in white/light color — use SVG <text> elements.
- ${type === "default" ? 'Include tagline "Intelligent Cybersecurity Solutions" below the name.' : 'Include placeholder text "{{PRODUCT_NAME}}" and "{{PRODUCT_TAGLINE}}" for template substitution.'}
- Add brand accent elements using cyan (#00F0FF) and blue (#0066FF).
- Output a complete, valid SVG element.`,
      "svg"
    );
  }
}
