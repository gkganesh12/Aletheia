import { z } from "zod";
import * as path from "node:path";
import { BaseAgent, AgentContext } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

// ─── Input / Output schemas ─────────────────────────────────────────────────

const InputSchema = z.object({
  framework: z.literal("react-i18next"),
  defaultLocale: z.string().min(2),
  supportedLocales: z.array(z.string().min(2)).min(1),
  namespaces: z.array(z.string().min(1)).min(1),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  configFile: z.string(),
  localeFiles: z.array(z.string()),
  languageSwitcher: z.string(),
  modifiedComponents: z.array(z.string()),
});

type Output = z.infer<typeof OutputSchema>;

// ─── Agent ──────────────────────────────────────────────────────────────────

export class I18nAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "i18n";
  readonly description =
    "Set up internationalization with react-i18next, generate translation files, and create a language switcher component";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  // ─── Plan ───────────────────────────────────────────────────────────────

  async plan(input: Input): Promise<AgentPlan> {
    const outputDir = this.outputDir;
    const totalLocaleFiles =
      input.supportedLocales.length * input.namespaces.length;

    return {
      description:
        "Set up react-i18next with translation files and language switcher",
      steps: [
        {
          id: "install-deps",
          description: "Install react-i18next and i18next packages",
          files: [`${outputDir}/package.json`],
          action: "modify",
        },
        {
          id: "generate-config",
          description: "Generate i18n configuration file with namespace and locale setup",
          files: [`${outputDir}/src/lib/i18n.ts`],
          action: "create",
        },
        {
          id: "create-locale-files",
          description: `Create ${totalLocaleFiles} translation JSON files (${input.supportedLocales.length} locales x ${input.namespaces.length} namespaces)`,
          files: input.supportedLocales.flatMap((locale) =>
            input.namespaces.map(
              (ns) => `${outputDir}/public/locales/${locale}/${ns}.json`
            )
          ),
          action: "create",
        },
        {
          id: "language-switcher",
          description: "Generate a LanguageSwitcher React component",
          files: [`${outputDir}/src/components/ui/LanguageSwitcher.tsx`],
          action: "create",
        },
        {
          id: "integration-guide",
          description:
            "Generate instructions for wrapping existing components with t() calls",
          files: [`${outputDir}/src/lib/i18n-guide.ts`],
          action: "create",
        },
      ],
      estimatedFiles: totalLocaleFiles + 4,
      estimatedTokens: 12000,
    };
  }

  // ─── Execute ────────────────────────────────────────────────────────────

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const outputDir = this.outputDir;
    const localeFiles: string[] = [];
    const modifiedComponents: string[] = [];

    // Step 1 — Install react-i18next and i18next
    this.updateSpinner("Installing i18n dependencies...");
    await this.shell.npmInstall(
      ["react-i18next", "i18next", "i18next-http-backend", "i18next-browser-languagedetector"],
      { cwd: path.resolve(this.rootDir, outputDir) }
    );

    // Step 2 — Generate i18n config file
    this.updateSpinner("Generating i18n configuration...");
    const configCode = await this.askClaudeForCode(
      `Generate an i18n configuration file for a React + TypeScript project using react-i18next.

Requirements:
- Default locale: "${input.defaultLocale}"
- Supported locales: ${JSON.stringify(input.supportedLocales)}
- Namespaces: ${JSON.stringify(input.namespaces)}
- Default namespace: "${input.namespaces[0]}"
- Use i18next-http-backend to load translation JSON from /locales/{{lng}}/{{ns}}.json
- Use i18next-browser-languagedetector for automatic language detection
- Enable React suspense mode
- Export the i18n instance as default
- Include TypeScript types: declare module "react-i18next" with CustomTypeOptions setting defaultNS and resources
- Add interpolation.escapeValue = false (React already escapes)
- Set fallbackLng to "${input.defaultLocale}"

The file will live at src/lib/i18n.ts.`,
      "typescript"
    );

    const configFilePath = `${outputDir}/src/lib/i18n.ts`;
    await this.fileOps.writeFile(configFilePath, configCode);

    // Step 3 — Create translation JSON files for each locale + namespace
    this.updateSpinner("Creating translation files...");
    for (const locale of input.supportedLocales) {
      for (const ns of input.namespaces) {
        const translationPrompt =
          locale === input.defaultLocale
            ? `Generate a starter translation JSON for the "${ns}" namespace in English (${locale}).
Include 8-12 realistic placeholder keys covering headings, descriptions, buttons, and labels relevant to a "${ns}" section of a tech/AI company website.
Return ONLY valid JSON.`
            : `Generate a starter translation JSON for the "${ns}" namespace in locale "${locale}".
The keys must exactly match these English keys: provide realistic translated placeholder values.
Include 8-12 keys covering headings, descriptions, buttons, and labels relevant to a "${ns}" section of a tech/AI company website.
Return ONLY valid JSON.`;

        const translationJson = await this.askClaude(
          translationPrompt + "\n\nRespond with ONLY valid JSON, no markdown fences or explanations."
        );

        const filePath = `${outputDir}/public/locales/${locale}/${ns}.json`;
        const parsed = this.extractJSON(translationJson);

        // Validate it's parseable JSON
        try {
          JSON.parse(parsed);
          await this.fileOps.writeFile(filePath, parsed);
        } catch {
          // Fallback: write a minimal valid JSON file
          const fallback: Record<string, string> = {};
          fallback[`${ns}.title`] = `${ns} title`;
          fallback[`${ns}.description`] = `${ns} description`;
          await this.fileOps.writeFile(filePath, JSON.stringify(fallback, null, 2));
        }

        localeFiles.push(filePath);
      }
    }

    // Step 4 — Generate LanguageSwitcher component
    this.updateSpinner("Generating LanguageSwitcher component...");
    const switcherCode = await this.askClaudeForCode(
      `Generate a React LanguageSwitcher component in TypeScript for react-i18next.

Requirements:
- Supported locales: ${JSON.stringify(input.supportedLocales)}
- Use useTranslation hook from react-i18next to get i18n instance
- Display locale names using a readable map (e.g. "en" -> "English", "es" -> "Espanol", "de" -> "Deutsch", etc.)
- Render a dropdown (<select>) or a row of buttons — use Tailwind CSS classes for styling
- Highlight the currently active locale
- On change, call i18n.changeLanguage(locale)
- Component should be accessible (proper aria-label, keyboard navigable)
- Export as default
- Dark theme styling: bg-neutral-800, text-white, border-neutral-700 aesthetic`,
      "typescript"
    );

    const switcherPath = `${outputDir}/src/components/ui/LanguageSwitcher.tsx`;
    await this.fileOps.writeFile(switcherPath, switcherCode);

    // Step 5 — Generate integration instructions (as a typed utility module)
    this.updateSpinner("Generating i18n integration guide...");
    const guideCode = await this.askClaudeForCode(
      `Generate a TypeScript utility module with helpers and documentation for integrating react-i18next into existing React components.

Include:
1. A "withTranslationKeys" higher-order helper type that documents how to use the t() function
2. A commented example showing how to convert a hardcoded component to use translations:
   - Before: <h1>Welcome to Aletheia AI</h1>
   - After: <h1>{t("hero.title")}</h1>
3. A helper function "createTranslationAudit" that takes a list of component file paths and returns an array of { component, hardcodedStrings: string[] } objects (stubs that developers fill in)
4. Namespaces available: ${JSON.stringify(input.namespaces)}
5. Export everything with proper TypeScript types

This file will live at src/lib/i18n-guide.ts.`,
      "typescript"
    );

    const guidePath = `${outputDir}/src/lib/i18n-guide.ts`;
    await this.fileOps.writeFile(guidePath, guideCode);
    modifiedComponents.push(guidePath);

    // Also ensure main.tsx imports the i18n config
    this.updateSpinner("Patching main.tsx to import i18n config...");
    const mainTsxPath = `${outputDir}/src/main.tsx`;
    const mainContent = await this.fileOps.readFile(mainTsxPath);
    if (mainContent && !mainContent.includes("i18n")) {
      const patchedMain = `import "./lib/i18n";\nimport { Suspense } from "react";\n${mainContent.replace(
        "<React.StrictMode>",
        "<React.StrictMode>\n    <Suspense fallback={<div>Loading...</div>}>"
      ).replace(
        "</React.StrictMode>",
        "    </Suspense>\n  </React.StrictMode>"
      )}`;
      await this.fileOps.writeFile(mainTsxPath, patchedMain);
      modifiedComponents.push(mainTsxPath);
    }

    return {
      configFile: configFilePath,
      localeFiles,
      languageSwitcher: switcherPath,
      modifiedComponents,
    };
  }

  // ─── Validate ───────────────────────────────────────────────────────────

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Config file must exist
    const configExists = await this.fileOps.fileExists(output.configFile);
    if (!configExists) {
      errors.push(`i18n config file not found: ${output.configFile}`);
    }

    // Language switcher must exist
    const switcherExists = await this.fileOps.fileExists(output.languageSwitcher);
    if (!switcherExists) {
      errors.push(`LanguageSwitcher component not found: ${output.languageSwitcher}`);
    }

    // At least some locale files should exist
    if (output.localeFiles.length === 0) {
      errors.push("No locale files were generated");
    } else {
      for (const localeFile of output.localeFiles) {
        const exists = await this.fileOps.fileExists(localeFile);
        if (!exists) {
          warnings.push(`Locale file missing: ${localeFile}`);
        } else {
          // Validate JSON
          const content = await this.fileOps.readFile(localeFile);
          if (content) {
            try {
              const parsed = JSON.parse(content);
              if (typeof parsed !== "object" || parsed === null) {
                warnings.push(`Locale file is not a JSON object: ${localeFile}`);
              }
            } catch {
              errors.push(`Locale file contains invalid JSON: ${localeFile}`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
