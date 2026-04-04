import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  platform: z.enum(["vercel", "netlify", "amplify"]).default("vercel"),
  ciProvider: z.enum(["github-actions", "gitlab-ci"]).default("github-actions"),
  nodeVersion: z.string().default("20"),
  enablePreviewDeploys: z.boolean().default(true),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  deployConfig: z.string(),
  ciConfig: z.string(),
  securityHeaders: z.record(z.string()),
  preCommitConfig: z.string(),
});

type Output = z.infer<typeof OutputSchema>;

export class DeployAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "deploy";
  readonly description = "Configure deployment platform, CI/CD pipeline, security headers, and pre-commit hooks";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    return {
      description: `Configure ${input.platform} deployment + ${input.ciProvider} CI/CD`,
      steps: [
        { id: "deploy-config", description: `Generate ${input.platform} config`, files: [`${this.outputDir}/vercel.json`], action: "create" },
        { id: "ci", description: `Generate ${input.ciProvider} workflow`, files: [`.github/workflows/ci.yml`], action: "create" },
        { id: "pre-commit", description: "Set up husky + lint-staged", files: [`.husky/pre-commit`, `${this.outputDir}/package.json`], action: "create" },
      ],
      estimatedFiles: 4,
      estimatedTokens: 10000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const securityHeaders: Record<string, string> = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    };

    // Step 1: Vercel config
    this.updateSpinner("Generating Vercel config...");
    const vercelConfig = {
      framework: "vite",
      buildCommand: "cd website && npm run build",
      outputDirectory: "website/dist",
      headers: [
        {
          source: "/assets/(.*)",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        {
          source: "/fonts/(.*)",
          headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
        },
        {
          source: "/(.*)",
          headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
        },
      ],
      redirects: [],
      rewrites: [{ source: "/(.*)", destination: "/index.html" }],
    };
    const deployPath = `${this.outputDir}/vercel.json`;
    await this.fileOps.writeFile(deployPath, JSON.stringify(vercelConfig, null, 2));

    // Step 2: GitHub Actions
    this.updateSpinner("Generating CI/CD workflow...");
    const ciYaml = `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "${input.nodeVersion}"
          cache: "npm"

      - name: Install dependencies
        run: npm ci
        working-directory: website

      - name: Lint
        run: npm run lint
        working-directory: website

      - name: Type Check
        run: npx tsc --noEmit
        working-directory: website

      - name: Unit Tests
        run: npm run test
        working-directory: website

      - name: Build
        run: npm run build
        working-directory: website

  lighthouse:
    name: Lighthouse Audit
    runs-on: ubuntu-latest
    needs: quality
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "${input.nodeVersion}"
          cache: "npm"

      - name: Install & Build
        run: cd website && npm ci && npm run build

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v12
        with:
          uploadArtifacts: true
          configPath: ./website/lighthouserc.json

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: quality
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
`;
    const ciPath = `.github/workflows/ci.yml`;
    await this.fileOps.ensureDir(".github/workflows");
    await this.fileOps.writeFile(ciPath, ciYaml);

    // Step 3: Lighthouse CI config
    const lighthouseConfig = {
      ci: {
        collect: { staticDistDir: "./dist" },
        assert: {
          assertions: {
            "categories:performance": ["warn", { minScore: 0.9 }],
            "categories:accessibility": ["error", { minScore: 0.95 }],
            "categories:best-practices": ["warn", { minScore: 0.9 }],
            "categories:seo": ["warn", { minScore: 0.95 }],
          },
        },
        upload: { target: "temporary-public-storage" },
      },
    };
    await this.fileOps.writeFile(
      `${this.outputDir}/lighthouserc.json`,
      JSON.stringify(lighthouseConfig, null, 2)
    );

    // Step 4: Pre-commit hooks (husky + lint-staged config in package.json)
    this.updateSpinner("Setting up pre-commit hooks...");
    await this.fileOps.ensureDir(".husky");
    const preCommitScript = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

cd website && npx lint-staged
`;
    const preCommitPath = ".husky/pre-commit";
    await this.fileOps.writeFile(preCommitPath, preCommitScript);

    return {
      deployConfig: deployPath,
      ciConfig: ciPath,
      securityHeaders,
      preCommitConfig: preCommitPath,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const deployExists = await this.fileOps.fileExists(output.deployConfig);
    if (!deployExists) errors.push("Deploy config not found");

    const ciExists = await this.fileOps.fileExists(output.ciConfig);
    if (!ciExists) errors.push("CI config not found");

    return { valid: errors.length === 0, errors, warnings };
  }
}
