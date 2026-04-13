import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  gradient?: boolean;
  gradientWords?: string[];
}

export default function SplitText({
  text,
  className = "",
  charClassName = "",
  delay = 0,
  staggerDelay = 0.03,
  once = true,
  gradient = false,
  gradientWords = [],
}: SplitTextProps) {
  const words = text.split(" ");
  const gradientSet = new Set(
    gradientWords.map((w) => w.replace(/[.,!?]$/, ""))
  );

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {words.map((word, wordIndex) => {
        const cleanWord = word.replace(/[.,!?]$/, "");
        const punctuation = word.slice(cleanWord.length);
        const isGradientWord = gradient && gradientSet.has(cleanWord);

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => {
              const globalIndex =
                words
                  .slice(0, wordIndex)
                  .reduce((acc, w) => acc + w.length + 1, 0) + charIndex;

              return (
                <motion.span
                  key={`${wordIndex}-${charIndex}`}
                  className={cn(
                    "inline-block",
                    charClassName,
                    isGradientWord &&
                      !punctuation.includes(char) &&
                      "bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
                  )}
                  style={
                    isGradientWord && !punctuation.includes(char)
                      ? { backgroundImage: "linear-gradient(135deg, #8b5cf6, #6366f1, #06b6d4)" }
                      : undefined
                  }
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                      rotateX: -90,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.5,
                        delay: delay + globalIndex * staggerDelay,
                        ease: [0.215, 0.61, 0.355, 1],
                      },
                    },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </motion.span>
  );
}
