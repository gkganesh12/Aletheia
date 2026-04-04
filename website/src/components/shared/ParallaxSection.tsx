import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Y-axis offset in pixels — positive = moves down slower (default 60) */
  offset?: number;
  /** Also apply a subtle scale effect */
  scale?: boolean;
  /** Also apply a subtle opacity fade */
  fade?: boolean;
}

export default function ParallaxSection({
  children,
  className,
  offset = 60,
  scale: applyScale = false,
  fade = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const scaleVal = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          y,
          ...(applyScale ? { scale: scaleVal } : {}),
          ...(fade ? { opacity } : {}),
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
