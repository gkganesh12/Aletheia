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
        "mb-8 sm:mb-12 md:mb-16",
        isCenter && "text-center",
        className,
      )}
      {...rest}
    >
      {/* Overline — mono, accent colored */}
      <p
        className={cn(
          "mono mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-accent-400)]",
          isCenter && "mx-auto",
        )}
      >
        {overline}
      </p>

      {/* Heading */}
      <h2
        className={cn(
          "text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl",
          isCenter && "mx-auto max-w-3xl",
        )}
      >
        {heading}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-white/55 md:text-lg",
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
