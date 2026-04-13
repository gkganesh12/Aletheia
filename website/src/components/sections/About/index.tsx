"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui";
import { SectionHeading } from "@/components/ui";
import { copy } from "@/data/copy";

/* ── Animation variants ─────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── Highlighted paragraph ───────────────────────────────────────────── */

function HighlightedParagraph({
  text,
  highlight,
  className,
}: {
  text: string;
  highlight: string;
  className?: string;
}) {
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return <p className={className}>{text}</p>;

  return (
    <p className={className}>
      {text.slice(0, idx)}
      <span
        className="font-medium"
        style={{
          backgroundImage: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text.slice(idx, idx + highlight.length)}
      </span>
      {text.slice(idx + highlight.length)}
    </p>
  );
}

/* ── About Section (Homepage — no photo, minimal) ────────────────────── */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-36">
      <Container>
        <motion.div
          style={{ y: textY }}
          className="mx-auto max-w-4xl"
        >
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <SectionHeading
              overline={copy.about.overline}
              heading={copy.about.heading}
              align="center"
            />
          </motion.div>

          {/* Paragraph */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-8 text-center"
          >
            <HighlightedParagraph
              text={copy.about.paragraph}
              highlight="engineering-first"
              className={cn(
                "mx-auto max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl",
              )}
            />
          </motion.div>

          {/* Stats row — clean numbers, no boxes */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 grid grid-cols-2 gap-4 sm:mt-16 sm:grid-cols-4 sm:gap-8"
          >
            {[
              { value: "3", label: "Products Shipped", color: "#8b5cf6" },
              { value: "10+", label: "Projects Delivered", color: "#6366f1" },
              { value: "Full-Stack", label: "AI to Deploy", color: "#818cf8" },
              { value: "Fast", label: "Idea → MVP", color: "#06b6d4" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={statItem} className="text-center">
                <span
                  className="mono text-2xl font-bold lg:text-3xl"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <p className="mono mt-1 text-[11px] uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </Container>
    </section>
  );
}
