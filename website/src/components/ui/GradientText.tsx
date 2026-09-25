import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Gradient start colour. @default "#2448FF" */
  from?: string;
  /** Gradient end colour. @default "#FF775E" */
  to?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

function GradientText({
  children,
  from = "#2448FF",
  to = "#FF775E",
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
