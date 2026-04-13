"use client";

import { Suspense, lazy, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import SplitText from "@/components/shared/SplitText";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

/* ═══════════════════════════════════════════════════════════════════════
   HERO — Statement left, 3D right. Clean, confident, memorable.
   ═══════════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* ── Dot grid background ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Mobile ambient glow (visible only on small screens) ── */}
      <div className="pointer-events-none absolute inset-0 sm:hidden" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
        />
        <div
          className="absolute left-1/4 top-2/3 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
        />
      </div>

      {/* ── Bottom fade ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[var(--color-primary-950)] to-transparent" />

      {/* ── Content — two-column on desktop ─────────────────── */}
      <motion.div
        className="relative z-10 flex min-h-screen items-center px-5 sm:px-6"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Left — text */}
          <div className="max-w-lg sm:max-w-none">
            {/* Overline badge — pill style on mobile, plain text on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] sm:hidden"
                  aria-hidden="true"
                />
                <span className="mono text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 sm:text-white/35">
                  AI Engineering Studio
                </span>
              </span>
            </motion.div>

            <h1
              className={cn(
                "mt-5 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-white",
                "sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl sm:leading-[1.0]",
                "font-[var(--font-heading)]",
              )}
            >
              <SplitText
                text="We Build What Others Pitch."
                delay={0.4}
                staggerDelay={0.03}
                gradient
                gradientWords={["Build", "Others", "Pitch."]}
              />
            </h1>

            <motion.p
              className="mt-5 max-w-md text-[15px] leading-relaxed text-white/45 sm:mt-6 sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              AI products, full-stack platforms and client solutions —
              shipped to production, not slide decks.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  const el = document.getElementById("services");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                See What We Do
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  const el = document.getElementById("contact");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                Work With Us
              </Button>
            </motion.div>

            {/* Mobile-only trust strip */}
            <motion.div
              className="mt-8 flex items-center gap-4 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.3 }}
            >
              {[
                { label: "3 Products", color: "#8b5cf6" },
                { label: "10+ Projects", color: "#6366f1" },
                { label: "Production-Grade", color: "#06b6d4" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — 3D scene (hidden on small mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden aspect-square w-full max-w-[550px] justify-self-center sm:block lg:justify-self-end"
          >
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Mobile scroll indicator ─────────────────────────── */}
      <motion.div
        className="absolute inset-x-0 bottom-8 z-30 flex justify-center sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/20">
            Scroll
          </span>
          <svg
            className="h-4 w-4 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
