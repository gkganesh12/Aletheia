import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypeWriterProps {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({
  phrases,
  className = "",
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  const tick = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      } else {
        // Finished typing, pause then delete
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, isDeleting, isPaused, currentPhrase, pauseDuration, phrases.length]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayText}
          className="inline-block"
          initial={false}
        >
          {displayText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className="ml-0.5 inline-block h-[1.1em] w-[2px] bg-[var(--color-accent-400)]"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}
