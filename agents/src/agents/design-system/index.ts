import { z } from "zod";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  colorMode: z.enum(["dark", "light", "both"]).default("dark"),
  brandDescription: z.string().default("AI engineering and cybersecurity agency"),
  primaryFont: z.string().optional(),
  accentColor: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  tailwindConfig: z.string(),
  cssVariables: z.string(),
  uiComponents: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      variants: z.array(z.string()),
    })
  ),
  tokenDefinitions: z.string(),
});

type Output = z.infer<typeof OutputSchema>;

export class DesignSystemAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "design-system";
  readonly description = "Generate brand tokens, Tailwind config, CSS variables, and reusable UI component library";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    return {
      description: "Create complete design system with tokens, Tailwind config, and UI components",
      steps: [
        {
          id: "tokens",
          description: "Generate design tokens (colors, typography, spacing, effects)",
          files: [
            `${this.outputDir}/tailwind.config.ts`,
            `${this.outputDir}/src/index.css`,
            `${this.outputDir}/src/types/design-tokens.ts`,
          ],
          action: "modify",
        },
        {
          id: "ui-components",
          description: "Create reusable UI components (Button, Card, GlassPanel, Badge, Container, SectionHeading, GradientText, AnimatedCounter)",
          files: [
            `${this.outputDir}/src/components/ui/Button.tsx`,
            `${this.outputDir}/src/components/ui/Card.tsx`,
            `${this.outputDir}/src/components/ui/GlassPanel.tsx`,
            `${this.outputDir}/src/components/ui/Badge.tsx`,
            `${this.outputDir}/src/components/ui/Container.tsx`,
            `${this.outputDir}/src/components/ui/SectionHeading.tsx`,
            `${this.outputDir}/src/components/ui/GradientText.tsx`,
            `${this.outputDir}/src/components/ui/AnimatedCounter.tsx`,
          ],
          action: "create",
        },
        {
          id: "stories",
          description: "Generate Storybook stories for all UI components",
          files: [`${this.outputDir}/src/components/ui/*.stories.tsx`],
          action: "create",
        },
      ],
      estimatedFiles: 20,
      estimatedTokens: 40000,
    };
  }

  async execute(input: Input, plan: AgentPlan): Promise<Output> {
    const components: Output["uiComponents"] = [];

    // Step 1: Generate design tokens via Claude
    this.updateSpinner("Generating design tokens...");
    const tokensPrompt = `Generate a complete design token system for ${input.brandDescription}. The website is dark-mode first with a cybersecurity/AI aesthetic.

Return the tokens as a TypeScript file with these exports:
- colors: primary (deep navy/black shades), accent (electric blue/cyan), success, warning, error, neutral scale (50-950)
- typography: font families (Inter for body, Space Grotesk for headings), sizes (xs through 6xl), weights, line-heights
- spacing: section padding, container max-widths
- effects: frosted glass backdrop-filter values, gradient definitions, box shadow values, glow effects
- animation: duration tokens, easing functions

Make the colors suitable for a premium AI/cybersecurity brand. Use hex values.`;

    const tokensCode = await this.askClaudeForCode(tokensPrompt);
    await this.fileOps.writeFile(
      `${this.outputDir}/src/types/design-tokens.ts`,
      tokensCode
    );

    // Step 2: Generate enhanced Tailwind config
    this.updateSpinner("Generating Tailwind config...");
    const tailwindPrompt = `Generate a Tailwind CSS config file (tailwind.config.ts) for an AI/cybersecurity agency website.

Include:
- Custom color palette: primary (dark navy), accent (electric cyan/blue), with full shade scales
- Custom fonts: "Inter" for body, "Space Grotesk" for headings
- Extended spacing for large section paddings
- Custom border-radius tokens
- Box shadow definitions including glow effects
- Custom animation definitions (fadeIn, slideUp, slideDown, scaleIn)
- Extended backdrop-blur values for frosted glass
- Breakpoints: mobile (375), tablet (768), desktop (1024), xl (1440)
- Dark mode via "class" strategy

The config should use darkMode: "class" and content paths for src/**/*.{ts,tsx}.`;

    const tailwindCode = await this.askClaudeForCode(tailwindPrompt);
    await this.fileOps.writeFile(
      `${this.outputDir}/tailwind.config.ts`,
      tailwindCode
    );

    // Step 3: Generate CSS variables
    this.updateSpinner("Generating CSS variables...");
    const cssPrompt = `Generate an index.css file with Tailwind directives and CSS custom properties for an AI/cybersecurity dark-themed website.

Include:
- @tailwind base, components, utilities directives
- :root CSS variables for colors (both dark and light themes using data-theme attribute)
- @font-face declarations for Inter and Space Grotesk (from Google Fonts CDN)
- Custom utility classes (@layer components): .glass-panel, .gradient-text, .glow, .section-padding
- Smooth scroll behavior
- Selection colors
- Scrollbar styling for webkit

Dark theme is the default.`;

    const cssCode = await this.askClaudeForCode(cssPrompt, "css");
    await this.fileOps.writeFile(`${this.outputDir}/src/index.css`, cssCode);

    // Step 4: Generate UI components
    const uiComponents = [
      { name: "Button", variants: ["primary", "secondary", "ghost", "outline"] },
      { name: "Card", variants: ["glass", "bordered", "elevated"] },
      { name: "GlassPanel", variants: ["default", "strong", "subtle"] },
      { name: "Badge", variants: ["default", "success", "warning", "accent"] },
      { name: "Container", variants: ["default", "narrow", "wide"] },
      { name: "SectionHeading", variants: ["default", "centered", "left"] },
      { name: "GradientText", variants: ["accent", "warm", "cool"] },
      { name: "AnimatedCounter", variants: ["default"] },
    ];

    for (const comp of uiComponents) {
      this.updateSpinner(`Generating ${comp.name} component...`);

      const componentPrompt = `Generate a React TypeScript component for "${comp.name}" as part of a premium AI/cybersecurity website design system.

Variants: ${comp.variants.join(", ")}

Requirements:
- Export as named export
- Use TypeScript with proper prop types interface
- Use Tailwind CSS classes (dark theme by default)
- Import cn() from "@/lib/utils"
- Support className prop for composition
- Include proper ARIA attributes
- Use forwardRef for DOM element components
- The design should feel premium, futuristic, and technically sophisticated

For the ${comp.name} specifically:
${comp.name === "Button" ? "Include sizes sm/md/lg, loading state with spinner, icon slot (left/right), disabled state" : ""}
${comp.name === "Card" ? "Glass variant uses backdrop-blur and semi-transparent background. Include hover lift effect option." : ""}
${comp.name === "GlassPanel" ? "Uses backdrop-filter: blur with semi-transparent backgrounds. Subtle border with gradient." : ""}
${comp.name === "SectionHeading" ? "Includes overline text (small, uppercase, accent color), main heading (h2), and optional description paragraph." : ""}
${comp.name === "GradientText" ? "Applies a gradient color to text using bg-clip-text and text-transparent." : ""}
${comp.name === "AnimatedCounter" ? "Counts up from 0 to target number when visible. Use IntersectionObserver. Accept format (number, percentage, currency)." : ""}

Return ONLY the TypeScript code.`;

      const code = await this.askClaudeForCode(componentPrompt);
      const compPath = `${this.outputDir}/src/components/ui/${comp.name}.tsx`;
      await this.fileOps.writeFile(compPath, code);

      components.push({
        name: comp.name,
        path: compPath,
        variants: comp.variants,
      });

      // Generate Storybook story
      const storyPrompt = `Generate a Storybook story file for the ${comp.name} React component.

The component is imported from "./${comp.name}".
Variants: ${comp.variants.join(", ")}

Requirements:
- Use CSF3 format (Meta, StoryObj)
- Include a Default story
- Include one story per variant
- Include a story showing dark and light theme side by side
- Use proper TypeScript typing
- Set layout to "centered" for small components, "fullscreen" for sections

Return ONLY the TypeScript code.`;

      const storyCode = await this.askClaudeForCode(storyPrompt);
      await this.fileOps.writeFile(
        `${this.outputDir}/src/components/ui/${comp.name}.stories.tsx`,
        storyCode
      );
    }

    // Step 5: Generate index barrel file
    const barrelExports = uiComponents
      .map((c) => `export { default as ${c.name} } from "./${c.name}";`)
      .join("\n");
    await this.fileOps.writeFile(
      `${this.outputDir}/src/components/ui/index.ts`,
      barrelExports + "\n"
    );

    return {
      tailwindConfig: `${this.outputDir}/tailwind.config.ts`,
      cssVariables: `${this.outputDir}/src/index.css`,
      uiComponents: components,
      tokenDefinitions: `${this.outputDir}/src/types/design-tokens.ts`,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const exists = await this.fileOps.fileExists(output.tailwindConfig);
    if (!exists) errors.push("Tailwind config not found");

    if (output.uiComponents.length < 5) {
      warnings.push("Expected at least 5 UI components");
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
