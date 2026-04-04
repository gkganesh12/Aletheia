import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface LuminousBorderProps {
  children: ReactNode;
  className?: string;
  borderRadius?: string;
  duration?: number;
  color?: string;
}

/**
 * A container with an animated light beam that traces around its border.
 * Uses a rotating conic gradient behind a padded inner container.
 */
export default function LuminousBorder({
  children,
  className = "",
  borderRadius = "1.5rem",
  duration = 4,
  color = "var(--color-accent-400)",
}: LuminousBorderProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ borderRadius }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <motion.div
          className="absolute inset-[-50%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${color} 8%, transparent 16%, transparent 100%)`,
            opacity: 0.85,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Static subtle border glow */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius,
          border: `1px solid rgba(255, 255, 255, 0.06)`,
          boxShadow: `inset 0 0 30px rgba(0, 212, 255, 0.03)`,
        }}
      />

      {/* Inner content container (masks the rotating gradient, leaving only the border visible) */}
      <div
        className="relative m-px bg-[var(--color-primary-950)]"
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
