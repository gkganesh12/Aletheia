import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns `true` when the user's OS-level accessibility setting requests
 * reduced motion.  Updates reactively if the preference changes at runtime.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener("change", handler);
    // Sync in case the value changed between SSR hydration and effect
    setPrefersReduced(mql.matches);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  return prefersReduced;
}
