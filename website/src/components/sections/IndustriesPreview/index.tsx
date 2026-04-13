"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, SectionHeading } from "@/components/ui";
import { industries } from "@/data/industries";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const colorMap: Record<string, string> = {
  heart: "#8b5cf6",    // violet — healthcare
  building: "#6366f1",  // indigo — finance
  graduation: "#818cf8", // light indigo — education
  shield: "#7c3aed",    // deep violet — insurance
  scale: "#06b6d4",     // cyan — legal
};

const iconMap: Record<string, React.ReactNode> = {
  heart: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 10h.01M15 10h.01" />
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function IndustriesPreview() {
  return (
    <section id="industries-preview" className="py-16 lg:py-24 bg-[var(--color-primary-900)]">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline="Industries"
            heading="Expertise Across Verticals"
            description="Deep domain knowledge paired with engineering excellence — tailored solutions for the industries that matter."
            align="center"
          />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {industries.map((industry) => {
            const color = colorMap[industry.icon] ?? "#8b5cf6";
            return (
              <motion.div key={industry.slug} variants={staggerItem}>
                <Link
                  to="/industries"
                  className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 text-center transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] sm:p-6"
                >
                  {/* Colored top accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                  />

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse at top, ${color}15, transparent 70%)` }}
                  />

                  <div
                    className="relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}25`,
                      color,
                    }}
                  >
                    {iconMap[industry.icon] ?? iconMap.shield}
                  </div>
                  <h3 className="relative mt-3 text-sm font-semibold text-white">
                    {industry.name}
                  </h3>
                  <p className="relative mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">
                    {industry.description.split(".")[0]}.
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
