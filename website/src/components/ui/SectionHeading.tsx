import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Small uppercase label rendered above the heading. */
  overline: string;
  /** Main heading text. */
  heading: string;
  /** Optional supporting paragraph beneath the heading. */
  description?: string;
  /** Text alignment. @default "center" */
  align?: "left" | "center";
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

function SectionHeading({
  overline,
  heading,
  description,
  align = "center",
  className,
  ...rest
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        isCenter && "text-center",
        className,
      )}
      {...rest}
    >
      {/* Overline */}
      <p
        className={cn(
          "mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-400",
          isCenter && "mx-auto",
        )}
      >
        {overline}
      </p>

      {/* Heading */}
      <h2
        className={cn(
          "text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl",
          isCenter && "mx-auto max-w-3xl",
        )}
      >
        {heading}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-white/60 md:text-lg",
            isCenter && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export { SectionHeading };
