"use client";

import { motion } from "framer-motion";
import { Container, SectionHeading } from "@/components/ui";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

const steps = [
  {
    number: "01",
    title: "Discovery & Scoping",
    description:
      "We understand the problem, define the MVP scope and map the architecture — so nothing is wasted.",
    color: "#8b5cf6",
  },
  {
    number: "02",
    title: "Build & Iterate",
    description:
      "Engineering sprints with continuous delivery. You see working code every week, not just slide decks.",
    color: "#7c3aed",
  },
  {
    number: "03",
    title: "Ship & Deploy",
    description:
      "Production-grade deployment on your cloud or ours — CI/CD, monitoring and security baked in from day one.",
    color: "#6366f1",
  },
  {
    number: "04",
    title: "Scale & Harden",
    description:
      "Performance optimization, load testing, security hardening and ongoing support to keep things running at scale.",
    color: "#06b6d4",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-16 lg:py-24">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline="How We Work"
            heading="From Idea to Production"
            description="A proven four-phase engagement that turns ambiguity into shipped, scalable products."
            align="center"
          />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {/* Colored top line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}40)` }}
              />

              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(ellipse at top, ${step.color}10, transparent 70%)` }}
              />

              {/* Step number — large, colored */}
              <span
                className="relative text-4xl font-extrabold font-[var(--font-heading)] sm:text-5xl"
                style={{ color: step.color }}
              >
                {step.number}
              </span>

              {/* Title */}
              <h3 className="relative mt-3 text-lg font-semibold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="relative mt-2 text-sm leading-relaxed text-white/50">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
