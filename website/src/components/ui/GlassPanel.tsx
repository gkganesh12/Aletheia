import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Intensity map                                                         */
/* ────────────────────────────────────────────────────────────────────── */

const intensityStyles = {
  subtle:
    "backdrop-blur-md bg-white/[0.02] border border-white/[0.05]",
  default:
    "backdrop-blur-xl bg-white/[0.04] border border-white/[0.08]",
  strong:
    "backdrop-blur-2xl bg-white/[0.08] border border-white/[0.12]",
} as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export type GlassPanelIntensity = keyof typeof intensityStyles;

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Controls the blur / opacity intensity. @default "default" */
  intensity?: GlassPanelIntensity;
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ intensity = "default", className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-colors duration-300 ease-out",
          intensityStyles[intensity],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
