import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
  ProjectState,
  AgentState,
  AgentName,
  AgentStatus,
  PipelineStage,
  ArtifactManifest,
  ErrorLogEntry,
  TokenUsageRecord,
} from "../core/types.js";

const DEFAULT_STATE: ProjectState = {
  phase: "init",
  agents: {},
  artifacts: {},
  errors: [],
  tokenUsage: [],
  metadata: {
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    prdVersion: "1.0",
    pipelineVersion: "1.0",
  },
};

const DEFAULT_AGENT_STATE: AgentState = {
  status: "pending",
  filesCreated: [],
  filesModified: [],
  tokensUsed: 0,
  durationMs: 0,
};

export class StateStore {
  private state: ProjectState;
  private statePath: string;
  private dirty = false;

  constructor(rootDir: string) {
    this.statePath = path.resolve(rootDir, "agents/.state/project-state.json");
    this.state = { ...DEFAULT_STATE };
  }

  async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.statePath, "utf-8");
      this.state = JSON.parse(content);
    } catch {
      this.state = {
        ...DEFAULT_STATE,
        metadata: {
          ...DEFAULT_STATE.metadata,
          startedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        },
      };
    }
  }

  async save(): Promise<void> {
    this.state.metadata.lastUpdatedAt = new Date().toISOString();
    const dir = path.dirname(this.statePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      this.statePath,
      JSON.stringify(this.state, null, 2),
      "utf-8"
    );
    this.dirty = false;
  }

  getState(): ProjectState {
    return this.state;
  }

  // ─── Phase management ───────────────────────────────────────────────────

  getPhase(): PipelineStage {
    return this.state.phase;
  }

  setPhase(phase: PipelineStage): void {
    this.state.phase = phase;
    this.dirty = true;
  }

  // ─── Agent state management ─────────────────────────────────────────────

  getAgentState(agent: AgentName): AgentState {
    return this.state.agents[agent] || { ...DEFAULT_AGENT_STATE };
  }

  setAgentStatus(agent: AgentName, status: AgentStatus): void {
    if (!this.state.agents[agent]) {
      this.state.agents[agent] = { ...DEFAULT_AGENT_STATE };
    }
    this.state.agents[agent].status = status;
    if (status === "running") {
      this.state.agents[agent].lastRunAt = new Date().toISOString();
    }
    this.dirty = true;
  }

  updateAgentState(agent: AgentName, update: Partial<AgentState>): void {
    if (!this.state.agents[agent]) {
      this.state.agents[agent] = { ...DEFAULT_AGENT_STATE };
    }
    Object.assign(this.state.agents[agent], update);
    this.dirty = true;
  }

  isAgentCompleted(agent: AgentName): boolean {
    return this.getAgentState(agent).status === "completed";
  }

  getCompletedAgents(): AgentName[] {
    return Object.entries(this.state.agents)
      .filter(([, state]) => state.status === "completed")
      .map(([name]) => name as AgentName);
  }

  getPendingAgents(): AgentName[] {
    return Object.entries(this.state.agents)
      .filter(([, state]) => state.status === "pending")
      .map(([name]) => name as AgentName);
  }

  // ─── Artifact tracking ─────────────────────────────────────────────────

  registerArtifact(
    filePath: string,
    agent: AgentName,
    hash: string,
    size: number
  ): void {
    this.state.artifacts[filePath] = {
      path: filePath,
      createdBy: agent,
      createdAt: new Date().toISOString(),
      hash,
      size,
    };
    this.dirty = true;
  }

  getArtifact(filePath: string): ArtifactManifest | undefined {
    return this.state.artifacts[filePath];
  }

  getArtifactsByAgent(agent: AgentName): ArtifactManifest[] {
    return Object.values(this.state.artifacts).filter(
      (a) => a.createdBy === agent
    );
  }

  // ─── Error logging ─────────────────────────────────────────────────────

  logError(agent: AgentName, error: string, stack?: string): void {
    this.state.errors.push({
      timestamp: new Date().toISOString(),
      agent,
      error,
      stack,
    });
    this.dirty = true;
  }

  getErrors(agent?: AgentName): ErrorLogEntry[] {
    if (agent) {
      return this.state.errors.filter((e) => e.agent === agent);
    }
    return this.state.errors;
  }

  // ─── Token usage tracking ──────────────────────────────────────────────

  logTokenUsage(record: TokenUsageRecord): void {
    this.state.tokenUsage.push(record);
    this.dirty = true;
  }

  getTokenUsage(agent?: AgentName): TokenUsageRecord[] {
    if (agent) {
      return this.state.tokenUsage.filter((r) => r.agent === agent);
    }
    return this.state.tokenUsage;
  }

  getTotalCost(): number {
    return this.state.tokenUsage.reduce((sum, r) => sum + r.cost, 0);
  }

  // ─── Reset ──────────────────────────────────────────────────────────────

  reset(): void {
    this.state = {
      ...DEFAULT_STATE,
      metadata: {
        ...DEFAULT_STATE.metadata,
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      },
    };
    this.dirty = true;
  }

  resetAgent(agent: AgentName): void {
    this.state.agents[agent] = { ...DEFAULT_AGENT_STATE };
    // Remove artifacts created by this agent
    for (const [path, artifact] of Object.entries(this.state.artifacts)) {
      if (artifact.createdBy === agent) {
        delete this.state.artifacts[path];
      }
    }
    this.dirty = true;
  }

  isDirty(): boolean {
    return this.dirty;
  }
}
