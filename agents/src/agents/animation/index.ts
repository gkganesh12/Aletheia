import { z } from "zod";
import { BaseAgent } from "../../core/base-agent.js";
import type { AgentName, AgentPlan, ValidationResult } from "../../core/types.js";

const InputSchema = z.object({
  sections: z.array(z.string()).optional(),
  animationLib: z.enum(["gsap", "framer-motion", "both"]).default("both"),
  intensity: z.enum(["subtle", "moderate", "dramatic"]).default("moderate"),
  customCursor: z.boolean().default(true),
  respectReducedMotion: z.boolean().default(true),
  libraries: z.array(z.string()).optional(),
});

type Input = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  modifiedComponents: z.array(
    z.object({ path: z.string(), animationsAdded: z.array(z.string()) })
  ),
  hooks: z.array(z.string()),
  utilities: z.array(z.string()),
  customCursorPath: z.string().optional(),
});

type Output = z.infer<typeof OutputSchema>;

export class AnimationAgent extends BaseAgent<Input, Output> {
  readonly name: AgentName = "animation";
  readonly description =
    "Add GSAP ScrollTrigger + Framer Motion animations, parallax, custom cursor, preloader, and hover effects";
  readonly inputSchema = InputSchema;
  readonly outputSchema = OutputSchema;

  async plan(_input: Input): Promise<AgentPlan> {
    return {
      description: "Add scroll-triggered animations, hover effects, parallax, custom cursor, and preloader",
      steps: [
        {
          id: "hooks",
          description: "Create animation hooks (useScrollTrigger, useParallax, useReducedMotion, useCustomCursor)",
          files: [
            `${this.outputDir}/src/hooks/useScrollTrigger.ts`,
            `${this.outputDir}/src/hooks/useParallax.ts`,
            `${this.outputDir}/src/hooks/useReducedMotion.ts`,
            `${this.outputDir}/src/hooks/useCustomCursor.ts`,
          ],
          action: "create",
        },
        {
          id: "utilities",
          description: "Create animation utility files and variant presets",
          files: [
            `${this.outputDir}/src/lib/animations.ts`,
            `${this.outputDir}/src/lib/motion-variants.ts`,
          ],
          action: "create",
        },
        {
          id: "cursor",
          description: "Create custom cursor component",
          files: [`${this.outputDir}/src/components/shared/CustomCursor.tsx`],
          action: "create",
        },
        {
          id: "preloader",
          description: "Create preloader animation component",
          files: [`${this.outputDir}/src/components/shared/Preloader.tsx`],
          action: "create",
        },
        {
          id: "section-animations",
          description: "Add animation wrappers and scroll triggers to section components",
          files: [`${this.outputDir}/src/components/shared/AnimatedSection.tsx`],
          action: "create",
        },
      ],
      estimatedFiles: 10,
      estimatedTokens: 50000,
    };
  }

