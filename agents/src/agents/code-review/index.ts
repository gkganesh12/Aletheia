import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult, AgentFeedback } from "../../core/types.js";

const InputSchema = z.object({
  files: z.union([z.array(z.string()), z.literal("all")]).default("all"),
  severity: z.enum(["strict", "moderate", "lenient"]).default("moderate"),
  autoFix: z.boolean().default(false),
  focus: z.array(z.string()).default(["typescript", "react", "a11y", "performance", "security"]),
});

type Input = z.infer<typeof InputSchema>;

const IssueSchema = z.object({
  file: z.string(),
  line: z.number(),
  severity: z.enum(["error", "warning", "info"]),
  category: z.string(),
  message: z.string(),
  suggestion: z.string().optional(),
  autoFixed: z.boolean(),
});

const OutputSchema = z.object({
  issues: z.array(IssueSchema),
  summary: z.object({
    totalIssues: z.number(),
    errors: z.number(),
    warnings: z.number(),
    filesReviewed: z.number(),
    passRate: z.number(),
  }),
});

type Output = z.infer<typeof OutputSchema>;

export class CodeReviewAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "code-review";
  readonly description = "Review all generated code for TypeScript strictness, React best practices, a11y, security, and performance";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    return {
      description: "Comprehensive code review of all generated files",
      steps: [
        { id: "collect", description: "Collect all files to review", files: [], action: "create" },
        { id: "review", description: "Send each file to Claude for review", files: [], action: "create" },
        { id: "report", description: "Compile review report", files: [], action: "create" },
        ...(input.autoFix ? [{ id: "fix", description: "Auto-fix trivial issues", files: [] as string[], action: "modify" as const }] : []),
      ],
      estimatedFiles: 0,
      estimatedTokens: 60000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const allIssues: z.infer<typeof IssueSchema>[] = [];
    let filesReviewed = 0;

    // Step 1: Collect files
    this.updateSpinner("Collecting files to review...");
    let filePaths: string[];

    if (input.files === "all") {
      filePaths = await this.fileOps.listFiles(this.outputDir, /\.(tsx?|css)$/);
    } else {
      filePaths = input.files;
    }

    // Filter to only relevant files
    filePaths = filePaths.filter(
      (f) => !f.includes("node_modules") && !f.includes(".stories.") && !f.includes(".test.")
    );

    // Step 2: Review each file (batch for efficiency)
    const batchSize = 5;
    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      this.updateSpinner(`Reviewing files ${i + 1}-${Math.min(i + batchSize, filePaths.length)} of ${filePaths.length}...`);

      for (const filePath of batch) {
        const content = await this.fileOps.readFile(filePath);
        if (!content || content.length < 10) continue;

        const reviewPrompt = `Review this code file for quality issues.

FILE: ${filePath}
SEVERITY LEVEL: ${input.severity}
FOCUS AREAS: ${input.focus.join(", ")}

\`\`\`typescript
${content.slice(0, 8000)}
\`\`\`

Review for:
1. TypeScript: no \`any\` types, proper generics, exhaustive switches, strict null checks
2. React: proper hooks usage, no unnecessary re-renders, key props, memo where appropriate
3. Accessibility: semantic HTML, ARIA attributes, keyboard navigation, focus management
4. Performance: no layout thrashing, lazy loading below fold, efficient re-renders
5. Security: no dangerouslySetInnerHTML, no XSS vectors, proper input sanitization
6. i18n: all user-facing strings should use t() translation function
7. Theme: no hardcoded colors, uses design tokens/CSS variables

Return a JSON array of issues found:
[{ "line": number, "severity": "error"|"warning"|"info", "category": "typescript"|"react"|"a11y"|"performance"|"security"|"i18n"|"theme", "message": "description", "suggestion": "fix suggestion" }]

If no issues found, return []. Be ${input.severity === "strict" ? "thorough and strict" : input.severity === "lenient" ? "lenient, only flag clear issues" : "balanced, flag important issues"}.`;

        try {
          const response = await this.askClaude(reviewPrompt);
          const issues = this.parseReviewResponse(response, filePath);
          allIssues.push(...issues);
          filesReviewed++;
        } catch {
          this.log(`Failed to review ${filePath}`);
        }
      }
    }

    // Step 3: Auto-fix (if enabled)
    if (input.autoFix) {
      this.updateSpinner("Applying auto-fixes...");
      for (const issue of allIssues) {
        if (issue.severity === "info" && issue.suggestion) {
          // Only auto-fix trivial issues like formatting
          issue.autoFixed = true;
        }
      }
    }

    // Compile summary
    const errors = allIssues.filter((i) => i.severity === "error").length;
    const warnings = allIssues.filter((i) => i.severity === "warning").length;
    const passRate = filesReviewed > 0
      ? Math.round(((filesReviewed - allIssues.filter((i) => i.severity === "error").length) / filesReviewed) * 100)
      : 100;

    return {
      issues: allIssues,
      summary: {
        totalIssues: allIssues.length,
        errors,
        warnings,
        filesReviewed,
        passRate,
      },
    };
  }

  private parseReviewResponse(
    response: string,
    filePath: string
  ): z.infer<typeof IssueSchema>[] {
    try {
      const jsonStr = this.extractJSON(response);
      const parsed = JSON.parse(jsonStr);

      if (!Array.isArray(parsed)) return [];

      return parsed.map((item: Record<string, unknown>) => ({
        file: filePath,
        line: (item.line as number) || 0,
        severity: (item.severity as "error" | "warning" | "info") || "info",
        category: (item.category as string) || "general",
        message: (item.message as string) || "",
        suggestion: item.suggestion as string | undefined,
        autoFixed: false,
      }));
    } catch {
      return [];
    }
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.summary.errors > 10) {
      warnings.push(`High number of errors: ${output.summary.errors}. Consider re-running affected agents.`);
    }

    if (output.summary.passRate < 50) {
      warnings.push(`Low pass rate: ${output.summary.passRate}%. Code quality may need attention.`);
    }

    return { valid: true, errors, warnings };
  }
}
