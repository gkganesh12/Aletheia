import * as ejs from "ejs";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface TemplateContext {
  [key: string]: unknown;
}

export class TemplateEngine {
  private templateDir: string;
  private cache: Map<string, string> = new Map();

  constructor(templateDir: string) {
    this.templateDir = templateDir;
  }

  async render(templateName: string, context: TemplateContext): Promise<string> {
    const template = await this.loadTemplate(templateName);
    return ejs.render(template, context, {
      async: false,
      rmWhitespace: false,
    });
  }

  renderString(template: string, context: TemplateContext): string {
    return ejs.render(template, context, {
      async: false,
      rmWhitespace: false,
    });
  }

  async renderToFile(
    templateName: string,
    context: TemplateContext,
    outputPath: string
  ): Promise<string> {
    const content = await this.render(templateName, context);
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(outputPath, content, "utf-8");
    return content;
  }

  private async loadTemplate(name: string): Promise<string> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const templatePath = path.resolve(this.templateDir, name);
    const content = await fs.readFile(templatePath, "utf-8");
    this.cache.set(name, content);
    return content;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Built-in template helpers for common patterns

  static reactComponent(options: {
    name: string;
    props?: Array<{ name: string; type: string; required?: boolean }>;
    imports?: string[];
    body: string;
    isExportDefault?: boolean;
  }): string {
    const { name, props = [], imports = [], body, isExportDefault = true } = options;

    let code = "";

    // Imports
    if (imports.length > 0) {
      code += imports.join("\n") + "\n\n";
    }

    // Props interface
    if (props.length > 0) {
      code += `interface ${name}Props {\n`;
      for (const prop of props) {
        const optional = prop.required === false ? "?" : "";
        code += `  ${prop.name}${optional}: ${prop.type};\n`;
      }
      code += "}\n\n";
    }

    // Component
    const propsArg = props.length > 0 ? `{ ${props.map((p) => p.name).join(", ")} }: ${name}Props` : "";
    const exportKeyword = isExportDefault ? "export default" : "export";

    code += `${exportKeyword} function ${name}(${propsArg}) {\n`;
    code += `  return (\n`;
    code += body
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n");
    code += `\n  );\n`;
    code += `}\n`;

    return code;
  }

  static storyTemplate(options: {
    componentName: string;
    componentPath: string;
    stories: Array<{ name: string; args?: Record<string, unknown> }>;
  }): string {
    const { componentName, componentPath, stories } = options;

    let code = `import type { Meta, StoryObj } from "@storybook/react";\n`;
    code += `import ${componentName} from "${componentPath}";\n\n`;
    code += `const meta: Meta<typeof ${componentName}> = {\n`;
    code += `  title: "Sections/${componentName}",\n`;
    code += `  component: ${componentName},\n`;
    code += `  parameters: {\n`;
    code += `    layout: "fullscreen",\n`;
    code += `  },\n`;
    code += `};\n\n`;
    code += `export default meta;\n`;
    code += `type Story = StoryObj<typeof ${componentName}>;\n\n`;

    for (const story of stories) {
      code += `export const ${story.name}: Story = {\n`;
      if (story.args) {
        code += `  args: ${JSON.stringify(story.args, null, 4).replace(/\n/g, "\n  ")},\n`;
      }
      code += `};\n\n`;
    }

    return code;
  }

  static testTemplate(options: {
    componentName: string;
    componentPath: string;
    testCases: string[];
  }): string {
    const { componentName, componentPath, testCases } = options;

    let code = `import { describe, it, expect } from "vitest";\n`;
    code += `import { render, screen } from "@testing-library/react";\n`;
    code += `import ${componentName} from "${componentPath}";\n\n`;
    code += `describe("${componentName}", () => {\n`;

    for (const testCase of testCases) {
      code += `  it("${testCase}", () => {\n`;
      code += `    render(<${componentName} />);\n`;
      code += `    // TODO: implement test assertion\n`;
      code += `  });\n\n`;
    }

    code += `});\n`;
    return code;
  }
}
