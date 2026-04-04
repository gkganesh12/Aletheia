import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container, AnimatedCounter } from "@/components/ui";
import { stats } from "@/data/stats";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

/* ────────────────────────────────────────────────────────────────────── */
/*  Stats Section                                                        */
/* ────────────────────────────────────────────────────────────────────── */

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-14 lg:py-20 bg-white/[0.015]"
    >
      {/* Subtle background gradient to break page rhythm — parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          y: bgY,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 212, 255, 0.02) 30%, rgba(0, 119, 255, 0.02) 70%, transparent 100%)",
        }}
      />

      <Container>
        <motion.div
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={staggerItem}
              className={cn(
                "relative text-center",
                // Vertical divider on desktop between items (not before the first)
                index > 0 &&
                  "lg:before:absolute lg:before:-left-4 lg:before:top-1/2 lg:before:h-12 lg:before:-translate-y-1/2 lg:before:w-px lg:before:bg-white/10",
              )}
            >
              {/* Counter */}
              <div className="text-4xl font-bold text-white md:text-5xl">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  duration={2200}
                  className="text-4xl font-bold text-white md:text-5xl"
                />
              </div>

              {/* Label */}
              <p className="mt-2 text-sm uppercase tracking-wider text-white/50">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
