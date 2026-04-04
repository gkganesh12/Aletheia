import { z } from "zod";

// ─── Section IDs matching the PRD ───────────────────────────────────────────

export const SectionIds = [
  "preloader",
  "navbar",
  "hero",
  "marquee",
  "about",
  "services",
  "products",
  "stats",
  "case-studies",
  "testimonials",
  "tech-ribbon",
  "contact",
  "footer",
] as const;

export type SectionId = (typeof SectionIds)[number];

export const SectionIdSchema = z.enum(SectionIds);

// ─── Product definitions ────────────────────────────────────────────────────

export const ProductSchema = z.object({
  id: z.enum(["inscrape", "nirvana", "swarmscope"]),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  icon: z.string(),
  gradient: z.tuple([z.string(), z.string()]),
});

export type Product = z.infer<typeof ProductSchema>;

// ─── Service definition ─────────────────────────────────────────────────────

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;

// ─── Component specification ────────────────────────────────────────────────

export const PropDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean().default(true),
  defaultValue: z.string().optional(),
  description: z.string().optional(),
});

export type PropDefinition = z.infer<typeof PropDefinitionSchema>;

export const AnimationSpecSchema = z.object({
  type: z.enum([
    "entrance",
    "scroll-trigger",
    "hover",
    "parallax",
    "infinite",
    "stagger",
    "counter",
  ]),
  library: z.enum(["gsap", "framer-motion", "css"]),
  trigger: z.string().optional(),
  duration: z.number().optional(),
  delay: z.number().optional(),
  easing: z.string().optional(),
  properties: z.record(z.unknown()).optional(),
});

export type AnimationSpec = z.infer<typeof AnimationSpecSchema>;

export const BreakpointSchema = z.object({
  name: z.enum(["mobile", "tablet", "desktop", "xl"]),
  minWidth: z.number(),
  layout: z.string().optional(),
  columns: z.number().optional(),
  changes: z.array(z.string()).optional(),
});

export type BreakpointSpec = z.infer<typeof BreakpointSchema>;

export const A11ySpecSchema = z.object({
  role: z.string().optional(),
  ariaLabel: z.string().optional(),
  ariaDescribedBy: z.string().optional(),
  keyboardNav: z.boolean().default(false),
  focusTrap: z.boolean().default(false),
  announcements: z.array(z.string()).optional(),
});

export type A11ySpec = z.infer<typeof A11ySpecSchema>;

export const ComponentSpecSchema: z.ZodType<ComponentSpec> = z.lazy(() =>
  z.object({
    name: z.string(),
    sectionId: SectionIdSchema.optional(),
    description: z.string(),
    props: z.array(PropDefinitionSchema),
    children: z.array(ComponentSpecSchema),
    animations: z.array(AnimationSpecSchema),
    responsiveBreakpoints: z.array(BreakpointSchema),
    accessibility: A11ySpecSchema,
    testCases: z.array(z.string()),
  })
);

export interface ComponentSpec {
  name: string;
  sectionId?: SectionId;
  description: string;
  props: PropDefinition[];
  children: ComponentSpec[];
  animations: AnimationSpec[];
  responsiveBreakpoints: BreakpointSpec[];
  accessibility: A11ySpec;
  testCases: string[];
}

// ─── Agent system types ─────────────────────────────────────────────────────

export type AgentName =
  | "scaffold"
  | "design-system"
  | "theme"
  | "asset-gen"
  | "component-gen"
  | "animation"
  | "content"
  | "i18n"
  | "cms"
  | "seo-perf"
  | "testing"
  | "deploy"
  | "code-review";

export type AgentStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type PipelineStage =
  | "init"
  | "foundation"
  | "build"
  | "enhance"
  | "quality"
  | "review"
  | "finalize";

export interface AgentPlan {
  description: string;
  steps: AgentPlanStep[];
  estimatedFiles: number;
  estimatedTokens: number;
}

export interface AgentPlanStep {
  id: string;
  description: string;
  files: string[];
  action: "create" | "modify" | "delete";
}

export interface AgentResult<T = unknown> {
  success: boolean;
  output: T;
  filesCreated: string[];
  filesModified: string[];
  tokensUsed: number;
  durationMs: number;
  errors: string[];
  feedback?: AgentFeedback[];
}

export interface AgentFeedback {
  targetAgent: AgentName;
  severity: "blocking" | "advisory";
  message: string;
  affectedFiles: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── State types ────────────────────────────────────────────────────────────

export interface ProjectState {
  phase: PipelineStage;
  agents: Record<string, AgentState>;
  artifacts: Record<string, ArtifactManifest>;
  errors: ErrorLogEntry[];
  tokenUsage: TokenUsageRecord[];
  metadata: {
    startedAt: string;
    lastUpdatedAt: string;
    prdVersion: string;
    pipelineVersion: string;
  };
}

export interface AgentState {
  status: AgentStatus;
  lastRunAt?: string;
  lastInput?: unknown;
  lastOutput?: unknown;
  filesCreated: string[];
  filesModified: string[];
  tokensUsed: number;
  durationMs: number;
  promptVersion?: string;
}

export interface ArtifactManifest {
  path: string;
  createdBy: AgentName;
  createdAt: string;
  hash: string;
  size: number;
}

export interface ErrorLogEntry {
  timestamp: string;
  agent: AgentName;
  error: string;
  stack?: string;
  context?: Record<string, unknown>;
}

export interface TokenUsageRecord {
  timestamp: string;
  agent: AgentName;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

// ─── Config types ───────────────────────────────────────────────────────────

export interface AgentConfig {
  enabled: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
  approvalRequired: boolean;
  promptVersion?: string;
  config: Record<string, unknown>;
}

export interface PipelineConfig {
  name: string;
  version: string;
  stages: PipelineStageConfig[];
}

export interface PipelineStageConfig {
  id: PipelineStage;
  agents: AgentName[];
  parallel: boolean;
  dependsOn: string[];
}

export interface ProjectConfig {
  project: {
    name: string;
    version: string;
    outputDir: string;
  };
  company: {
    name: string;
    domain: string;
    tagline: string;
  };
  products: Product[];
  services: string[];
  analytics: {
    ga4Id: string;
    hotjarId: string;
  };
  claude: {
    apiKeyEnvVar: string;
    defaultModel: string;
    maxTokensPerAgent: number;
  };
}

// ─── Interactive approval types ─────────────────────────────────────────────

export type ApprovalAction = "approve" | "skip" | "edit" | "reject";

export interface ApprovalRequest {
  agent: AgentName;
  description: string;
  files: FilePreview[];
  totalLoc: number;
}

export interface FilePreview {
  path: string;
  action: "create" | "modify" | "delete";
  content?: string;
  diff?: string;
  loc: number;
}

export interface ApprovalResponse {
  action: ApprovalAction;
  feedback?: string;
}
