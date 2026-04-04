import chalk from "chalk";
import type { AgentName } from "../core/types.js";

export type LogLevel = "debug" | "info" | "warn" | "error" | "success";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  agent?: AgentName;
  message: string;
  data?: unknown;
}

export class Logger {
  private entries: LogEntry[] = [];
  private verbose: boolean;
  private silent: boolean;

  constructor(options: { verbose?: boolean; silent?: boolean } = {}) {
    this.verbose = options.verbose ?? false;
    this.silent = options.silent ?? false;
  }

  debug(message: string, agent?: AgentName, data?: unknown): void {
    this.log("debug", message, agent, data);
  }

  info(message: string, agent?: AgentName, data?: unknown): void {
    this.log("info", message, agent, data);
  }

  warn(message: string, agent?: AgentName, data?: unknown): void {
    this.log("warn", message, agent, data);
  }

  error(message: string, agent?: AgentName, data?: unknown): void {
    this.log("error", message, agent, data);
  }

  success(message: string, agent?: AgentName, data?: unknown): void {
    this.log("success", message, agent, data);
  }

  private log(
    level: LogLevel,
    message: string,
    agent?: AgentName,
    data?: unknown
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent,
      message,
      data,
    };
    this.entries.push(entry);

    if (this.silent) return;
    if (level === "debug" && !this.verbose) return;

    const prefix = agent ? chalk.dim(`[${agent}]`) : chalk.dim("[system]");
    const time = chalk.dim(new Date().toLocaleTimeString());

    let formatted: string;
    switch (level) {
      case "debug":
        formatted = chalk.gray(message);
        break;
      case "info":
        formatted = chalk.white(message);
        break;
      case "warn":
        formatted = chalk.yellow(message);
        break;
      case "error":
        formatted = chalk.red(message);
        break;
      case "success":
        formatted = chalk.green(message);
        break;
    }

    console.log(`${time} ${prefix} ${formatted}`);

    if (data && this.verbose) {
      console.log(chalk.dim(JSON.stringify(data, null, 2)));
    }
  }

  // ─── Pipeline progress display ────────────────────────────────────────

  stageStart(stageName: string): void {
    console.log();
    console.log(chalk.cyan.bold(`${"━".repeat(60)}`));
    console.log(chalk.cyan.bold(`  Stage: ${stageName}`));
    console.log(chalk.cyan.bold(`${"━".repeat(60)}`));
  }

  stageComplete(stageName: string, durationMs: number): void {
    const seconds = (durationMs / 1000).toFixed(1);
    console.log(
      chalk.green(`  Stage ${stageName} completed in ${seconds}s`)
    );
  }

  pipelineStart(): void {
    console.log();
    console.log(chalk.magenta.bold("╔" + "═".repeat(58) + "╗"));
    console.log(
      chalk.magenta.bold(
        "║" + "  Aletheia AI — Agent Pipeline".padEnd(58) + "║"
      )
    );
    console.log(chalk.magenta.bold("╚" + "═".repeat(58) + "╝"));
    console.log();
  }

  pipelineComplete(totalDurationMs: number, totalCost: number): void {
    const seconds = (totalDurationMs / 1000).toFixed(1);
    console.log();
    console.log(chalk.magenta.bold("╔" + "═".repeat(58) + "╗"));
    console.log(
      chalk.magenta.bold(
        "║" + "  Pipeline Complete!".padEnd(58) + "║"
      )
    );
    console.log(
      chalk.magenta.bold(
        "║" +
          `  Duration: ${seconds}s | Cost: $${totalCost.toFixed(4)}`.padEnd(58) +
          "║"
      )
    );
    console.log(chalk.magenta.bold("╚" + "═".repeat(58) + "╝"));
    console.log();
  }

  agentProgress(agent: AgentName, step: number, total: number): void {
    const progress = Math.round((step / total) * 100);
    const bar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5));
    process.stdout.write(
      `\r  ${chalk.dim(`[${agent}]`)} ${chalk.cyan(bar)} ${progress}%`
    );
    if (step === total) {
      process.stdout.write("\n");
    }
  }

  // ─── Summary tables ───────────────────────────────────────────────────

  printStatusTable(
    agents: Array<{
      name: string;
      status: string;
      files: number;
      tokens: number;
      cost: number;
      duration: number;
    }>
  ): void {
    console.log();
    console.log(
      chalk.bold(
        "  Agent".padEnd(20) +
          "Status".padEnd(12) +
          "Files".padEnd(8) +
          "Tokens".padEnd(10) +
          "Cost".padEnd(10) +
          "Time"
      )
    );
    console.log(chalk.dim("  " + "─".repeat(65)));

    for (const agent of agents) {
      const statusColor =
        agent.status === "completed"
          ? chalk.green
          : agent.status === "running"
          ? chalk.yellow
          : agent.status === "failed"
          ? chalk.red
          : chalk.dim;

      console.log(
        `  ${agent.name.padEnd(20)}${statusColor(agent.status.padEnd(12))}${String(agent.files).padEnd(8)}${String(agent.tokens).padEnd(10)}$${agent.cost.toFixed(4).padEnd(9)}${(agent.duration / 1000).toFixed(1)}s`
      );
    }
    console.log();
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }
}
