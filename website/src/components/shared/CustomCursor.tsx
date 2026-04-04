import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const DOT_SIZE = 6;
const RING_SIZE = 32;
const RING_HOVER_SIZE = 48;

const SPRING_CONFIG = { damping: 25, stiffness: 250, mass: 0.5 };

/**
 * Custom cursor composed of a small filled dot and a larger trailing ring.
 *
 * - The ring expands when hovering interactive elements (`a`, `button`).
 * - Hidden on touch-primary devices.
 * - Uses `mix-blend-mode: difference` for universal contrast.
 */
export function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed coordinates for the ring
  const ringX = useSpring(mouseX, SPRING_CONFIG);
  const ringY = useSpring(mouseY, SPRING_CONFIG);

  // Detect touch device once on mount
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(isTouchDevice);
  }, []);

  // Track mouse position + interactive-element hover state
  useEffect(() => {
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isTouch, mouseX, mouseY]);

  // Don't render anything on touch devices
  if (isTouch) return null;

  const currentRingSize = hovering ? RING_HOVER_SIZE : RING_SIZE;

  return (
    <>
      {/* Dot — follows mouse exactly */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />

      {/* Ring — spring-smoothed follow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-white"
        animate={{
          width: currentRingSize,
          height: currentRingSize,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
