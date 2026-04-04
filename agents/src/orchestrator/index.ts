#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as path from "node:path";
import type { AgentName } from "../core/types.js";
import { ConfigLoader } from "./config.js";
import { StateStore } from "./state.js";
import { Logger } from "./logger.js";
import { Pipeline } from "./pipeline.js";

// Import and register all agents
import { registerAllAgents } from "../agents/registry.js";

const ROOT_DIR = path.resolve(process.cwd());

const program = new Command();

program
  .name("agents")
  .description("Aletheia AI — Dev Workflow Agent Pipeline")
  .version("1.0.0");

// ─── Run command ────────────────────────────────────────────────────────────

program
  .command("run")
  .description("Run the agent pipeline")
  .option("--auto", "Skip interactive confirmations", false)
  .option("-v, --verbose", "Enable verbose logging", false)
  .option("--stage <stage>", "Run a specific stage only")
  .option("--agent <agent>", "Run a specific agent only")
  .option("--from <stage>", "Resume from a specific stage")
  .option("--model <model>", "Override model for all agents")
  .option("--prompt-version <version>", "Override prompt version")
  .action(async (options) => {
    const config = new ConfigLoader(ROOT_DIR);
    await config.loadAll();

    const state = new StateStore(ROOT_DIR);
    await state.load();

    const logger = new Logger({
      verbose: options.verbose,
    });

    // Register agents
    registerAllAgents();

    const pipeline = new Pipeline(ROOT_DIR, config, state, logger, {
      auto: options.auto,
      verbose: options.verbose,
      specificStage: options.stage,
      specificAgent: options.agent as AgentName | undefined,
      fromStage: options.from,
    });

    try {
      await pipeline.run();
    } catch (error) {
      logger.error(`Pipeline failed: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// ─── Status command ─────────────────────────────────────────────────────────

program
  .command("status")
  .description("Show pipeline state and progress")
  .action(async () => {
    const state = new StateStore(ROOT_DIR);
    await state.load();

    const projectState = state.getState();
    const logger = new Logger();

    console.log(chalk.bold("\nPipeline Status"));
    console.log(chalk.dim("─".repeat(50)));
    console.log(`  Phase: ${chalk.cyan(projectState.phase)}`);
    console.log(
      `  Started: ${chalk.dim(projectState.metadata.startedAt)}`
    );
    console.log(
      `  Updated: ${chalk.dim(projectState.metadata.lastUpdatedAt)}`
    );

    const agents = Object.entries(projectState.agents).map(
      ([name, agentState]) => ({
        name,
        status: agentState.status,
        files:
          agentState.filesCreated.length + agentState.filesModified.length,
        tokens: agentState.tokensUsed,
        cost: 0,
        duration: agentState.durationMs,
      })
    );

    if (agents.length > 0) {
      logger.printStatusTable(agents);
    } else {
      console.log(chalk.dim("\n  No agents have run yet.\n"));
    }

    const totalCost = state.getTotalCost();
    if (totalCost > 0) {
      console.log(
        chalk.dim(`  Total API cost: $${totalCost.toFixed(4)}`)
      );
    }

    const errors = state.getErrors();
    if (errors.length > 0) {
      console.log(chalk.red(`\n  Errors: ${errors.length}`));
      for (const err of errors.slice(-5)) {
        console.log(chalk.red(`    [${err.agent}] ${err.error}`));
      }
    }
  });

// ─── Reset command ──────────────────────────────────────────────────────────

program
  .command("reset")
  .description("Reset pipeline state")
  .option("--agent <agent>", "Reset a specific agent only")
  .action(async (options) => {
    const state = new StateStore(ROOT_DIR);
    await state.load();

    if (options.agent) {
      state.resetAgent(options.agent as AgentName);
      console.log(chalk.yellow(`Reset agent: ${options.agent}`));
    } else {
      state.reset();
      console.log(chalk.yellow("Reset all pipeline state"));
    }

    await state.save();
  });

// ─── Cost command ───────────────────────────────────────────────────────────

program
  .command("cost")
  .description("Show API token usage and cost breakdown")
  .action(async () => {
    const state = new StateStore(ROOT_DIR);
    await state.load();

    const usage = state.getTokenUsage();

    if (usage.length === 0) {
      console.log(chalk.dim("\nNo token usage recorded yet.\n"));
      return;
    }

    console.log(chalk.bold("\nToken Usage & Cost Breakdown"));
    console.log(chalk.dim("─".repeat(65)));
    console.log(
      chalk.bold(
        "  Agent".padEnd(20) +
          "Model".padEnd(25) +
          "Input".padEnd(10) +
          "Output".padEnd(10) +
          "Cost"
      )
    );

    const byAgent = new Map<string, { input: number; output: number; cost: number }>();

    for (const record of usage) {
      const existing = byAgent.get(record.agent) || {
        input: 0,
        output: 0,
        cost: 0,
      };
      existing.input += record.inputTokens;
      existing.output += record.outputTokens;
      existing.cost += record.cost;
      byAgent.set(record.agent, existing);
    }

    let totalCost = 0;
    for (const [agent, totals] of byAgent) {
      totalCost += totals.cost;
      console.log(
        `  ${agent.padEnd(20)}${("").padEnd(25)}${String(totals.input).padEnd(10)}${String(totals.output).padEnd(10)}$${totals.cost.toFixed(4)}`
      );
    }

    console.log(chalk.dim("─".repeat(65)));
    console.log(chalk.bold(`  Total: $${totalCost.toFixed(4)}`));
    console.log();
  });

// ─── Review command ─────────────────────────────────────────────────────────

program
  .command("review")
  .description("Run the code-review agent on all generated files")
  .action(async () => {
    console.log(chalk.cyan("Running code review agent..."));
    // Delegate to run with --agent=code-review
    program.parse(["node", "agents", "run", "--agent", "code-review"]);
  });

// ─── Preview command ────────────────────────────────────────────────────────

program
  .command("preview")
  .description("Build and serve the website locally")
  .action(async () => {
    const { Shell } = await import("../core/shell.js");
    const shell = new Shell(path.resolve(ROOT_DIR, "website"));

    console.log(chalk.cyan("Building website..."));
    const build = await shell.run("npm run build");
    if (!build.success) {
      console.log(chalk.red(`Build failed: ${build.stderr}`));
      return;
    }

    console.log(chalk.cyan("Starting preview server..."));
    await shell.run("npm run preview");
  });

// ─── Parse and run ──────────────────────────────────────────────────────────

program.parse();
