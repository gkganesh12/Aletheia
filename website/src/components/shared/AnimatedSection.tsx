import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Extra delay (seconds) before the entrance animation starts. Default 0. */
  delay?: number;
  /** If true (default), the animation only triggers the first time the element
   *  scrolls into view. Set to false to re-animate on every viewport entry. */
  once?: boolean;
}

/**
 * Wrapper that fades-in and slides-up its children when they enter the
 * viewport.  Uses Framer Motion's `whileInView` so no external hook is needed.
 *
 * ```tsx
 * <AnimatedSection delay={0.2}>
 *   <h2>Hello</h2>
 * </AnimatedSection>
 * ```
 */
export default function AnimatedSection({
  children,
  className,
  delay = 0,
  once = true,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // custom ease-out
      }}
    >
      {children}
    </motion.div>
  );
}
