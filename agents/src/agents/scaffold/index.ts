import { z } from "zod";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  packageManager: z.enum(["npm", "pnpm", "bun"]).default("npm"),
  cssApproach: z.enum(["tailwind", "css-modules", "both"]).default("tailwind"),
  animationLib: z.enum(["framer-motion", "gsap", "both"]).default("both"),
  storybook: z.boolean().default(true),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  projectDir: z.string(),
  installedDeps: z.array(z.string()),
  folderStructure: z.array(z.string()),
  configFiles: z.array(z.string()),
});

type Output = z.infer<typeof OutputSchema>;

export class ScaffoldAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "scaffold";
  readonly description = "Initialize Vite + React 18 + TypeScript + Tailwind + Storybook project with full folder structure";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(input: Input): Promise<AgentPlan> {
    const outputDir = this.outputDir;
    const exists = await this.fileOps.fileExists(`${outputDir}/package.json`);

    if (exists) {
      return {
        description: "Project already scaffolded — verifying structure",
        steps: [{ id: "verify", description: "Verify existing project structure", files: [], action: "modify" }],
        estimatedFiles: 0,
        estimatedTokens: 1000,
      };
    }

    return {
      description: "Scaffold complete Vite + React + TypeScript + Tailwind project",
      steps: [
        {
          id: "create-vite",
          description: "Create Vite project with React + TypeScript template",
          files: [`${outputDir}/package.json`, `${outputDir}/vite.config.ts`],
          action: "create",
        },
        {
          id: "install-deps",
          description: "Install Tailwind, GSAP, Framer Motion, and all dependencies",
          files: [`${outputDir}/package.json`],
          action: "modify",
        },
        {
          id: "create-structure",
          description: "Create src/ folder structure with all component directories",
          files: [
            `${outputDir}/src/components/ui/`,
            `${outputDir}/src/components/layout/`,
            `${outputDir}/src/components/sections/`,
            `${outputDir}/src/components/shared/`,
            `${outputDir}/src/hooks/`,
            `${outputDir}/src/lib/`,
            `${outputDir}/src/data/`,
            `${outputDir}/src/types/`,
          ],
          action: "create",
        },
        {
          id: "write-configs",
          description: "Write Tailwind, ESLint, Prettier, Vitest, and TypeScript configs",
          files: [
            `${outputDir}/tailwind.config.ts`,
            `${outputDir}/tsconfig.json`,
            `${outputDir}/.eslintrc.cjs`,
            `${outputDir}/.prettierrc`,
          ],
          action: "create",
        },
        {
          id: "setup-storybook",
          description: "Initialize and configure Storybook 8",
          files: [`${outputDir}/.storybook/main.ts`, `${outputDir}/.storybook/preview.ts`],
          action: "create",
        },
      ],
      estimatedFiles: 20,
      estimatedTokens: 15000,
    };
  }

  async execute(input: Input, plan: AgentPlan): Promise<Output> {
    const outputDir = this.outputDir;
    const createdFiles: string[] = [];
    const configFiles: string[] = [];

    // Step 1: Create Vite project
    this.updateSpinner("Creating Vite project...");
    const result = await this.shell.run(
      `npm create vite@latest website -- --template react-ts`,
      { cwd: this.rootDir }
    );

    if (!result.success) {
      // Fall back to manual creation
      await this.createManualProject(outputDir);
    }

    // Step 2: Create folder structure
    this.updateSpinner("Creating folder structure...");
    const dirs = [
      "src/components/ui",
      "src/components/layout",
      "src/components/sections/Hero",
      "src/components/sections/About",
      "src/components/sections/Services",
      "src/components/sections/Products",
      "src/components/sections/Stats",
      "src/components/sections/CaseStudies",
      "src/components/sections/Testimonials",
      "src/components/sections/Contact",
      "src/components/shared",
      "src/hooks",
      "src/lib",
      "src/data",
      "src/types",
      "src/styles",
      "public/images/hero",
      "public/images/products",
      "public/images/case-studies",
      "public/images/og",
      "public/fonts",
      "public/favicon",
    ];

    for (const dir of dirs) {
      await this.fileOps.ensureDir(`${outputDir}/${dir}`);
      createdFiles.push(`${outputDir}/${dir}/`);
    }

    // Step 3: Write base files
    this.updateSpinner("Writing configuration files...");

    // package.json
    const packageJson = {
      name: "aletheia-ai-website",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
        lint: "eslint .",
        test: "vitest run",
        "test:watch": "vitest",
        storybook: "storybook dev -p 6006",
        "build-storybook": "storybook build",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        "react-helmet-async": "^2.0.5",
        "react-hook-form": "^7.53.0",
        "framer-motion": "^11.11.0",
        gsap: "^3.12.5",
        zod: "^3.23.8",
        "@hookform/resolvers": "^3.9.0",
        clsx: "^2.1.1",
        "tailwind-merge": "^2.5.4",
      },
      devDependencies: {
        "@types/react": "^18.3.12",
        "@types/react-dom": "^18.3.1",
        "@vitejs/plugin-react": "^4.3.4",
        typescript: "^5.7.2",
        vite: "^6.0.0",
        tailwindcss: "^3.4.15",
        postcss: "^8.4.49",
        autoprefixer: "^10.4.20",
        eslint: "^9.15.0",
        prettier: "^3.4.2",
        vitest: "^2.1.0",
        "@testing-library/react": "^16.1.0",
        "@testing-library/jest-dom": "^6.6.3",
        jsdom: "^25.0.1",
        "@storybook/react": "^8.4.0",
        "@storybook/react-vite": "^8.4.0",
        "@storybook/addon-essentials": "^8.4.0",
        "@storybook/blocks": "^8.4.0",
        storybook: "^8.4.0",
      },
    };

    await this.fileOps.writeFile(
      `${outputDir}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
    configFiles.push(`${outputDir}/package.json`);

    // vite.config.ts
    await this.fileOps.writeFile(
      `${outputDir}/vite.config.ts`,
      `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          animations: ["framer-motion", "gsap"],
        },
      },
    },
  },
});
`
    );
    configFiles.push(`${outputDir}/vite.config.ts`);

    // tsconfig.json
    await this.fileOps.writeFile(
      `${outputDir}/tsconfig.json`,
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2020",
            useDefineForClassFields: true,
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            module: "ESNext",
            skipLibCheck: true,
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: "force",
            noEmit: true,
            jsx: "react-jsx",
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
            noUncheckedIndexedAccess: true,
            baseUrl: ".",
            paths: { "@/*": ["./src/*"] },
          },
          include: ["src"],
        },
        null,
        2
      )
    );
    configFiles.push(`${outputDir}/tsconfig.json`);

    // tailwind.config.ts (base — design-system agent will enhance)
    await this.fileOps.writeFile(
      `${outputDir}/tailwind.config.ts`,
      `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`
    );
    configFiles.push(`${outputDir}/tailwind.config.ts`);

    // postcss.config.js
    await this.fileOps.writeFile(
      `${outputDir}/postcss.config.js`,
      `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
    );

    // index.html
    await this.fileOps.writeFile(
      `${outputDir}/index.html`,
      `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aletheia AI — AI Engineering & Cybersecurity</title>
  </head>
  <body class="bg-neutral-950 text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
    );

    // src/main.tsx
    await this.fileOps.writeFile(
      `${outputDir}/src/main.tsx`,
      `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
    );

    // src/App.tsx (skeleton)
    await this.fileOps.writeFile(
      `${outputDir}/src/App.tsx`,
      `export default function App() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold text-center py-20">
        Aletheia AI — Coming Soon
      </h1>
    </main>
  );
}
`
    );

    // src/index.css
    await this.fileOps.writeFile(
      `${outputDir}/src/index.css`,
      `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 3%;
    --foreground: 0 0% 98%;
  }

  body {
    font-family: "Inter", system-ui, -apple-system, sans-serif;
  }
}
`
    );

    // src/lib/utils.ts (cn utility)
    await this.fileOps.writeFile(
      `${outputDir}/src/lib/utils.ts`,
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
    );

    // src/vite-env.d.ts
    await this.fileOps.writeFile(
      `${outputDir}/src/vite-env.d.ts`,
      `/// <reference types="vite/client" />
`
    );

    // Storybook config
    if (input.storybook) {
      await this.fileOps.ensureDir(`${outputDir}/.storybook`);

      await this.fileOps.writeFile(
        `${outputDir}/.storybook/main.ts`,
        `import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
`
      );

      await this.fileOps.writeFile(
        `${outputDir}/.storybook/preview.ts`,
        `import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "light", value: "#ffffff" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "812px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1440px", height: "900px" } },
      },
    },
  },
};

export default preview;
`
      );
    }

    // Vitest config
    await this.fileOps.writeFile(
      `${outputDir}/vitest.config.ts`,
      `import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
`
    );

    await this.fileOps.writeFile(
      `${outputDir}/src/test-setup.ts`,
      `import "@testing-library/jest-dom/vitest";
`
    );

    // .gitignore
    await this.fileOps.writeFile(
      `${outputDir}/.gitignore`,
      `node_modules/
dist/
.env
.env.local
storybook-static/
coverage/
`
    );

    // Step 4: Install dependencies
    this.updateSpinner("Installing dependencies...");
    const installResult = await this.shell.run(`npm install`, {
      cwd: `${this.rootDir}/${outputDir}`,
      timeout: 120000,
    });

    const installedDeps = Object.keys(packageJson.dependencies);

    return {
      projectDir: outputDir,
      installedDeps,
      folderStructure: createdFiles,
      configFiles,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check package.json exists
    const pkgExists = await this.fileOps.fileExists(`${output.projectDir}/package.json`);
    if (!pkgExists) errors.push("package.json not found");

    // Check key directories
    const dirs = ["src/components", "src/hooks", "src/lib"];
    for (const dir of dirs) {
      const exists = await this.fileOps.fileExists(`${output.projectDir}/${dir}`);
      if (!exists) warnings.push(`Directory ${dir} not found`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  private async createManualProject(outputDir: string): Promise<void> {
    await this.fileOps.ensureDir(outputDir);
    await this.fileOps.ensureDir(`${outputDir}/src`);
    await this.fileOps.ensureDir(`${outputDir}/public`);
  }
}
