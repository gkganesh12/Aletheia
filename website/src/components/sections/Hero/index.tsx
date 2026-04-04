"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { copy } from "@/data/copy";
import FloatingParticles from "@/components/shared/FloatingParticles";
import MorphingOrbs from "@/components/shared/MorphingOrbs";
import SplitText from "@/components/shared/SplitText";
import MagneticButton from "@/components/shared/MagneticButton";
import OrbitalRings from "@/components/shared/OrbitalRings";
import TypeWriter from "@/components/shared/TypeWriter";
// LuminousBorder removed — letting the hero text breathe

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED GRID — responds to mouse position with 3D perspective
   ═══════════════════════════════════════════════════════════════════════ */

function AnimatedGrid() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 30 });
  const perspectiveX = useTransform(springX, [0, 1], [-5, 5]);
  const perspectiveY = useTransform(springY, [0, 1], [5, -5]);

  return (
    <motion.div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        rotateX: perspectiveY,
        rotateY: perspectiveX,
        transformPerspective: 1000,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
      }}
    />
  );
}

/* Floating stats removed — keeping hero clean */

/* ═══════════════════════════════════════════════════════════════════════
   SCROLL INDICATOR — mouse wheel with animated dot
   ═══════════════════════════════════════════════════════════════════════ */

/* ScrollIndicator removed */

/* ═══════════════════════════════════════════════════════════════════════
   TYPEWRITER PHRASES
   ═══════════════════════════════════════════════════════════════════════ */

const typewriterPhrases = [
  "AI Products & Platforms",
  "MVP Development",
  "Full-Stack Engineering",
  "Cloud Infrastructure & DevOps",
  "Cybersecurity & Threat Intelligence",
  "AI Agent Development",
  "Data Engineering & ML Pipelines",
];

/* ═══════════════════════════════════════════════════════════════════════
   HERO SECTION — Premium scroll-driven experience
   ═══════════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Framer Motion scroll-linked transforms */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  // blur removed — clean fade only
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const orbsY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [0.03, 0]);
  const ringsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const ringsScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.85]);
  // statsOpacity removed with floating stats
  // contentFilter removed

  /* GSAP for background parallax */
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-bg-layer", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* ── BG Layer 0: Morphing orbs ──────────────────────────────── */}
      <motion.div style={{ y: orbsY, scale: bgScale }} className="hero-bg-layer">
        <MorphingOrbs />
      </motion.div>

      {/* ── BG Layer 1: Animated perspective grid ─────────────────── */}
      <motion.div style={{ opacity: gridOpacity }}>
        <AnimatedGrid />
      </motion.div>

      {/* ── BG Layer 2: Floating particles ────────────────────────── */}
      <FloatingParticles />

      {/* ── BG Layer 3: Orbital ring system (centerpiece) ─────────── */}
      <motion.div
        style={{ opacity: ringsOpacity, scale: ringsScale }}
        className="absolute inset-0"
      >
        <OrbitalRings />
      </motion.div>

      {/* ── BG Layer 4: Edge gradient fades ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-950)]/80 via-transparent to-[var(--color-primary-950)]" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-primary-950)]/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-primary-950)]/60 to-transparent" />
      </div>

      {/* Floating stats removed — keeping hero clean */}

      {/* ── Main content (scroll-parallax + blur + scale) ─────────── */}
      <motion.div
        className="relative z-10 flex min-h-screen items-center justify-center pt-24"
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          {/* ── Overline badge ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-400)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent-400)]" />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/50">
                Engineering-First AI Company
              </span>
            </span>
          </motion.div>

          {/* ── Headline — character-by-character reveal ────────── */}
          <h1
            className={cn(
              "text-4xl font-bold leading-[1.05] tracking-tight text-white",
              "sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]",
              "font-[var(--font-heading)]"
            )}
          >
            <SplitText
              text={copy.hero.headline}
              delay={0.8}
              staggerDelay={0.025}
              gradient
              gradientWords={["Smarter.", "Faster.", "Everything."]}
            />
          </h1>

          {/* ── Subheadline ──────────────────────────────────────── */}
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/45 sm:text-lg md:text-xl lg:text-[1.35rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.0, ease: [0.215, 0.61, 0.355, 1] }}
          >
            {copy.hero.subheadline}
          </motion.p>

          {/* ── Typewriter rotating taglines ──────────────────────── */}
          <motion.div
            className="mt-6 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            <span className="text-sm font-medium text-[var(--color-accent-400)]/70">
              <TypeWriter
                phrases={typewriterPhrases}
                typingSpeed={55}
                deletingSpeed={30}
                pauseDuration={2500}
              />
            </span>
          </motion.div>

          {/* ── Accent divider ───────────────────────────────────── */}
          <motion.div
            className="mx-auto mt-10 h-px w-64 origin-center"
            style={{
              background: "linear-gradient(90deg, transparent, var(--color-accent-400), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.4 }}
            transition={{ duration: 1.2, delay: 2.8, ease: "easeOut" }}
          />

          {/* ── CTA buttons — magnetic ───────────────────────────── */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.9, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <MagneticButton
              strength={0.15}
              onClick={() => {
                const el = document.getElementById("services");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
            >
              <Button variant="primary" size="lg" className="glow-sm">
                {copy.hero.ctaPrimary}
              </Button>
            </MagneticButton>

            <MagneticButton
              strength={0.15}
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80;
                  window.scrollTo({ top: y, behavior: "smooth" });
                }
              }}
            >
              <Button variant="ghost" size="lg">
                {copy.hero.ctaSecondary}
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Trusted by removed — logo carousel handles this */}
        </div>
      </motion.div>

      {/* Scroll indicator removed */}
    </section>
  );
}
