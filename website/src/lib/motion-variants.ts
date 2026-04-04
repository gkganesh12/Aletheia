import type { Variants } from "framer-motion";

/* ── Entrance animations ─────────────────────────────────────────────── */

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── Scale entrance ──────────────────────────────────────────────────── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── Stagger container + item ────────────────────────────────────────── */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── Navbar ───────────────────────────────────────────────────────────── */

export const navbarVariants: Variants = {
  transparent: {
    backgroundColor: "rgba(5, 5, 16, 0)",
    backdropFilter: "blur(0px)",
    borderBottomColor: "rgba(255, 255, 255, 0)",
  },
  glass: {
    backgroundColor: "rgba(5, 5, 16, 0.8)",
    backdropFilter: "blur(16px)",
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

/* ── Card hover ──────────────────────────────────────────────────────── */

export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 0 0 rgba(0, 212, 255, 0)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    y: -4,
    boxShadow:
      "0 8px 32px rgba(0, 212, 255, 0.12), 0 2px 12px rgba(0, 119, 255, 0.08)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