  async execute(input: Input, _plan: AgentPlan): Promise<Output> {
    const hooks: string[] = [];
    const utilities: string[] = [];
    const modifiedComponents: Output["modifiedComponents"] = [];

    // Step 1: useReducedMotion hook
    this.updateSpinner("Creating useReducedMotion hook...");
    const reducedMotionCode = await this.askClaudeForCode(
      `Create a React hook "useReducedMotion" that:
- Returns true if the user has prefers-reduced-motion enabled
- Uses matchMedia to detect the preference
- Updates reactively if the preference changes
- Returns a boolean

Export as named export. Use TypeScript.`
    );
    const reducedMotionPath = `${this.outputDir}/src/hooks/useReducedMotion.ts`;
    await this.fileOps.writeFile(reducedMotionPath, reducedMotionCode);
    hooks.push(reducedMotionPath);

    // Step 2: useScrollTrigger hook
    this.updateSpinner("Creating useScrollTrigger hook...");
    const scrollTriggerCode = await this.askClaudeForCode(
      `Create a React hook "useScrollTrigger" that wraps GSAP ScrollTrigger. It should:
- Accept a ref to the target element
- Accept options: { start, end, scrub, pin, markers (dev only), onEnter, onLeave, onEnterBack }
- Register the ScrollTrigger on mount and clean up on unmount
- Import gsap and ScrollTrigger from "gsap" and "gsap/ScrollTrigger"
- Register the ScrollTrigger plugin
- Check useReducedMotion and disable if needed
- Return { isActive, progress } where progress is 0-1

Export as named export. TypeScript. Import useReducedMotion from "./useReducedMotion".`
    );
    const scrollTriggerPath = `${this.outputDir}/src/hooks/useScrollTrigger.ts`;
    await this.fileOps.writeFile(scrollTriggerPath, scrollTriggerCode);
    hooks.push(scrollTriggerPath);

    // Step 3: useParallax hook
    this.updateSpinner("Creating useParallax hook...");
    const parallaxCode = await this.askClaudeForCode(
      `Create a React hook "useParallax" that:
- Accepts a ref and a speed multiplier (default 0.5)
- Uses GSAP ScrollTrigger to create a parallax effect
- Moves the element on Y axis relative to scroll position
- Respects prefers-reduced-motion (disable parallax if true)
- Cleans up on unmount
- Import useReducedMotion from "./useReducedMotion"

Export as named export. TypeScript.`
    );
    const parallaxPath = `${this.outputDir}/src/hooks/useParallax.ts`;
    await this.fileOps.writeFile(parallaxPath, parallaxCode);
    hooks.push(parallaxPath);

    // Step 4: useCustomCursor hook
    this.updateSpinner("Creating useCustomCursor hook...");
    if (input.customCursor) {
      const cursorHookCode = await this.askClaudeForCode(
        `Create a React hook "useCustomCursor" that:
- Tracks mouse position with requestAnimationFrame for smooth updates
- Returns { x, y, isHovering } state
- Sets isHovering=true when mouse is over interactive elements (a, button, [role="button"])
- Uses event delegation on document
- Cleans up listeners on unmount
- Disables on touch devices (check navigator.maxTouchPoints)

Export as named export. TypeScript.`
      );
      const cursorHookPath = `${this.outputDir}/src/hooks/useCustomCursor.ts`;
      await this.fileOps.writeFile(cursorHookPath, cursorHookCode);
      hooks.push(cursorHookPath);
    }

    // Step 5: Motion variants library
    this.updateSpinner("Creating animation variants...");
    const variantsCode = await this.askClaudeForCode(
      `Create a motion variants library file for Framer Motion. Export named objects:

1. fadeInUp - entrance animation (opacity 0→1, y 30→0)
2. fadeInDown - entrance from above
3. fadeInLeft / fadeInRight - horizontal entrances
4. scaleIn - scale from 0.8 to 1 with opacity
5. staggerContainer - parent that staggers children by 0.1s
6. staggerItem - child variant for stagger
7. heroTextReveal - staggered word reveal with clip-path
8. cardHover - scale 1.02, slight shadow increase on hover
9. navbarVariants - transparent→glass transition based on scroll
10. preloaderExit - scale up and fade out

Each should use Framer Motion's Variants type. Include transition properties (duration, ease).
Use "easeOut" for entrances, spring for interactive.
Intensity level: ${input.intensity}.

TypeScript file, import { Variants } from "framer-motion".`
    );
    const variantsPath = `${this.outputDir}/src/lib/motion-variants.ts`;
    await this.fileOps.writeFile(variantsPath, variantsCode);
    utilities.push(variantsPath);

    // Step 6: Animation utilities
    this.updateSpinner("Creating animation utilities...");
    const animUtilsCode = await this.askClaudeForCode(
      `Create an animations utility file with:

1. initGSAP() - registers ScrollTrigger and any other GSAP plugins
2. createScrollEntrance(element, options) - GSAP tween that fades/slides element in on scroll
3. createStaggerEntrance(parent, childSelector, options) - stagger children entrances
4. createCounterAnimation(element, target, duration) - animate number from 0 to target
5. createMarqueeAnimation(element) - infinite horizontal scroll
6. killAllAnimations() - cleanup function for unmount

Import gsap and ScrollTrigger. Use TypeScript. All functions should check prefers-reduced-motion.`
    );
    const animUtilsPath = `${this.outputDir}/src/lib/animations.ts`;
    await this.fileOps.writeFile(animUtilsPath, animUtilsCode);
    utilities.push(animUtilsPath);

    // Step 7: Custom cursor component
    let customCursorPath: string | undefined;
    if (input.customCursor) {
      this.updateSpinner("Creating custom cursor component...");
      const cursorCode = await this.askClaudeForCode(
        `Create a React component "CustomCursor" that renders a custom cursor overlay:

- Renders a dot (8px) and ring (40px) that follow the mouse
- Uses framer-motion for smooth interpolation (useSpring)
- The ring expands to 60px and changes color when hovering interactive elements
- Uses mix-blend-mode: difference for contrast on any background
- Hidden on touch devices
- Uses the useCustomCursor hook from "@/hooks/useCustomCursor"
- Respects prefers-reduced-motion (just show default cursor)
- Positioned fixed, pointer-events: none, z-index: 9999

Import from "@/hooks/useCustomCursor" and "@/hooks/useReducedMotion".
Use Tailwind classes where possible. TypeScript + React.`
      );
      customCursorPath = `${this.outputDir}/src/components/shared/CustomCursor.tsx`;
      await this.fileOps.writeFile(customCursorPath, cursorCode);
    }

    // Step 8: Preloader component
    this.updateSpinner("Creating preloader component...");
    const preloaderCode = await this.askClaudeForCode(
      `Create a React component "Preloader" for the Aletheia AI website:

- Full-screen overlay (fixed, z-50, bg-primary-950)
- Centered Aletheia AI logo/text with pulsing animation
- Minimum display time: 1.5 seconds
- Accepts onComplete callback prop
- Exit animation: logo scales up slightly, entire overlay fades out
- Uses Framer Motion AnimatePresence for exit
- After exit, calls onComplete and unmounts

Props: { onComplete: () => void, minDuration?: number }
Use Tailwind classes. Import motion from "framer-motion". TypeScript.`
    );
    const preloaderPath = `${this.outputDir}/src/components/shared/Preloader.tsx`;
    await this.fileOps.writeFile(preloaderPath, preloaderCode);
    modifiedComponents.push({
      path: preloaderPath,
      animationsAdded: ["preloader-pulse", "preloader-exit"],
    });

    // Step 9: AnimatedSection wrapper
    this.updateSpinner("Creating AnimatedSection wrapper...");
    const animSectionCode = await this.askClaudeForCode(
      `Create a React component "AnimatedSection" that wraps any section with scroll-triggered entrance animation:

- Uses Framer Motion's motion.section with whileInView
- Accepts children, className, animation variant (fadeInUp default), delay, once (default true)
- Uses IntersectionObserver under the hood (viewport amount 0.2)
- Respects reduced motion (instant render if preferred)
- Accepts id prop for section identification

Props: { children, className?, id?, variant?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn", delay?: number, once?: boolean }
Import variants from "@/lib/motion-variants". TypeScript + React.`
    );
    const animSectionPath = `${this.outputDir}/src/components/shared/AnimatedSection.tsx`;
    await this.fileOps.writeFile(animSectionPath, animSectionCode);
    utilities.push(animSectionPath);

    return {
      modifiedComponents,
      hooks,
      utilities,
      customCursorPath,
    };
  }

  async validate(output: Output): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (output.hooks.length < 3) {
      warnings.push("Expected at least 3 animation hooks");
    }

    for (const hookPath of output.hooks) {
      const exists = await this.fileOps.fileExists(hookPath);
      if (!exists) errors.push(`Hook not found: ${hookPath}`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }
}
