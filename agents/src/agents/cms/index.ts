import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  provider: z.literal("sanity").default("sanity"),
  dataset: z.string().default("production"),
  schemas: z.array(z.string()).default(["service", "product", "caseStudy", "testimonial"]),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  schemaFiles: z.array(z.string()),
  apiClient: z.string(),
  dataHooks: z.array(z.string()),
  previewSetup: z.string(),
});

type Output = z.infer<typeof OutputSchema>;

export class CmsAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "cms";
  readonly description = "Set up Sanity Studio with typed schemas, API client, data hooks, and preview mode";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    return {
      description: "Configure Sanity CMS with content schemas and React integration",
      steps: [
        { id: "config", description: "Create Sanity config and client", files: [`${this.outputDir}/src/lib/sanity.ts`], action: "create" },
        { id: "schemas", description: `Create ${input.schemas.length} content schemas`, files: input.schemas.map((s) => `${this.outputDir}/src/lib/sanity/schemas/${s}.ts`), action: "create" },
        { id: "hooks", description: "Create data fetching hooks", files: input.schemas.map((s) => `${this.outputDir}/src/hooks/use${s.charAt(0).toUpperCase() + s.slice(1)}.ts`), action: "create" },
        { id: "preview", description: "Set up preview mode", files: [`${this.outputDir}/src/lib/sanity/preview.ts`], action: "create" },
      ],
      estimatedFiles: input.schemas.length * 2 + 3,
      estimatedTokens: 30000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const schemaFiles: string[] = [];
    const dataHooks: string[] = [];

    // Step 1: Sanity client
    this.updateSpinner("Creating Sanity client...");
    const clientCode = await this.askClaudeForCode(
      `Create a Sanity client configuration file for a React + Vite project.

Requirements:
- Import createClient from "@sanity/client"
- Export a configured client instance
- Use environment variables: VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET
- Export GROQ query helper function
- Export imageUrlBuilder helper for Sanity images
- Include TypeScript types for the client
- Dataset: "${input.dataset}"
- API version: "2024-01-01"
- useCdn: true for production, false for preview

Also install hint comment: // npm install @sanity/client @sanity/image-url`
    );
    const clientPath = `${this.outputDir}/src/lib/sanity.ts`;
    await this.fileOps.writeFile(clientPath, clientCode);

    // Step 2: Content schemas
    await this.fileOps.ensureDir(`${this.outputDir}/src/lib/sanity/schemas`);

    for (const schemaName of input.schemas) {
      this.updateSpinner(`Creating ${schemaName} schema...`);
      const schemaCode = await this.askClaudeForCode(
        `Create a Sanity schema definition for "${schemaName}" content type for an AI/cybersecurity agency website.

${schemaName === "service" ? "Fields: name (string), description (text), icon (string), order (number)" : ""}
${schemaName === "product" ? "Fields: name (string), tagline (string), description (text), features (array of strings), gradient (array of 2 color strings), logo (image)" : ""}
${schemaName === "caseStudy" ? "Fields: title (string), client (string), industry (string), challenge (text), solution (text), results (array of strings), image (image), publishedAt (datetime)" : ""}
${schemaName === "testimonial" ? "Fields: quote (text), author (string), role (string), company (string), avatar (image), featured (boolean)" : ""}

Use Sanity's defineType and defineField. Export the schema definition.
Include TypeScript type for the document.`
      );
      const schemaPath = `${this.outputDir}/src/lib/sanity/schemas/${schemaName}.ts`;
      await this.fileOps.writeFile(schemaPath, schemaCode);
      schemaFiles.push(schemaPath);
    }

    // Schema index
    const schemaIndexCode = input.schemas
      .map((s) => `export { default as ${s} } from "./schemas/${s}";`)
      .join("\n") + "\n";
    await this.fileOps.writeFile(`${this.outputDir}/src/lib/sanity/index.ts`, schemaIndexCode);

    // Step 3: Data hooks
    for (const schemaName of input.schemas) {
      this.updateSpinner(`Creating use${schemaName} hook...`);
      const hookName = `use${schemaName.charAt(0).toUpperCase() + schemaName.slice(1)}`;
      const pluralName = schemaName.endsWith("y")
        ? schemaName.slice(0, -1) + "ies"
        : schemaName + "s";

      const hookCode = await this.askClaudeForCode(
        `Create a React hook "${hookName}" that fetches ${pluralName} from Sanity CMS.

Requirements:
- Import the sanity client from "@/lib/sanity"
- Use GROQ query to fetch all documents of type "${schemaName}"
- Return { data, loading, error } state
- Use useState and useEffect
- Fall back to static data from "@/data/${pluralName}" if fetch fails
- Include proper TypeScript types
- Order by: ${schemaName === "service" ? "order asc" : "_createdAt desc"}

Export as named export.`
      );
      const hookPath = `${this.outputDir}/src/hooks/${hookName}.ts`;
      await this.fileOps.writeFile(hookPath, hookCode);
      dataHooks.push(hookPath);
    }

    // Step 4: Preview mode
    this.updateSpinner("Setting up preview mode...");
    const previewCode = await this.askClaudeForCode(
      `Create a preview mode utility for Sanity CMS in a React app.

Requirements:
- Export a usePreviewMode() hook that checks URL params for preview token
- Export a PreviewBanner component that shows "Preview Mode" banner at top
- Export enablePreview() and disablePreview() functions
- Store preview state in sessionStorage
- When in preview mode, the Sanity client should use useCdn: false and include draft documents

TypeScript + React.`
    );
    const previewPath = `${this.outputDir}/src/lib/sanity/preview.ts`;
    await this.fileOps.writeFile(previewPath, previewCode);

    return {
      schemaFiles,
      apiClient: clientPath,
      dataHooks,
      previewSetup: previewPath,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const clientExists = await this.fileOps.fileExists(output.apiClient);
    if (!clientExists) errors.push("Sanity client not created");

    if (output.schemaFiles.length === 0) warnings.push("No schemas generated");
    if (output.dataHooks.length === 0) warnings.push("No data hooks generated");

    return { valid: errors.length === 0, errors, warnings };
  }
}
