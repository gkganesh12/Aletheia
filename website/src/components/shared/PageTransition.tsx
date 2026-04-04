import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const variants: any = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
