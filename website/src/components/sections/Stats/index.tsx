import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { Container, AnimatedCounter } from "@/components/ui";
import { stats } from "@/data/stats";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

/* ── Per-stat accent colors ──────────────────────────────────────────── */

const statColors = ["#8b5cf6", "#6366f1", "#7c3aed", "#06b6d4"];

/* ────────────────────────────────────────────────────────────────────── */
/*  Stats Section — Monospace numbers, minimal chrome                    */
/* ────────────────────────────────────────────────────────────────────── */

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-14 lg:py-20"
    >
      {/* Subtle background shift */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          y: bgY,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.015) 30%, rgba(99, 102, 241, 0.015) 70%, transparent 100%)",
        }}
      />

      <Container>
        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, index) => {
            const color = statColors[index % statColors.length];
            return (
              <motion.div
                key={stat.id}
                variants={staggerItem}
                className="relative text-center"
              >
                {/* Counter — monospace, colored */}
                <div className="mono text-2xl font-bold sm:text-4xl md:text-5xl" style={{ color }}>
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={2200}
                    className="mono text-2xl font-bold sm:text-4xl md:text-5xl"
                    style={{ color }}
                  />
                </div>

                {/* Label — mono, uppercase */}
                <p className="mono mt-2 text-[11px] uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
