"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── Helpers ───────────────────────────────────────────────────────────── */

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number; // % from left
  y: number; // starting % from top (bottom area so they drift up)
  size: number; // px
  opacity: number;
  duration: number; // seconds
  delay: number; // seconds
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(0, 100),
    y: randomBetween(60, 110), // start from lower portion
    size: randomBetween(2, 4),
    opacity: randomBetween(0.05, 0.15),
    duration: randomBetween(10, 25),
    delay: randomBetween(0, 8),
  }));
}

/* ── Detect prefers-reduced-motion ─────────────────────────────────────── */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function FloatingParticles() {
  const particles = useMemo(() => {
    const count = prefersReducedMotion() ? 10 : 35;
    return generateParticles(count);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -600, -1200],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
