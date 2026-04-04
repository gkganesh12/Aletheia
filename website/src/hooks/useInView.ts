import { useCallback, useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** 0-1 visibility ratio required to trigger. Default 0. */
  threshold?: number | number[];
  /** Root margin string, e.g. "-100px 0px". Default "0px". */
  rootMargin?: string;
  /** If true, stays `true` once the element has entered the viewport. Default false. */
  triggerOnce?: boolean;
}

type RefCallback<T extends HTMLElement = HTMLElement> = (node: T | null) => void;

/**
 * Wraps `IntersectionObserver` in a convenient hook.
 *
 * Returns a tuple of `[ref, isInView]`.  Attach `ref` to the element you want
 * to observe; `isInView` becomes `true` when that element satisfies the
 * configured threshold / rootMargin.
 *
 * ```tsx
 * const [ref, isInView] = useInView({ threshold: 0.3, triggerOnce: true });
 * return <div ref={ref}>{isInView && <p>Visible!</p>}</div>;
 * ```
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
): [RefCallback<T>, boolean] {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;

  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<T | null>(null);
  const frozenRef = useRef(false);

  // Clean up any existing observer
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Callback ref — called whenever the observed DOM node changes
  const ref: RefCallback<T> = useCallback(
    (node: T | null) => {
      // Disconnect previous observer
      disconnect();

      nodeRef.current = node;

      // If triggerOnce already fired, nothing more to do
      if (frozenRef.current) return;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const visible = entry.isIntersecting;
          setIsInView(visible);

          if (visible && triggerOnce) {
            frozenRef.current = true;
            disconnect();
          }
        },
        { threshold, rootMargin },
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, triggerOnce, disconnect],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return [ref, isInView];
}
