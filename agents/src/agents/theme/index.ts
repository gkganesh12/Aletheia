import { z } from "zod";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

// ─── Input / Output schemas ────────────────────────────────────────────────

const InputSchema = z.object({
  defaultTheme: z.enum(["dark", "light"]).default("dark"),
  persistPreference: z.boolean().default(true),
  respectSystemPreference: z.boolean().default(true),
});

type ThemeInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  themeProvider: z.string().min(1),
  useThemeHook: z.string().min(1),
  toggleComponent: z.string().min(1),
  cssVariables: z.string().min(1),
});

type ThemeOutput = z.infer<typeof OutputSchema>;

// ─── Agent implementation ──────────────────────────────────────────────────

export class ThemeAgent extends BaseAgent<ThemeInput, ThemeOutput> {
  readonly name: AgentName = "theme";
  readonly description =
    "Generates a dark/light theme system with CSS variables, ThemeProvider context, useTheme hook, toggle component, and system preference detection.";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  constructor(context: AgentContext) {
    super(context);
  }

  // ─── Plan ──────────────────────────────────────────────────────────────

  async plan(input: ThemeInput): Promise<AgentPlan> {
    const basePath = `${this.outputDir}/src/theme`;

    return {
      description:
        "Generate a complete dark/light theme system with CSS variables, React context provider, hook, and toggle component.",
      steps: [
        {
          id: "css-variables",
          description: "Create CSS custom properties for light and dark themes",
          files: [`${basePath}/variables.css`],
          action: "create",
        },
        {
          id: "theme-provider",
          description: "Create ThemeProvider React context with persistence and system preference detection",
          files: [`${basePath}/ThemeProvider.tsx`],
          action: "create",
        },
        {
          id: "use-theme-hook",
          description: "Create useTheme hook for consuming theme context",
          files: [`${basePath}/useTheme.ts`],
          action: "create",
        },
        {
          id: "toggle-component",
          description: "Create ThemeToggle component with sun/moon icon animation",
          files: [`${basePath}/ThemeToggle.tsx`],
          action: "create",
        },
      ],
      estimatedFiles: 4,
      estimatedTokens: 6000,
    };
  }

  // ─── Execute ───────────────────────────────────────────────────────────

  async execute(input: ThemeInput, plan: AgentPlan): Promise<ThemeOutput> {
    const basePath = `${this.outputDir}/src/theme`;

    // 1. Generate CSS variables
    this.updateSpinner("Generating CSS variables for light and dark themes...");
    const cssVariables = await this.askClaudeForCode(
      this.buildCssPrompt(input),
      "css"
    );
    await this.fileOps.writeFile(`${basePath}/variables.css`, cssVariables);

    // 2. Generate ThemeProvider
    this.updateSpinner("Generating ThemeProvider context component...");
    const themeProvider = await this.askClaudeForCode(
      this.buildProviderPrompt(input)
    );
    await this.fileOps.writeFile(`${basePath}/ThemeProvider.tsx`, themeProvider);

    // 3. Generate useTheme hook
    this.updateSpinner("Generating useTheme hook...");
    const useThemeHook = await this.askClaudeForCode(
      this.buildHookPrompt()
    );
    await this.fileOps.writeFile(`${basePath}/useTheme.ts`, useThemeHook);

    // 4. Generate ThemeToggle component
    this.updateSpinner("Generating ThemeToggle component with sun/moon icons...");
    const toggleComponent = await this.askClaudeForCode(
      this.buildTogglePrompt()
    );
    await this.fileOps.writeFile(`${basePath}/ThemeToggle.tsx`, toggleComponent);

    return {
      themeProvider,
      useThemeHook,
      toggleComponent,
      cssVariables,
    };
  }

  // ─── Validate ──────────────────────────────────────────────────────────

  async validate(output: ThemeOutput): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verify ThemeProvider has context creation
    if (!output.themeProvider.includes("createContext")) {
      errors.push("ThemeProvider must use React.createContext");
    }

    // Verify useTheme hook uses useContext
    if (!output.useThemeHook.includes("useContext")) {
      errors.push("useTheme hook must call useContext");
    }

    // Verify CSS contains both theme selectors
    if (!output.cssVariables.includes("dark")) {
      warnings.push("CSS variables should include dark theme selectors");
    }
    if (!output.cssVariables.includes("light")) {
      warnings.push("CSS variables should include light theme selectors");
    }

    // Verify toggle component renders a button-like element
    if (!output.toggleComponent.includes("button") && !output.toggleComponent.includes("Button")) {
      warnings.push("ThemeToggle should render an accessible button element");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ─── Prompt builders ──────────────────────────────────────────────────

  private buildCssPrompt(input: ThemeInput): string {
    return `Generate a CSS file defining custom properties (CSS variables) for a dark/light theme system for the Aletheia AI cybersecurity website.

Requirements:
- Use \`:root\` and \`[data-theme="dark"]\` / \`[data-theme="light"]\` attribute selectors.
- Default theme is "${input.defaultTheme}", so :root should carry the ${input.defaultTheme} values.
- Include variables for:
  - Background colors (primary, secondary, tertiary, surface, overlay)
  - Text colors (primary, secondary, muted, inverse)
  - Brand accent colors (cyan #00F0FF, electric blue #0066FF, purple #8B5CF6, green #10B981)
  - Border colors, shadows, and glow effects
  - Spacing, radius, and typography scale tokens
  - Transition durations
- Use a \`--color-\` prefix for color tokens.
- Add smooth transitions on background-color and color for theme switch animation.
- Include a @media (prefers-color-scheme: dark) block as a fallback.`;
  }

  private buildProviderPrompt(input: ThemeInput): string {
    return `Generate a React ThemeProvider component in TypeScript (TSX).

Requirements:
- Create a ThemeContext using React.createContext.
- Export a ThemeProvider component that wraps children in the context provider.
- Context value must include: theme ("dark" | "light"), toggleTheme function, setTheme function, isDark boolean.
- Default theme: "${input.defaultTheme}".
- ${input.persistPreference ? 'Persist theme preference to localStorage under key "aletheia-theme".' : "Do not persist preference."}
- ${input.respectSystemPreference ? "On mount, detect system preference using window.matchMedia('(prefers-color-scheme: dark)') and subscribe to changes. System preference is used only if no persisted preference exists." : "Do not detect system preference."}
- Set document.documentElement.setAttribute("data-theme", theme) whenever theme changes.
- Use useEffect, useState, useCallback, and useMemo appropriately.
- Export the ThemeContext so the hook file can import it.
- Import React from "react".`;
  }

  private buildHookPrompt(): string {
    return `Generate a custom React hook called useTheme in TypeScript.

Requirements:
- Import ThemeContext from "./ThemeProvider".
- Call useContext(ThemeContext) and throw an error if used outside ThemeProvider.
- Return the full context value: { theme, toggleTheme, setTheme, isDark }.
- Export as a named export.
- Add JSDoc comments.`;
  }

  private buildTogglePrompt(): string {
    return `Generate a React ThemeToggle component in TypeScript (TSX).

Requirements:
- Import useTheme from "./useTheme".
- Render an accessible <button> with aria-label describing current state.
- Include inline SVG icons for sun and moon (no external icon library).
- Sun icon shown in dark mode (clicking switches to light), moon icon shown in light mode (clicking switches to dark).
- Add a smooth CSS rotation/scale transition on the icon when toggling.
- Style with a styled wrapper or CSS module class — keep styles co-located.
- Add keyboard support (Enter and Space trigger toggle).
- Component accepts optional className prop.
- Export as named export ThemeToggle.`;
  }
}
