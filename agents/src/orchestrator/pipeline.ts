import chalk from "chalk";
import type {
  AgentName,
  PipelineConfig,
  PipelineStage,
  AgentFeedback,
} from "../core/types.js";
import { ClaudeClient } from "../core/claude-client.js";
import { FileOps } from "../core/file-ops.js";
import { Shell } from "../core/shell.js";
import { BaseAgent, AgentContext } from "../core/base-agent.js";
import { StateStore } from "./state.js";
import { Logger } from "./logger.js";
import { ConfigLoader } from "./config.js";

// Agent factory registry — populated at startup
type AgentFactory = (context: AgentContext) => BaseAgent;
const agentRegistry = new Map<AgentName, AgentFactory>();

export function registerAgent(name: AgentName, factory: AgentFactory): void {
  agentRegistry.set(name, factory);
}

export interface PipelineOptions {
  auto: boolean;
  verbose: boolean;
  fromStage?: string;
  specificStage?: string;
  specificAgent?: AgentName;
}

export class Pipeline {
  private config: ConfigLoader;
  private state: StateStore;
  private logger: Logger;
  private claude: ClaudeClient;
  private rootDir: string;
  private options: PipelineOptions;

  constructor(
    rootDir: string,
    config: ConfigLoader,
    state: StateStore,
    logger: Logger,
    options: PipelineOptions
  ) {
    this.rootDir = rootDir;
    this.config = config;
    this.state = state;
    this.logger = logger;
    this.options = options;

    this.claude = new ClaudeClient({
      defaultModel:
        config.getProjectConfig()?.claude.defaultModel ||
        "claude-sonnet-4-20250514",
    });
  }

  async run(): Promise<void> {
    const pipelineConfig = this.config.getPipelineConfig();
    if (!pipelineConfig) {
      throw new Error("Pipeline configuration not found");
    }

    this.logger.pipelineStart();
    const startTime = Date.now();

    // If running a specific agent
    if (this.options.specificAgent) {
      await this.runSingleAgent(this.options.specificAgent);
      return;
    }

    // Determine which stages to run
    let stages = pipelineConfig.stages;

    if (this.options.specificStage) {
      stages = stages.filter((s) => s.id === this.options.specificStage);
    } else if (this.options.fromStage) {
      const fromIndex = stages.findIndex(
        (s) => s.id === this.options.fromStage
      );
      if (fromIndex === -1) {
        throw new Error(`Stage "${this.options.fromStage}" not found`);
      }
      stages = stages.slice(fromIndex);
    }

    // Execute stages sequentially
    for (const stage of stages) {
      // Check if all dependencies are met
      if (stage.dependsOn.length > 0) {
        const allDependenciesMet = stage.dependsOn.every((depId) => {
          const depStage = pipelineConfig.stages.find((s) => s.id === depId);
          if (!depStage) return true;
          return depStage.agents.every((agent) =>
            this.state.isAgentCompleted(agent)
          );
        });

        if (!allDependenciesMet) {
          this.logger.warn(
            `Skipping stage "${stage.id}" — dependencies not met`
          );
          continue;
        }
      }

      await this.runStage(stage);
    }

    // Print final summary
    const totalDuration = Date.now() - startTime;
    this.logger.pipelineComplete(totalDuration, this.state.getTotalCost());
    this.printSummary();

    await this.state.save();
  }

  private async runStage(
    stage: PipelineConfig["stages"][0]
  ): Promise<void> {
    this.logger.stageStart(stage.id);
    this.state.setPhase(stage.id as PipelineStage);
    const stageStart = Date.now();

    const enabledAgents = stage.agents.filter((name) => {
      const agentConfig = this.config.getAgentConfig(name);
      return agentConfig.enabled;
    });

    // Skip already-completed agents (idempotency)
    const agentsToRun = enabledAgents.filter(
      (name) => !this.state.isAgentCompleted(name)
    );

    if (agentsToRun.length === 0) {
      this.logger.info(`All agents in stage "${stage.id}" already completed`);
      return;
    }

    if (stage.parallel) {
      // Run agents in parallel
      const results = await Promise.allSettled(
        agentsToRun.map((agent) => this.runSingleAgent(agent))
      );

      for (let i = 0; i < results.length; i++) {
        if (results[i].status === "rejected") {
          const error = (results[i] as PromiseRejectedResult).reason;
          this.logger.error(
            `Agent "${agentsToRun[i]}" failed: ${error.message}`,
            agentsToRun[i]
          );
        }
      }
    } else {
      // Run agents sequentially
      for (const agent of agentsToRun) {
        await this.runSingleAgent(agent);
      }
    }

    this.logger.stageComplete(stage.id, Date.now() - stageStart);
    await this.state.save();
  }

