import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export interface AnimatedCounterProps {
  /** The number to count up to. */
  target: number;
  /** Animation duration in milliseconds. @default 2000 */
  duration?: number;
  /** Text appended after the number (e.g. "+", "%"). */
  suffix?: string;
  /** Text prepended before the number (e.g. "$"). */
  prefix?: string;
  /** Additional class names for the wrapping `<span>`. */
  className?: string;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Easing: easeOutExpo — fast start, slow finish                        */
/* ────────────────────────────────────────────────────────────────────── */

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  /* ── Counting logic ─────────────────────────────────────────────── */

  const startCounting = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let rafId: number;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      // Use integer display if the target is an integer; otherwise preserve
      // up to two decimal places.
      const current = easedProgress * target;
      setDisplayValue(
        Number.isInteger(target) ? Math.round(current) : parseFloat(current.toFixed(2)),
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [duration, target]);

  /* ── IntersectionObserver: trigger when element is visible ──────── */

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [startCounting]);

  /* ── Format number with locale-aware separators ────────────────── */

  const formatted = Number.isInteger(target)
    ? displayValue.toLocaleString()
    : displayValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

  return (
    <span ref={containerRef} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export { AnimatedCounter };
