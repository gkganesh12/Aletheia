import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const MIN_DISPLAY_MS = 2400;

/**
 * Cinematic preloader — multi-phase reveal:
 * Phase 1: Accent line scales in
 * Phase 2: "ALETHEIA" reveals letter by letter
 * Phase 3: Tagline fades in
 * Phase 4: Everything fades + scales out with blur into the hero
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const letters = "ALETHEIA".split("");

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[var(--color-primary-950)]"
          exit={{
            opacity: 0,
            scale: 1.05,
          }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {/* Top accent line */}
          <motion.div
            className="h-px w-0 bg-gradient-to-r from-transparent via-[var(--color-accent-400)] to-transparent"
            animate={{ width: 120 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />

          {/* Letter-by-letter wordmark */}
          <div className="flex items-center overflow-hidden">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block select-none font-[var(--font-heading)] text-3xl font-bold tracking-[0.25em] text-white sm:text-4xl sm:tracking-[0.35em] md:text-5xl lg:text-6xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + i * 0.06,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.span
            className="text-xs font-medium uppercase tracking-[0.3em] text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Engineering-First AI Company
          </motion.span>

          {/* Bottom accent line */}
          <motion.div
            className="h-px w-0 bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/50 to-transparent"
            animate={{ width: 80 }}
            transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
