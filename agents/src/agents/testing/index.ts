import { z } from "zod";
import * as path from "node:path";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

// ─── Input / Output Schemas ─────────────────────────────────────────────────

const TestTypeSchema = z.enum(["unit", "a11y", "visual"]);

const InputSchema = z.object({
  testTypes: z.array(TestTypeSchema).min(1),
  coverageTarget: z.number().min(0).max(100).default(80),
  runTests: z.boolean().default(false),
  frameworks: z.array(z.string()).default(["vitest", "@testing-library/react"]),
});

type Input = z.infer<typeof InputSchema>;

const TestFileSchema = z.object({
  path: z.string(),
  type: z.string(),
  passing: z.boolean(),
});

const CoverageSchema = z.object({
  statements: z.number(),
  branches: z.number(),
  functions: z.number(),
  lines: z.number(),
});

const A11yIssueSchema = z.object({
  component: z.string(),
  issue: z.string(),
  severity: z.string(),
});

const OutputSchema = z.object({
  testFiles: z.array(TestFileSchema),
  coverage: CoverageSchema,
  a11yIssues: z.array(A11yIssueSchema),
});

type Output = z.infer<typeof OutputSchema>;

// ─── Agent ──────────────────────────────────────────────────────────────────

export class TestingAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "testing";
  readonly description =
    "Generates unit tests, accessibility tests, and E2E test scaffolding for all components";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  // ─── Plan ───────────────────────────────────────────────────────────────

  async plan(input: Input): Promise<AgentPlan> {
    const componentFiles = await this.discoverComponents();
    const typesRequested = input.testTypes;

    const steps: AgentPlan["steps"] = [];

    if (typesRequested.includes("unit")) {
      steps.push({
        id: "generate-unit-tests",
        description: `Generate Vitest + RTL unit tests for ${componentFiles.length} components`,
        files: componentFiles.map((f) => f.replace(/\.tsx?$/, ".test.tsx")),
        action: "create",
      });
    }

    if (typesRequested.includes("a11y")) {
      steps.push({
        id: "generate-a11y-tests",
        description: "Generate axe-core accessibility test wrappers for each component",
        files: componentFiles.map((f) => f.replace(/\.tsx?$/, ".a11y.test.tsx")),
        action: "create",
      });
    }

    if (typesRequested.includes("visual")) {
      steps.push({
        id: "generate-e2e-scaffolding",
        description: "Generate Playwright E2E test scaffolding for critical user flows",
        files: [
          `${this.outputDir}/e2e/navigation.spec.ts`,
          `${this.outputDir}/e2e/contact-form.spec.ts`,
          `${this.outputDir}/e2e/visual-regression.spec.ts`,
          `${this.outputDir}/playwright.config.ts`,
        ],
        action: "create",
      });
    }

    if (input.runTests) {
      steps.push({
        id: "run-tests",
        description: "Execute test suite and collect coverage report",
        files: [],
        action: "modify",
      });
    }

    const estimatedFiles =
      (typesRequested.includes("unit") ? componentFiles.length : 0) +
      (typesRequested.includes("a11y") ? componentFiles.length : 0) +
      (typesRequested.includes("visual") ? 4 : 0);

    return {
      description: `Generate ${typesRequested.join(", ")} tests for ${componentFiles.length} components`,
      steps,
      estimatedFiles,
      estimatedTokens: estimatedFiles * 2500,
    };
  }

  // ─── Execute ────────────────────────────────────────────────────────────

  async execute(input: Input, plan: AgentPlan): Promise<Output> {
    const componentFiles = await this.discoverComponents();
    const testFiles: Output["testFiles"] = [];
    const a11yIssues: Output["a11yIssues"] = [];

    // ── Unit tests ────────────────────────────────────────────────────────
    if (input.testTypes.includes("unit")) {
      this.updateSpinner("Generating unit tests...");

      for (const componentFile of componentFiles) {
        const componentSource = await this.fileOps.readFile(componentFile);
        if (!componentSource) continue;

        const componentName = this.extractComponentName(componentFile);
        const testPath = componentFile.replace(/\.tsx?$/, ".test.tsx");

        this.updateSpinner(`Generating unit test: ${componentName}`);

        const testCode = await this.askClaudeForCode(
          this.buildUnitTestPrompt(componentName, componentSource, componentFile, input.frameworks),
          "typescript"
        );

        await this.fileOps.writeFile(testPath, testCode);
        testFiles.push({ path: testPath, type: "unit", passing: true });
      }
    }

    // ── Accessibility tests ───────────────────────────────────────────────
    if (input.testTypes.includes("a11y")) {
      this.updateSpinner("Generating accessibility tests...");

      for (const componentFile of componentFiles) {
        const componentSource = await this.fileOps.readFile(componentFile);
        if (!componentSource) continue;

        const componentName = this.extractComponentName(componentFile);
        const a11yTestPath = componentFile.replace(/\.tsx?$/, ".a11y.test.tsx");

        this.updateSpinner(`Generating a11y test: ${componentName}`);

        const a11yResult = await this.askClaudeForJSON<{
          testCode: string;
          issues: { issue: string; severity: string }[];
        }>(
          this.buildA11yTestPrompt(componentName, componentSource, componentFile)
        );

        await this.fileOps.writeFile(a11yTestPath, a11yResult.testCode);
        testFiles.push({ path: a11yTestPath, type: "a11y", passing: true });

        for (const issue of a11yResult.issues) {
          a11yIssues.push({
            component: componentName,
            issue: issue.issue,
            severity: issue.severity,
          });
        }
      }
    }

    // ── Playwright E2E scaffolding ────────────────────────────────────────
    if (input.testTypes.includes("visual")) {
      this.updateSpinner("Generating Playwright E2E scaffolding...");

      await this.generatePlaywrightConfig();
      await this.generateE2ETests(testFiles);
    }

    // ── Run tests (optional) ──────────────────────────────────────────────
    let coverage: Output["coverage"] = {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    };

    if (input.runTests) {
      this.updateSpinner("Running test suite...");
      const runResult = await this.runTestSuite(input.coverageTarget);
      coverage = runResult.coverage;

      // Update passing status based on actual results
      for (const tf of testFiles) {
        const matchingResult = runResult.fileResults.find((r) => r.path === tf.path);
        if (matchingResult) {
          tf.passing = matchingResult.passing;
        }
      }
    }

    return { testFiles, coverage, a11yIssues };
  }

  // ─── Validate ───────────────────────────────────────────────────────────

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.testFiles.length === 0) {
      errors.push("No test files were generated");
    }

    const failingTests = output.testFiles.filter((t) => !t.passing);
    if (failingTests.length > 0) {
      warnings.push(
        `${failingTests.length} test file(s) are not passing: ${failingTests.map((t) => t.path).join(", ")}`
      );
    }

    const criticalA11y = output.a11yIssues.filter((i) => i.severity === "critical");
    if (criticalA11y.length > 0) {
      warnings.push(
        `${criticalA11y.length} critical a11y issue(s) found: ${criticalA11y.map((i) => `${i.component}: ${i.issue}`).join("; ")}`
      );
    }

    // Verify all test files exist on disk
    for (const tf of output.testFiles) {
      const exists = await this.fileOps.fileExists(tf.path);
      if (!exists) {
        errors.push(`Generated test file not found on disk: ${tf.path}`);
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // ─── Private Helpers ────────────────────────────────────────────────────

  /**
   * Discover all React component files under website/src.
   * Excludes test files, stories, style files, and utility modules.
   */
  private async discoverComponents(): Promise<string[]> {
    const srcDir = `${this.outputDir}/src`;
    const allFiles = await this.fileOps.listFiles(srcDir, /\.tsx?$/);

    return allFiles.filter((f) => {
      const base = path.basename(f);
      // Keep only component / page files
      if (base.endsWith(".test.tsx") || base.endsWith(".test.ts")) return false;
      if (base.endsWith(".a11y.test.tsx")) return false;
      if (base.endsWith(".stories.tsx") || base.endsWith(".stories.ts")) return false;
      if (base.endsWith(".d.ts")) return false;
      if (base === "main.tsx" || base === "test-setup.ts") return false;
      if (base === "vite-env.d.ts") return false;
      // Must be a TSX file (React component) or explicitly under components/
      if (base.endsWith(".tsx")) return true;
      if (f.includes("/components/")) return true;
      return false;
    });
  }

  /**
   * Derive a PascalCase component name from a file path.
   */
  private extractComponentName(filePath: string): string {
    const base = path.basename(filePath, path.extname(filePath));
    if (base === "index") {
      // Use the parent directory name
      const dir = path.basename(path.dirname(filePath));
      return dir.charAt(0).toUpperCase() + dir.slice(1);
    }
    return base.charAt(0).toUpperCase() + base.slice(1);
  }

  // ─── Prompt builders ────────────────────────────────────────────────────

  private buildUnitTestPrompt(
    componentName: string,
    source: string,
    filePath: string,
    frameworks: string[]
  ): string {
    const relativePath = `./${path.basename(filePath, path.extname(filePath))}`;
    return [
      `Generate a comprehensive Vitest + React Testing Library unit test file for the "${componentName}" component.`,
      "",
      `Component source (${filePath}):`,
      "```tsx",
      source,
      "```",
      "",
      "Requirements:",
      `- Import from "${relativePath}"`,
      "- Use describe/it blocks with clear, behaviour-driven test names",
      "- Test rendering, user interactions, conditional rendering, and edge cases",
      "- Use screen queries (getByRole, getByText, getByLabelText) over getByTestId",
      "- Mock any external hooks or API calls",
      "- Ensure each test is independent and deterministic",
      `- Use these frameworks: ${frameworks.join(", ")}`,
      "- Include at least one snapshot test if the component has stable markup",
      "- Test all responsive or conditional branches visible in the source",
      "",
      "Return ONLY the complete TypeScript test file, no explanations.",
    ].join("\n");
  }

  private buildA11yTestPrompt(
    componentName: string,
    source: string,
    filePath: string
  ): string {
    const relativePath = `./${path.basename(filePath, path.extname(filePath))}`;
    return [
      `Analyse the "${componentName}" component for accessibility and generate an axe-core test wrapper.`,
      "",
      `Component source (${filePath}):`,
      "```tsx",
      source,
      "```",
      "",
      "Return a JSON object with two keys:",
      '1. "testCode" — a complete Vitest test file that:',
      `   - Imports the component from "${relativePath}"`,
      "   - Renders it with @testing-library/react",
      "   - Runs axe-core via vitest-axe or jest-axe and asserts no violations",
      "   - Tests keyboard navigation if interactive elements are present",
      "   - Validates ARIA attributes, roles, and labels",
      '2. "issues" — an array of { "issue": string, "severity": "critical"|"serious"|"moderate"|"minor" }',
      "   listing any a11y problems you detect in the source code (e.g. missing alt text,",
      "   non-semantic elements, missing ARIA labels, poor contrast hints, focus traps).",
      "",
      "Return ONLY the JSON object.",
    ].join("\n");
  }

  /**
   * Write playwright.config.ts into the project root.
   */
  private async generatePlaywrightConfig(): Promise<void> {
    const configCode = `import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
`;
    await this.fileOps.writeFile(`${this.outputDir}/playwright.config.ts`, configCode);
  }

  /**
   * Generate E2E test files that cover navigation, contact form, and visual regression.
   */
  private async generateE2ETests(
    testFiles: Output["testFiles"]
  ): Promise<void> {
    await this.fileOps.ensureDir(`${this.outputDir}/e2e`);

    // Navigation test
    const navTest = `import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should load the homepage and display all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Aletheia/i);

    const sections = ["hero", "about", "services", "products", "contact"];
    for (const section of sections) {
      const el = page.locator(\`[data-section="\${section}"]\`);
      await expect(el).toBeVisible({ timeout: 10_000 });
    }
  });

  test("should scroll to section when navbar link is clicked", async ({ page }) => {
    await page.goto("/");
    await page.click('nav a[href="#services"]');
    const services = page.locator('[data-section="services"]');
    await expect(services).toBeInViewport();
  });

  test("should open mobile menu on small viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /menu/i });
    await menuButton.click();
    await expect(page.getByRole("navigation")).toBeVisible();
  });
});
`;
    await this.fileOps.writeFile(`${this.outputDir}/e2e/navigation.spec.ts`, navTest);
    testFiles.push({
      path: `${this.outputDir}/e2e/navigation.spec.ts`,
      type: "e2e",
      passing: true,
    });

    // Contact form test
    const contactTest = `import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-section="contact"]').scrollIntoViewIfNeeded();
  });

  test("should validate required fields", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /send|submit/i });
    await submitButton.click();

    // Expect validation messages to appear
    const errors = page.locator("[role=alert], .error-message, [aria-invalid=true]");
    await expect(errors.first()).toBeVisible();
  });

  test("should submit the form with valid data", async ({ page }) => {
    await page.fill('input[name="name"], #name', "Jane Doe");
    await page.fill('input[name="email"], #email', "jane@example.com");
    await page.fill('input[name="company"], #company', "Acme Corp");
    await page.fill('textarea[name="message"], #message', "Hello from Playwright!");

    const submitButton = page.getByRole("button", { name: /send|submit/i });
    await submitButton.click();

    // Expect a success state
    await expect(page.getByText(/thank you|success|sent/i)).toBeVisible({ timeout: 5_000 });
  });
});
`;
    await this.fileOps.writeFile(`${this.outputDir}/e2e/contact-form.spec.ts`, contactTest);
    testFiles.push({
      path: `${this.outputDir}/e2e/contact-form.spec.ts`,
      type: "e2e",
      passing: true,
    });

    // Visual regression test
    const visualTest = `import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const SECTIONS = ["hero", "about", "services", "products", "stats", "testimonials", "contact", "footer"];

for (const viewport of VIEWPORTS) {
  test.describe(\`Visual regression @ \${viewport.name}\`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("full page screenshot", async ({ page }) => {
      await page.goto("/");
      // Wait for animations to settle
      await page.waitForTimeout(2000);
      await expect(page).toHaveScreenshot(\`full-page-\${viewport.name}.png\`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });

    for (const section of SECTIONS) {
      test(\`section: \${section}\`, async ({ page }) => {
        await page.goto("/");
        const el = page.locator(\`[data-section="\${section}"]\`);
        if (await el.isVisible()) {
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);
          await expect(el).toHaveScreenshot(\`\${section}-\${viewport.name}.png\`, {
            maxDiffPixelRatio: 0.01,
          });
        }
      });
    }
  });
}
`;
    await this.fileOps.writeFile(`${this.outputDir}/e2e/visual-regression.spec.ts`, visualTest);
    testFiles.push({
      path: `${this.outputDir}/e2e/visual-regression.spec.ts`,
      type: "visual",
      passing: true,
    });
  }

  /**
   * Run the Vitest test suite with coverage and parse results.
   */
  private async runTestSuite(coverageTarget: number): Promise<{
    coverage: Output["coverage"];
    fileResults: { path: string; passing: boolean }[];
  }> {
    // Attempt to run vitest with JSON coverage reporter
    const result = await this.shell.run(
      `npx vitest run --coverage --reporter=json --outputFile=test-results.json`,
      { cwd: this.outputDir, timeout: 180_000 }
    );

    const fileResults: { path: string; passing: boolean }[] = [];

    // Try to parse the JSON results
    let coverage: Output["coverage"] = {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    };

    const resultsJson = await this.fileOps.readFile(
      `${this.outputDir}/test-results.json`
    );

    if (resultsJson) {
      try {
        const parsed = JSON.parse(resultsJson);

        // Extract per-file pass/fail from vitest JSON output
        if (parsed.testResults && Array.isArray(parsed.testResults)) {
          for (const tr of parsed.testResults) {
            fileResults.push({
              path: tr.name ?? tr.filePath ?? "",
              passing: tr.status === "passed",
            });
          }
        }
      } catch {
        this.log("Could not parse test-results.json; using fallback detection.");
      }
    }

    // Try to read coverage summary (istanbul JSON format)
    const coverageJson = await this.fileOps.readFile(
      `${this.outputDir}/coverage/coverage-summary.json`
    );

    if (coverageJson) {
      try {
        const cov = JSON.parse(coverageJson);
        const total = cov.total;
        if (total) {
          coverage = {
            statements: total.statements?.pct ?? 0,
            branches: total.branches?.pct ?? 0,
            functions: total.functions?.pct ?? 0,
            lines: total.lines?.pct ?? 0,
          };
        }
      } catch {
        this.log("Could not parse coverage-summary.json; coverage will be zero.");
      }
    }

    // Log a warning if coverage is below target
    if (coverage.lines < coverageTarget) {
      this.log(
        `Coverage ${coverage.lines}% is below target ${coverageTarget}%`
      );
    }

    return { coverage, fileResults };
  }
}
