import { registerAgent } from "../orchestrator/pipeline.js";
import { ScaffoldAgent } from "./scaffold/index.js";
import { DesignSystemAgent } from "./design-system/index.js";
import { ThemeAgent } from "./theme/index.js";
import { AssetGenAgent } from "./asset-gen/index.js";
import { ComponentGenAgent } from "./component-gen/index.js";
import { AnimationAgent } from "./animation/index.js";
import { ContentAgent } from "./content/index.js";
import { I18nAgent } from "./i18n/index.js";
import { CmsAgent } from "./cms/index.js";
import { SeoPerfAgent } from "./seo-perf/index.js";
import { TestingAgent } from "./testing/index.js";
import { DeployAgent } from "./deploy/index.js";
import { CodeReviewAgent } from "./code-review/index.js";

export function registerAllAgents(): void {
  registerAgent("scaffold", (ctx) => new ScaffoldAgent(ctx));
  registerAgent("design-system", (ctx) => new DesignSystemAgent(ctx));
  registerAgent("theme", (ctx) => new ThemeAgent(ctx));
  registerAgent("asset-gen", (ctx) => new AssetGenAgent(ctx));
  registerAgent("component-gen", (ctx) => new ComponentGenAgent(ctx));
  registerAgent("animation", (ctx) => new AnimationAgent(ctx));
  registerAgent("content", (ctx) => new ContentAgent(ctx));
  registerAgent("i18n", (ctx) => new I18nAgent(ctx));
  registerAgent("cms", (ctx) => new CmsAgent(ctx));
  registerAgent("seo-perf", (ctx) => new SeoPerfAgent(ctx));
  registerAgent("testing", (ctx) => new TestingAgent(ctx));
  registerAgent("deploy", (ctx) => new DeployAgent(ctx));
  registerAgent("code-review", (ctx) => new CodeReviewAgent(ctx));
}
