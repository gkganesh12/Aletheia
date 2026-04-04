import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  targetScores: z.object({
    performance: z.number().default(90),
    accessibility: z.number().default(95),
    bestPractices: z.number().default(90),
    seo: z.number().default(95),
  }).default({}),
  maxBundleSize: z.number().default(300),
  setupAnalytics: z.boolean().default(true),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  lighthouseReport: z.object({
    performance: z.number(),
    accessibility: z.number(),
    bestPractices: z.number(),
    seo: z.number(),
  }).optional(),
  bundleAnalysis: z.object({
    totalSize: z.number(),
    gzippedSize: z.number(),
    chunks: z.array(z.object({ name: z.string(), size: z.number() })),
  }).optional(),
  optimizations: z.array(z.object({
    type: z.string(),
    file: z.string(),
    description: z.string(),
    applied: z.boolean(),
  })),
  seoAudit: z.object({
    pass: z.number(),
    warn: z.number(),
    fail: z.number(),
    issues: z.array(z.string()),
  }),
});

type Output = z.infer<typeof OutputSchema>;

export class SeoPerfAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "seo-perf";
  readonly description = "Audit and optimize for Core Web Vitals, Lighthouse scores, bundle size, and SEO compliance";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(_input: Input): Promise<AgentPlan> {
    return {
      description: "Audit SEO, performance, and bundle size; generate optimization patches and analytics setup",
      steps: [
        { id: "bundle", description: "Analyze bundle size and generate code splitting config", files: [`${this.outputDir}/vite.config.ts`], action: "modify" },
        { id: "images", description: "Generate image optimization utilities", files: [`${this.outputDir}/src/lib/image-utils.ts`], action: "create" },
        { id: "resource-hints", description: "Add preload/prefetch resource hints to index.html", files: [`${this.outputDir}/index.html`], action: "modify" },
        { id: "analytics", description: "Create analytics wrapper (GA4 + Hotjar)", files: [`${this.outputDir}/src/lib/analytics.ts`], action: "create" },
        { id: "web-vitals", description: "Set up Core Web Vitals reporting", files: [`${this.outputDir}/src/lib/web-vitals.ts`], action: "create" },
        { id: "audit", description: "Run SEO audit and report", files: [], action: "create" },
      ],
      estimatedFiles: 5,
      estimatedTokens: 25000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const optimizations: Output["optimizations"] = [];
    const seoIssues: string[] = [];

    // Step 1: Image optimization utilities
    this.updateSpinner("Creating image optimization utilities...");
    const imageUtilsCode = await this.askClaudeForCode(
      `Create an image utilities file for a React + Vite project:

Export:
1. OptimizedImage component — renders <picture> with WebP/AVIF sources, lazy loading, width/height for CLS prevention
2. getImageUrl(path, options) — returns optimized image URL with width/format params
3. imageSizes — predefined responsive size breakpoints

Use TypeScript. Support loading="lazy" by default, loading="eager" for above-fold.`
    );
    await this.fileOps.writeFile(`${this.outputDir}/src/lib/image-utils.ts`, imageUtilsCode);
    optimizations.push({ type: "images", file: "src/lib/image-utils.ts", description: "Added image optimization utilities", applied: true });

    // Step 2: Analytics wrapper
    if (input.setupAnalytics) {
      this.updateSpinner("Creating analytics wrapper...");
      const analyticsCode = await this.askClaudeForCode(
        `Create an analytics utility file that wraps GA4 and Hotjar:

Export:
1. initAnalytics(config: { ga4Id?: string, hotjarId?: string }) — loads scripts consent-aware
2. trackEvent(name: string, params?: Record<string, string>) — GA4 custom event
3. trackPageView(path: string) — GA4 page view
4. trackCTAClick(ctaName: string, section: string) — convenience for CTA tracking
5. trackFormSubmission(formName: string) — convenience for form tracking
6. trackSectionView(sectionId: string) — track when a section enters viewport

Requirements:
- Check for consent before loading (respect DNT header)
- Load scripts dynamically (don't block render)
- TypeScript with proper types
- Queue events before scripts load, flush after

Don't actually load real GA4/Hotjar scripts — use placeholder IDs and comments.`
      );
      await this.fileOps.writeFile(`${this.outputDir}/src/lib/analytics.ts`, analyticsCode);
      optimizations.push({ type: "analytics", file: "src/lib/analytics.ts", description: "Added GA4 + Hotjar analytics wrapper", applied: true });
    }

    // Step 3: Web Vitals reporting
    this.updateSpinner("Setting up Web Vitals...");
    const webVitalsCode = await this.askClaudeForCode(
      `Create a Web Vitals reporting utility:

Import from "web-vitals" (onCLS, onFID, onLCP, onINP, onTTFB).
Export reportWebVitals(onPerfEntry) that:
1. Measures all Core Web Vitals
2. Logs them to console in development
3. Sends to analytics in production (via trackEvent)

TypeScript. Include type for the metric callback.`
    );
    await this.fileOps.writeFile(`${this.outputDir}/src/lib/web-vitals.ts`, webVitalsCode);

    // Step 4: Vite config optimization
    this.updateSpinner("Optimizing Vite config...");
    const viteOptCode = await this.askClaudeForCode(
      `Generate an optimized vite.config.ts for a React + Tailwind website that needs Lighthouse 90+:

Include:
- react plugin
- Path alias (@/ -> src/)
- Build optimizations:
  - Manual chunks: vendor (react, react-dom), animations (framer-motion, gsap), cms (sanity)
  - minify: "esbuild"
  - sourcemap: false in production
  - cssMinify: true
  - rollupOptions.output.assetFileNames for cache busting
- Server config for development
- Preview config
- Define __APP_VERSION__ from package.json

Target: < ${input.maxBundleSize}KB gzipped total.`
    );
    await this.fileOps.writeFile(`${this.outputDir}/vite.config.ts`, viteOptCode);
    optimizations.push({ type: "build", file: "vite.config.ts", description: "Optimized Vite build config with code splitting", applied: true });

    // Step 5: SEO audit
    this.updateSpinner("Running SEO audit...");
    let seoPass = 0, seoWarn = 0, seoFail = 0;

    // Check index.html for meta tags
    const indexHtml = await this.fileOps.readFile(`${this.outputDir}/index.html`);
    if (indexHtml) {
      if (!indexHtml.includes("<title>")) { seoFail++; seoIssues.push("Missing <title> tag"); }
      else { seoPass++; }
      if (!indexHtml.includes("viewport")) { seoFail++; seoIssues.push("Missing viewport meta tag"); }
      else { seoPass++; }
      if (!indexHtml.includes('lang="')) { seoWarn++; seoIssues.push("Missing lang attribute on <html>"); }
      else { seoPass++; }
    }

    // Check for robots.txt
    const robotsExists = await this.fileOps.fileExists(`${this.outputDir}/public/robots.txt`);
    if (robotsExists) { seoPass++; } else { seoWarn++; seoIssues.push("Missing robots.txt"); }

    // Check for sitemap
    const sitemapExists = await this.fileOps.fileExists(`${this.outputDir}/public/sitemap.xml`);
    if (sitemapExists) { seoPass++; } else { seoWarn++; seoIssues.push("Missing sitemap.xml"); }

    return {
      optimizations,
      seoAudit: { pass: seoPass, warn: seoWarn, fail: seoFail, issues: seoIssues },
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.seoAudit.fail > 0) {
      warnings.push(`SEO audit has ${output.seoAudit.fail} failures: ${output.seoAudit.issues.join(", ")}`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