  private async runSingleAgent(agentName: AgentName): Promise<void> {
    const factory = agentRegistry.get(agentName);
    if (!factory) {
      this.logger.warn(`No implementation registered for agent "${agentName}"`);
      return;
    }

    const agentConfig = this.config.getAgentConfig(agentName);
    if (!agentConfig.enabled) {
      this.logger.info(`Agent "${agentName}" is disabled, skipping`);
      return;
    }

    // Skip if already completed
    if (this.state.isAgentCompleted(agentName)) {
      this.logger.info(`Agent "${agentName}" already completed, skipping`);
      return;
    }

    const projectConfig = this.config.getProjectConfig();
    const outputDir = projectConfig?.project.outputDir || "./website";

    const context: AgentContext = {
      claude: this.claude,
      fileOps: new FileOps(this.rootDir),
      shell: new Shell(this.rootDir),
      rootDir: this.rootDir,
      outputDir,
      config: agentConfig,
      interactive: !this.options.auto,
      verbose: this.options.verbose,
    };

    const agent = factory(context);

    this.state.setAgentStatus(agentName, "running");
    await this.state.save();

    try {
      // Get input from agent config
      const input = agentConfig.config;
      const result = await agent.run(input);

      if (result.success) {
        this.state.setAgentStatus(agentName, "completed");
        this.state.updateAgentState(agentName, {
          filesCreated: result.filesCreated,
          filesModified: result.filesModified,
          tokensUsed: result.tokensUsed,
          durationMs: result.durationMs,
        });

        // Register artifacts
        for (const file of [...result.filesCreated, ...result.filesModified]) {
          this.state.registerArtifact(file, agentName, "", 0);
        }

        // Handle feedback loops
        if (result.feedback && result.feedback.length > 0) {
          await this.handleFeedback(result.feedback);
        }

        this.logger.success(
          `Agent "${agentName}" completed (${result.filesCreated.length} created, ${result.filesModified.length} modified)`,
          agentName
        );
      } else {
        this.state.setAgentStatus(agentName, "failed");
        for (const error of result.errors) {
          this.state.logError(agentName, error);
        }
        this.logger.error(
          `Agent "${agentName}" failed: ${result.errors.join(", ")}`,
          agentName
        );
      }
    } catch (error) {
      this.state.setAgentStatus(agentName, "failed");
      this.state.logError(
        agentName,
        (error as Error).message,
        (error as Error).stack
      );
      this.logger.error(
        `Agent "${agentName}" threw: ${(error as Error).message}`,
        agentName
      );
    }

    await this.state.save();
  }

  private async handleFeedback(feedbacks: AgentFeedback[]): Promise<void> {
    for (const feedback of feedbacks) {
      if (feedback.severity === "blocking") {
        this.logger.warn(
          `Blocking feedback for "${feedback.targetAgent}": ${feedback.message}`
        );
        // Reset the target agent so it can be re-run
        this.state.resetAgent(feedback.targetAgent);
      } else {
        this.logger.info(
          `Advisory feedback for "${feedback.targetAgent}": ${feedback.message}`
        );
      }
    }
  }

  private printSummary(): void {
    const state = this.state.getState();
    const agents = Object.entries(state.agents).map(([name, agentState]) => ({
      name,
      status: agentState.status,
      files: agentState.filesCreated.length + agentState.filesModified.length,
      tokens: agentState.tokensUsed,
      cost: this.claude.calculateCost(
        this.config.getAgentConfig(name as AgentName).model,
        agentState.tokensUsed * 0.4, // rough split
        agentState.tokensUsed * 0.6
      ),
      duration: agentState.durationMs,
    }));

    this.logger.printStatusTable(agents);
  }
}
