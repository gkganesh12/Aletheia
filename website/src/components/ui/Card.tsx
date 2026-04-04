import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Variant map                                                           */
/* ────────────────────────────────────────────────────────────────────── */

const variantStyles = {
  glass:
    "backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl",
  bordered:
    "bg-transparent border border-white/[0.12] rounded-2xl",
  elevated:
    "bg-white/[0.04] rounded-2xl shadow-lg shadow-black/20",
} as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export type CardVariant = keyof typeof variantStyles;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style variant. @default "glass" */
  variant?: CardVariant;
  /** Enable hover lift / glow effect. @default false */
  hover?: boolean;
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "glass", hover = false, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base
          "relative overflow-hidden transition-all duration-300 ease-out",
          // Variant
          variantStyles[variant],
          // Hover lift
          hover && [
            "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25",
            variant === "glass" && "hover:bg-white/[0.06] hover:border-white/[0.15]",
            variant === "bordered" && "hover:border-white/[0.2]",
            variant === "elevated" && "hover:bg-white/[0.06]",
          ],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
