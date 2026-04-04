import { ZodSchema } from "zod";
import chalk from "chalk";
import inquirer from "inquirer";
import ora, { type Ora } from "ora";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { ClaudeClient, ClaudeResponse } from "./claude-client.js";
import { FileOps } from "./file-ops.js";
import { Shell } from "./shell.js";
import { TemplateEngine } from "./template.js";
import { Validator } from "./validator.js";
import type {
  AgentName,
  AgentPlan,
  AgentResult,
  AgentFeedback,
  ValidationResult,
  ApprovalAction,
  ApprovalRequest,
  ApprovalResponse,
  FilePreview,
  AgentConfig,
} from "./types.js";

export interface AgentContext {
  claude: ClaudeClient;
  fileOps: FileOps;
  shell: Shell;
  rootDir: string;
  outputDir: string;
  config: AgentConfig;
  interactive: boolean;
  verbose: boolean;
}

export abstract class BaseAgent<TInput = unknown, TOutput = unknown> {
  abstract readonly name: AgentName;
  abstract readonly description: string;
  abstract readonly inputSchema: ZodSchema<TInput>;
  abstract readonly outputSchema: ZodSchema<TOutput>;

  protected claude: ClaudeClient;
  protected fileOps: FileOps;
  protected shell: Shell;
  protected template: TemplateEngine;
  protected config: AgentConfig;
  protected rootDir: string;
  protected outputDir: string;
  protected interactive: boolean;
  protected verbose: boolean;
  protected spinner: Ora | null = null;
  protected systemPrompt: string = "";

  constructor(context: AgentContext) {
    this.claude = context.claude;
    this.fileOps = context.fileOps;
    this.shell = context.shell;
    this.config = context.config;
    this.rootDir = context.rootDir;
    this.outputDir = context.outputDir;
    this.interactive = context.interactive;
    this.verbose = context.verbose;

    const templateDir = path.resolve(
      context.rootDir,
      "agents/src/agents",
      this.name,
      "templates"
    );
    this.template = new TemplateEngine(templateDir);
  }

  // ─── Abstract methods (implement in each agent) ─────────────────────────

  abstract plan(input: TInput): Promise<AgentPlan>;

  abstract execute(input: TInput, plan: AgentPlan): Promise<TOutput>;

  abstract validate(output: TOutput): Promise<ValidationResult>;

  // ─── Main run lifecycle ─────────────────────────────────────────────────

  async run(input: TInput): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    this.fileOps.clearChangeLog();

    this.log(`Starting agent: ${chalk.bold(this.name)}`);

    // 1. Validate input
    const inputValidation = Validator.validate(this.inputSchema, input);
    if (!inputValidation.success) {
      return this.failure(
        `Input validation failed: ${inputValidation.errors.join(", ")}`,
        startTime
      );
    }
    const validInput = inputValidation.data!;

    // 2. Load system prompt
    await this.loadSystemPrompt();

    // 3. Plan
    this.startSpinner("Planning...");
    let plan: AgentPlan;
    try {
      plan = await this.plan(validInput);
      this.stopSpinner();
    } catch (error) {
      this.stopSpinner();
      return this.failure(`Planning failed: ${(error as Error).message}`, startTime);
    }

    this.log(
      `Plan: ${plan.steps.length} steps, ~${plan.estimatedFiles} files`
    );

    // 4. Interactive approval of plan
    if (this.interactive && this.config.approvalRequired) {
      const approved = await this.requestPlanApproval(plan);
      if (!approved) {
        this.log(chalk.yellow("Agent skipped by user"));
        return this.skipped(startTime);
      }
    }

    // 5. Execute
    this.startSpinner("Executing...");
    let output: TOutput;
    try {
      output = await this.execute(validInput, plan);
      this.stopSpinner();
    } catch (error) {
      this.stopSpinner();
      return this.failure(
        `Execution failed: ${(error as Error).message}`,
        startTime
      );
    }

    // 6. Validate output
    const outputValidation = await this.validate(output);
    if (!outputValidation.valid) {
      this.log(
        chalk.yellow(
          `Output warnings: ${outputValidation.warnings.join(", ")}`
        )
      );
      if (outputValidation.errors.length > 0) {
        return this.failure(
          `Output validation failed: ${outputValidation.errors.join(", ")}`,
          startTime
        );
      }
    }

