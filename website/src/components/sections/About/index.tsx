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
      <span className="text-[var(--color-accent-400)] font-medium">
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
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 lg:py-36">
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
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { value: "3", label: "Products Live" },
              { value: "Full-Stack", label: "AI to Deploy" },
              { value: "99.99%", label: "Uptime" },
              { value: "Fast", label: "Idea → MVP" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={statItem} className="text-center">
                <span className="text-2xl font-bold text-[var(--color-accent-400)] lg:text-3xl">
                  {stat.value}
                </span>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Accent divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-12 h-px w-48 origin-center"
            style={{
              background: "linear-gradient(90deg, transparent, var(--color-accent-400), transparent)",
            }}
          />
        </motion.div>
      </Container>
    </section>
  );
}
