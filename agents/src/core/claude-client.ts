import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  ContentBlock,
  Tool,
  ToolResultBlockParam,
} from "@anthropic-ai/sdk/resources/messages";
import { TokenUsageRecord } from "./types.js";

export interface ClaudeClientConfig {
  apiKey: string;
  defaultModel: string;
  maxRetries: number;
  retryDelayMs: number;
  maxTokensPerRequest: number;
}

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeToolDefinition {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface ClaudeResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  stopReason: string | null;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "claude-opus-4-20250514": { input: 15, output: 75 },
  "claude-sonnet-4-20250514": { input: 3, output: 15 },
  "claude-haiku-35-20241022": { input: 0.8, output: 4 },
};

export class ClaudeClient {
  private client: Anthropic;
  private config: ClaudeClientConfig;
  private usageLog: TokenUsageRecord[] = [];
  private totalInputTokens = 0;
  private totalOutputTokens = 0;

  constructor(config: Partial<ClaudeClientConfig> = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY || "",
      defaultModel: config.defaultModel || "claude-sonnet-4-20250514",
      maxRetries: config.maxRetries ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
      maxTokensPerRequest: config.maxTokensPerRequest ?? 8192,
    };

    this.client = new Anthropic({
      apiKey: this.config.apiKey,
    });
  }

  async sendMessage(options: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    history?: ClaudeMessage[];
  }): Promise<ClaudeResponse> {
    const model = options.model || this.config.defaultModel;
    const maxTokens = options.maxTokens || this.config.maxTokensPerRequest;

    const messages: MessageParam[] = [
      ...(options.history || []).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: options.prompt },
    ];

    return this.executeWithRetry(async () => {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        temperature: options.temperature ?? 0,
        system: options.systemPrompt || undefined,
        messages,
      });

      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");

      const usage = response.usage;
      this.totalInputTokens += usage.input_tokens;
      this.totalOutputTokens += usage.output_tokens;

      return {
        content: textContent,
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        model,
        stopReason: response.stop_reason,
      };
    });
  }

  async sendMessageWithTools(options: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    tools: ClaudeToolDefinition[];
    history?: MessageParam[];
    onToolCall?: (
      toolCall: ToolCall
    ) => Promise<string>;
  }): Promise<ClaudeResponse> {
    const model = options.model || this.config.defaultModel;
    const maxTokens = options.maxTokens || this.config.maxTokensPerRequest;

    const messages: MessageParam[] = [
      ...(options.history || []),
      { role: "user" as const, content: options.prompt },
    ];

    const tools: Tool[] = options.tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema as Tool["input_schema"],
    }));

    let allText = "";

    const iterate = async (
      currentMessages: MessageParam[]
    ): Promise<ClaudeResponse> => {
      const response = await this.executeWithRetry(async () => {
        return this.client.messages.create({
          model,
          max_tokens: maxTokens,
          temperature: options.temperature ?? 0,
          system: options.systemPrompt || undefined,
          messages: currentMessages,
          tools,
        });
      });

      const usage = response.usage;
      this.totalInputTokens += usage.input_tokens;
      this.totalOutputTokens += usage.output_tokens;

      const textBlocks = response.content.filter(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );
      allText += textBlocks.map((b) => b.text).join("");

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      if (toolUseBlocks.length > 0 && options.onToolCall) {
        const toolResults: ToolResultBlockParam[] = [];

        for (const toolUse of toolUseBlocks) {
          const result = await options.onToolCall({
            id: toolUse.id,
            name: toolUse.name,
            input: toolUse.input as Record<string, unknown>,
          });
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result,
          });
        }

        const updatedMessages: MessageParam[] = [
          ...currentMessages,
          { role: "assistant" as const, content: response.content },
          { role: "user" as const, content: toolResults },
        ];

        return iterate(updatedMessages);
      }

      return {
        content: allText,
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        model,
        stopReason: response.stop_reason,
        toolCalls: toolUseBlocks.map((b) => ({
          id: b.id,
          name: b.name,
          input: b.input as Record<string, unknown>,
        })),
      };
    };

    return iterate(messages);
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        const isRetryable =
          error instanceof Anthropic.RateLimitError ||
          error instanceof Anthropic.InternalServerError ||
          (error instanceof Anthropic.APIError && error.status === 529);

        if (!isRetryable || attempt === this.config.maxRetries) {
          throw error;
        }

        const delay = this.config.retryDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  calculateCost(
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const costs = MODEL_COSTS[model] || MODEL_COSTS["claude-sonnet-4-20250514"];
    return (
      (inputTokens / 1_000_000) * costs.input +
      (outputTokens / 1_000_000) * costs.output
    );
  }

  logUsage(agent: string, model: string, input: number, output: number): void {
    this.usageLog.push({
      timestamp: new Date().toISOString(),
      agent: agent as TokenUsageRecord["agent"],
      model,
      inputTokens: input,
      outputTokens: output,
      cost: this.calculateCost(model, input, output),
    });
  }

  getUsageLog(): TokenUsageRecord[] {
    return [...this.usageLog];
  }

  getTotalCost(): number {
    return this.usageLog.reduce((sum, entry) => sum + entry.cost, 0);
  }

  getTotalTokens(): { input: number; output: number } {
    return {
      input: this.totalInputTokens,
      output: this.totalOutputTokens,
    };
  }
}
