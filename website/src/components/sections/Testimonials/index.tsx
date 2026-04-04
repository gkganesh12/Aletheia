"use client";

import { motion } from "framer-motion";
import { Container, SectionHeading, GlassPanel } from "@/components/ui";
import { copy } from "@/data/copy";
import { testimonials } from "@/data/testimonials";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import AnimatedSection from "@/components/shared/AnimatedSection";

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white/[0.015]">
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
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={staggerItem}>
              <GlassPanel className="p-6 h-full flex flex-col">
                {/* Decorative quote mark */}
                <span
                  className="select-none text-4xl leading-none text-[--color-accent-400]/30 mb-2"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="flex-1 text-sm italic leading-relaxed text-white/70">
                  {t.quote}
                </p>

                {/* Author */}
                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <p className="text-sm font-bold text-white">{t.author}</p>
                  <p className="text-xs text-white/50">
                    {t.role}, {t.company}
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
