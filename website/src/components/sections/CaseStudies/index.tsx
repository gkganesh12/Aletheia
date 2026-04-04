"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, GlassPanel } from "@/components/ui";
import { copy } from "@/data/copy";
import { caseStudies } from "@/data/caseStudies";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import AnimatedSection from "@/components/shared/AnimatedSection";

/* ────────────────────────────────────────────────────────────────────── */
/*  Industry badge colour map                                            */
/* ────────────────────────────────────────────────────────────────────── */

const industryColor: Record<string, string> = {
  "Financial Services": "border-emerald-400/30 text-emerald-400",
  Healthcare: "border-rose-400/30 text-rose-400",
  "E-Commerce & Fintech": "border-amber-400/30 text-amber-400",
  "Supply Chain & Logistics": "border-violet-400/30 text-violet-400",
};

function getIndustryClasses(industry: string): string {
  return industryColor[industry] ?? "border-white/20 text-white/60";
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-16 lg:py-24">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline={copy.caseStudies.overline}
            heading={copy.caseStudies.heading}
            description={copy.caseStudies.description}
          />
        </AnimatedSection>

        {/* ── Mobile: horizontal scroll  |  Desktop: 2-col grid ──────── */}
        <motion.div
          className={cn(
            // Mobile: horizontal scroll
            "flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4",
            "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0",
            // Desktop: grid
            "lg:grid lg:grid-cols-2 lg:overflow-visible lg:snap-none lg:pb-0",
            // Hide scrollbar
            "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          )}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {caseStudies.map((study) => (
            <motion.div
              key={study.id}
              variants={staggerItem}
              className="snap-start shrink-0 w-[85vw] sm:w-[70vw] lg:w-auto"
            >
              <GlassPanel className="p-6 h-full flex flex-col">
                {/* Industry badge */}
                <span
                  className={cn(
                    "inline-block self-start rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider mb-4",
                    getIndustryClasses(study.industry),
                  )}
                >
                  {study.industry}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white leading-snug mb-3">
                  {study.title}
                </h3>

                {/* Client */}
                <p className="text-sm text-white/40 mb-4">{study.client}</p>

                {/* Challenge */}
                <p className="text-sm leading-relaxed text-white/60 mb-6">
                  {study.challenge}
                </p>

                {/* Results */}
                <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">
                    Key Results
                  </p>
                  <ul className="space-y-2">
                    {study.results.map((result, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-white/70"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-400/10 text-xs font-bold text-accent-400">
                          {idx + 1}
                        </span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