    // 7. Interactive approval of results
    if (this.interactive && this.config.approvalRequired) {
      const approval = await this.requestResultApproval();
      if (approval.action === "reject") {
        await this.fileOps.rollback();
        return this.failure("Rejected by user", startTime);
      }
      if (approval.action === "skip") {
        await this.fileOps.rollback();
        return this.skipped(startTime);
      }
    }

    // 8. Log token usage
    const tokens = this.claude.getTotalTokens();
    this.claude.logUsage(
      this.name,
      this.config.model,
      tokens.input,
      tokens.output
    );

    const changeLog = this.fileOps.getChangeLog();
    const stats = this.fileOps.getStats();
    this.log(
      chalk.green(
        `Completed: ${stats.created} created, ${stats.modified} modified, ${stats.deleted} deleted`
      )
    );

    return {
      success: true,
      output,
      filesCreated: changeLog
        .filter((c) => c.action === "create")
        .map((c) => c.path),
      filesModified: changeLog
        .filter((c) => c.action === "modify")
        .map((c) => c.path),
      tokensUsed: tokens.input + tokens.output,
      durationMs: Date.now() - startTime,
      errors: [],
      feedback: [],
    };
  }

  // ─── Claude interaction helpers ─────────────────────────────────────────

  protected async askClaude(
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const response = await this.claude.sendMessage({
      prompt,
      systemPrompt: options.systemPrompt || this.systemPrompt,
      model: this.config.model,
      temperature: options.temperature ?? this.config.temperature,
      maxTokens: options.maxTokens ?? this.config.maxTokens,
    });
    return response.content;
  }

  protected async askClaudeForCode(
    prompt: string,
    language: string = "typescript"
  ): Promise<string> {
    const response = await this.askClaude(
      `${prompt}\n\nRespond with ONLY the ${language} code, no markdown fences or explanations.`
    );
    return this.extractCode(response, language);
  }

  protected async askClaudeForJSON<T>(
    prompt: string,
    schema?: ZodSchema<T>
  ): Promise<T> {
    const response = await this.askClaude(
      `${prompt}\n\nRespond with ONLY valid JSON, no markdown fences or explanations.`
    );

    const jsonStr = this.extractJSON(response);
    const parsed = JSON.parse(jsonStr);

    if (schema) {
      return schema.parse(parsed);
    }
    return parsed as T;
  }

  // ─── Interactive approval ───────────────────────────────────────────────

  private async requestPlanApproval(plan: AgentPlan): Promise<boolean> {
    console.log("\n" + chalk.cyan("═".repeat(60)));
    console.log(chalk.cyan.bold(`  Agent: ${this.name}`));
    console.log(chalk.cyan("═".repeat(60)));
    console.log(chalk.white(`  ${plan.description}`));
    console.log(chalk.dim(`  Steps: ${plan.steps.length}`));
    console.log(chalk.dim(`  Est. files: ${plan.estimatedFiles}`));
    console.log(chalk.dim(`  Est. tokens: ~${plan.estimatedTokens.toLocaleString()}`));
    console.log();

    for (const step of plan.steps) {
      const icon =
        step.action === "create"
          ? chalk.green("+")
          : step.action === "modify"
          ? chalk.yellow("~")
          : chalk.red("-");
      console.log(`  ${icon} ${step.description}`);
      for (const file of step.files) {
        console.log(chalk.dim(`    ${file}`));
      }
    }

    console.log(chalk.cyan("─".repeat(60)));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Proceed?",
        choices: [
          { name: chalk.green("[A]pprove — Execute this plan"), value: "approve" },
          { name: chalk.yellow("[S]kip — Skip this agent"), value: "skip" },
        ],
      },
    ]);

    return action === "approve";
  }

  private async requestResultApproval(): Promise<ApprovalResponse> {
    const changeLog = this.fileOps.getChangeLog();
    if (changeLog.length === 0) {
      return { action: "approve" };
    }

    const stats = this.fileOps.getStats();
    console.log("\n" + chalk.cyan("─".repeat(60)));
    console.log(
      chalk.white(
        `  Results: ${chalk.green(`+${stats.created}`)} created, ${chalk.yellow(
          `~${stats.modified}`
        )} modified, ${chalk.red(`-${stats.deleted}`)} deleted`
      )
    );

    for (const change of changeLog) {
      const icon =
        change.action === "create"
          ? chalk.green("+ ")
          : change.action === "modify"
          ? chalk.yellow("~ ")
          : chalk.red("- ");
      console.log(`  ${icon}${change.path}`);
    }

    console.log(chalk.cyan("─".repeat(60)));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Accept changes?",
        choices: [
          { name: chalk.green("[A]pprove — Keep changes"), value: "approve" },
          { name: chalk.yellow("[S]kip — Rollback changes"), value: "skip" },
          { name: chalk.red("[R]eject — Rollback and fail"), value: "reject" },
        ],
      },
    ]);

    return { action };
  }

  // ─── System prompt loading ──────────────────────────────────────────────

  private async loadSystemPrompt(): Promise<void> {
    const promptVersion = this.config.promptVersion || "current";
    const promptDir = path.resolve(
      this.rootDir,
      "agents/src/prompts",
      this.name
    );

    // Try versioned directory structure first
    let promptPath = path.resolve(promptDir, `${promptVersion}.md`);
    try {
      this.systemPrompt = await fs.readFile(promptPath, "utf-8");
      return;
    } catch {
      // Fall back to flat file
    }

    // Try flat file: prompts/<name>.md
    promptPath = path.resolve(
      this.rootDir,
      "agents/src/prompts",
      `${this.name}.md`
    );
    try {
      this.systemPrompt = await fs.readFile(promptPath, "utf-8");
    } catch {
      this.systemPrompt = this.getDefaultSystemPrompt();
    }
  }

  protected getDefaultSystemPrompt(): string {
    return `You are the ${this.name} agent for the Aletheia AI website builder. ${this.description}. Generate clean, production-quality TypeScript/React code.`;
  }

  // ─── Utility methods ────────────────────────────────────────────────────

  protected extractCode(response: string, language: string = "typescript"): string {
    // Try to extract from markdown code blocks
    const patterns = [
      new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\`\`\``, "i"),
      new RegExp(`\`\`\`tsx\\n([\\s\\S]*?)\`\`\``, "i"),
      new RegExp(`\`\`\`ts\\n([\\s\\S]*?)\`\`\``, "i"),
      /```\n([\s\S]*?)```/,
    ];

    for (const pattern of patterns) {
      const match = response.match(pattern);
      if (match) return match[1].trim();
    }

    // No code blocks found, return the raw response
    return response.trim();
  }

  protected extractJSON(response: string): string {
    // Try to extract from markdown code blocks
    const jsonBlock = response.match(/```(?:json)?\n([\s\S]*?)```/);
    if (jsonBlock) return jsonBlock[1].trim();

    // Try to find raw JSON
    const jsonMatch = response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) return jsonMatch[1].trim();

    return response.trim();
  }

  protected log(message: string): void {
    if (this.verbose || !this.spinner) {
      console.log(chalk.dim(`[${this.name}]`) + " " + message);
    }
  }

  protected startSpinner(text: string): void {
    if (!this.interactive) return;
    this.spinner = ora({
      text: chalk.dim(`[${this.name}]`) + " " + text,
      color: "cyan",
    }).start();
  }

  protected stopSpinner(success: boolean = true): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed();
      } else {
        this.spinner.fail();
      }
      this.spinner = null;
    }
  }

  protected updateSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = chalk.dim(`[${this.name}]`) + " " + text;
    }
  }

  private failure(error: string, startTime: number): AgentResult<TOutput> {
    this.log(chalk.red(`Failed: ${error}`));
    return {
      success: false,
      output: undefined as unknown as TOutput,
      filesCreated: [],
      filesModified: [],
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
      errors: [error],
    };
  }

  private skipped(startTime: number): AgentResult<TOutput> {
    return {
      success: true,
      output: undefined as unknown as TOutput,
      filesCreated: [],
      filesModified: [],
      tokensUsed: 0,
      durationMs: Date.now() - startTime,
      errors: [],
    };
  }
}
