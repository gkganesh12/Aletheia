import * as fs from "node:fs/promises";
import * as path from "node:path";
import yaml from "js-yaml";
import type {
  AgentConfig,
  AgentName,
  PipelineConfig,
  ProjectConfig,
} from "../core/types.js";

interface RawAgentYaml {
  agents: Record<
    string,
    {
      enabled?: boolean;
      model?: string;
      max_tokens?: number;
      temperature?: number;
      timeout?: number;
      retries?: number;
      approval_required?: boolean;
      prompt_version?: string;
      config?: Record<string, unknown>;
    }
  >;
}

interface RawPipelineYaml {
  pipeline: {
    name: string;
    version: string;
    stages: Array<{
      id: string;
      agents: string[];
      parallel: boolean;
      depends_on?: string[];
    }>;
  };
}

const DEFAULT_AGENT_CONFIG: AgentConfig = {
  enabled: true,
  model: "claude-sonnet-4-20250514",
  maxTokens: 8192,
  temperature: 0,
  timeout: 300,
  retries: 2,
  approvalRequired: true,
  config: {},
};

export class ConfigLoader {
  private rootDir: string;
  private agentConfigs: Map<string, AgentConfig> = new Map();
  private pipelineConfig: PipelineConfig | null = null;
  private projectConfig: ProjectConfig | null = null;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async loadAll(): Promise<void> {
    await Promise.all([
      this.loadAgentConfigs(),
      this.loadPipelineConfig(),
      this.loadProjectConfig(),
    ]);
  }

  // ─── Agent configs ────────────────────────────────────────────────────

  private async loadAgentConfigs(): Promise<void> {
    const configPath = path.resolve(
      this.rootDir,
      "agents/configs/agents.yaml"
    );

    try {
      const content = await fs.readFile(configPath, "utf-8");
      const raw = yaml.load(content) as RawAgentYaml;

      for (const [name, rawConfig] of Object.entries(raw.agents)) {
        const config: AgentConfig = {
          enabled: rawConfig.enabled ?? DEFAULT_AGENT_CONFIG.enabled,
          model: rawConfig.model ?? DEFAULT_AGENT_CONFIG.model,
          maxTokens: rawConfig.max_tokens ?? DEFAULT_AGENT_CONFIG.maxTokens,
          temperature: rawConfig.temperature ?? DEFAULT_AGENT_CONFIG.temperature,
          timeout: rawConfig.timeout ?? DEFAULT_AGENT_CONFIG.timeout,
          retries: rawConfig.retries ?? DEFAULT_AGENT_CONFIG.retries,
          approvalRequired:
            rawConfig.approval_required ??
            DEFAULT_AGENT_CONFIG.approvalRequired,
          promptVersion: rawConfig.prompt_version,
          config: rawConfig.config ?? {},
        };

        // Apply environment variable overrides
        const envModel = process.env[`AGENT_MODEL_${name.toUpperCase().replace(/-/g, "_")}`];
        if (envModel) {
          config.model = envModel;
        }

        this.agentConfigs.set(name, config);
      }
    } catch (error) {
      console.warn(`Could not load agent configs: ${(error as Error).message}`);
    }
  }

  getAgentConfig(agent: AgentName): AgentConfig {
    return this.agentConfigs.get(agent) || { ...DEFAULT_AGENT_CONFIG };
  }

  getAllAgentConfigs(): Map<string, AgentConfig> {
    return new Map(this.agentConfigs);
  }

  // ─── Pipeline config ──────────────────────────────────────────────────

  private async loadPipelineConfig(): Promise<void> {
    const configPath = path.resolve(
      this.rootDir,
      "agents/configs/pipeline.yaml"
    );

    try {
      const content = await fs.readFile(configPath, "utf-8");
      const raw = yaml.load(content) as RawPipelineYaml;

      this.pipelineConfig = {
        name: raw.pipeline.name,
        version: raw.pipeline.version,
        stages: raw.pipeline.stages.map((s) => ({
          id: s.id as PipelineConfig["stages"][0]["id"],
          agents: s.agents as AgentName[],
          parallel: s.parallel,
          dependsOn: s.depends_on || [],
        })),
      };
    } catch (error) {
      console.warn(
        `Could not load pipeline config: ${(error as Error).message}`
      );
    }
  }

  getPipelineConfig(): PipelineConfig | null {
    return this.pipelineConfig;
  }

  // ─── Project config ───────────────────────────────────────────────────

  private async loadProjectConfig(): Promise<void> {
    const configPath = path.resolve(
      this.rootDir,
      "agents/configs/project.yaml"
    );

    try {
      const content = await fs.readFile(configPath, "utf-8");
      this.projectConfig = yaml.load(content) as ProjectConfig;
    } catch (error) {
      console.warn(
        `Could not load project config: ${(error as Error).message}`
      );
    }
  }

  getProjectConfig(): ProjectConfig | null {
    return this.projectConfig;
  }

  // ─── Runtime overrides ────────────────────────────────────────────────

  overrideAgentModel(agent: AgentName, model: string): void {
    const config = this.getAgentConfig(agent);
    config.model = model;
    this.agentConfigs.set(agent, config);
  }

  overrideInteractive(agent: AgentName, interactive: boolean): void {
    const config = this.getAgentConfig(agent);
    config.approvalRequired = interactive;
    this.agentConfigs.set(agent, config);
  }
}
