import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Gradient start colour. @default "#00d4ff" */
  from?: string;
  /** Gradient end colour. @default "#0077ff" */
  to?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

function GradientText({
  children,
  from = "#00d4ff",
  to = "#0077ff",
  className,
  style,
  ...rest
}: GradientTextProps) {
  const gradientStyle: CSSProperties = {
    ...style,
    backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
  };

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        // Webkit prefixed property for Safari support
        "[-webkit-background-clip:text] [-webkit-text-fill-color:transparent]",
        className,
      )}
      style={gradientStyle}
      {...rest}
    >
      {children}
    </span>
  );
}

export { GradientText };
