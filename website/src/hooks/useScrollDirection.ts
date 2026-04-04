import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  /** Minimum scroll delta (px) before a direction change registers. Default 5. */
  threshold?: number;
  /** Debounce wait (ms). Default 50. */
  debounce?: number;
}

/**
 * Tracks vertical scroll direction.  Returns `"up"`, `"down"`, or `null`
 * (when scroll position is at the very top or before any scroll event fires).
 *
 * Debounced so rapid micro-scrolls don't cause navbar flicker.
 */
export function useScrollDirection(
  options: UseScrollDirectionOptions = {},
): ScrollDirection {
  const { threshold = 5, debounce = 50 } = options;

  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const updateDirection = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      if (Math.abs(delta) < threshold) {
        ticking.current = false;
        return;
      }

      setDirection(delta > 0 ? "down" : "up");
      lastY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        if (!ticking.current) {
          ticking.current = true;
          requestAnimationFrame(updateDirection);
        }
      }, debounce);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, [threshold, debounce]);

  return direction;
}
