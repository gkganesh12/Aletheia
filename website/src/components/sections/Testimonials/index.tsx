"use client";

import { motion } from "framer-motion";
import { Container, SectionHeading } from "@/components/ui";
import { copy } from "@/data/copy";
import { testimonials } from "@/data/testimonials";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import AnimatedSection from "@/components/shared/AnimatedSection";

/* ── Per-testimonial accent color ──────────────────────────────────── */
const quoteColors = [
  "#8b5cf6", // violet
  "#6366f1", // indigo
  "#06b6d4", // cyan
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-[var(--color-primary-900)]">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline={copy.testimonials.overline}
            heading={copy.testimonials.heading}
            description={copy.testimonials.description}
          />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.slice(0, 3).map((t, i) => {
            const color = quoteColors[i % quoteColors.length];
            return (
              <motion.div key={t.id} variants={staggerItem}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 transition-all duration-300 hover:border-white/[0.12]">
                  {/* Decorative quote mark — colored */}
                  <span
                    className="select-none text-4xl font-bold leading-none mb-2 block sm:text-5xl"
                    style={{ color }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed text-white/65">
                    {t.quote}
                  </p>

                  {/* Author */}
                  <div className="mt-6 border-t border-white/[0.08] pt-4">
                    <p className="text-sm font-bold text-white">{t.author}</p>
                    <p className="mono text-[11px] tracking-wide" style={{ color: `${color}bb` }}>
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
