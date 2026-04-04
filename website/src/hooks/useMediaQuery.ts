import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * ```ts
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);

    // Sync immediately in case value drifted between render and effect
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mql.addEventListener("change", handler);
    return () => {
      mql.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
