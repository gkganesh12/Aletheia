import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════
   Data nodes on the rings
   ═══════════════════════════════════════════════════════════════════════ */

interface OrbNode {
  angle: number;
  ring: number;
  size: number;
  label?: string;
  pulse?: boolean;
}

const nodes: OrbNode[] = [
  { angle: 0, ring: 1, size: 6, label: "AI", pulse: true },
  { angle: 72, ring: 1, size: 4 },
  { angle: 144, ring: 1, size: 5, label: "ML" },
  { angle: 216, ring: 1, size: 4 },
  { angle: 288, ring: 1, size: 5 },
  { angle: 30, ring: 2, size: 5, label: "SEC", pulse: true },
  { angle: 90, ring: 2, size: 3 },
  { angle: 150, ring: 2, size: 6, label: "API" },
  { angle: 210, ring: 2, size: 4 },
  { angle: 270, ring: 2, size: 3 },
  { angle: 330, ring: 2, size: 5 },
  { angle: 45, ring: 3, size: 4 },
  { angle: 105, ring: 3, size: 3 },
  { angle: 165, ring: 3, size: 5, label: "NET", pulse: true },
  { angle: 225, ring: 3, size: 4 },
  { angle: 285, ring: 3, size: 3 },
  { angle: 345, ring: 3, size: 4 },
];

const ringRadii = [160, 240, 320];
const ringSpeeds = [30, 45, 65]; // seconds per revolution
const ringDirections = [1, -1, 1]; // alternating directions

/* ═══════════════════════════════════════════════════════════════════════
   Orbital Rings Component
   ═══════════════════════════════════════════════════════════════════════ */

export default function OrbitalRings() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });
  const rotateX = useTransform(springY, [0, 1], [12, -12]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <motion.div
        className="relative"
        style={{
          width: 700,
          height: 700,
          rotateX,
          rotateY,
          transformPerspective: 800,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Center glow */}
        <div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--color-accent-400) 0%, transparent 70%)",
            opacity: 0.4,
            filter: "blur(20px)",
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-400)]"
          animate={{
            boxShadow: [
              "0 0 8px var(--color-accent-400), 0 0 20px var(--color-accent-400)",
              "0 0 16px var(--color-accent-400), 0 0 40px var(--color-accent-400)",
              "0 0 8px var(--color-accent-400), 0 0 20px var(--color-accent-400)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rings */}
        {ringRadii.map((radius, ringIndex) => (
          <motion.div
            key={ringIndex}
            className="absolute left-1/2 top-1/2"
            style={{
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
            }}
            animate={{ rotate: 360 * ringDirections[ringIndex] }}
            transition={{
              duration: ringSpeeds[ringIndex],
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Ring circle (SVG for dashed stroke) */}
            <svg
              className="absolute inset-0"
              width={radius * 2}
              height={radius * 2}
              viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            >
              <circle
                cx={radius}
                cy={radius}
                r={radius - 1}
                fill="none"
                stroke="rgba(0,212,255,0.12)"
                strokeWidth="1"
                strokeDasharray={ringIndex === 1 ? "4 8" : ringIndex === 2 ? "2 12" : "none"}
              />
            </svg>

            {/* Nodes on this ring */}
            {nodes
              .filter((n) => n.ring === ringIndex + 1)
              .map((node, nodeIndex) => {
                const rad = (node.angle * Math.PI) / 180;
                const x = radius + (radius - 1) * Math.cos(rad);
                const y = radius + (radius - 1) * Math.sin(rad);

                return (
                  <motion.div
                    key={nodeIndex}
                    className="absolute"
                    style={{
                      left: x - node.size / 2,
                      top: y - node.size / 2,
                    }}
                    // Counter-rotate so labels stay upright
                    animate={{ rotate: -360 * ringDirections[ringIndex] }}
                    transition={{
                      duration: ringSpeeds[ringIndex],
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {/* Node dot */}
                    <motion.div
                      className="rounded-full bg-[var(--color-accent-400)]"
                      style={{
                        width: node.size,
                        height: node.size,
                      }}
                      animate={
                        node.pulse
                          ? {
                              boxShadow: [
                                `0 0 ${node.size}px var(--color-accent-400)`,
                                `0 0 ${node.size * 3}px var(--color-accent-400)`,
                                `0 0 ${node.size}px var(--color-accent-400)`,
                              ],
                              scale: [1, 1.4, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: nodeIndex * 0.3,
                      }}
                    />

                    {/* Label */}
                    {node.label && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-wider text-white/25">
                        {node.label}
                      </span>
                    )}
                  </motion.div>
                );
              })}
          </motion.div>
        ))}

        {/* Connecting lines (subtle) */}
        <svg
          className="absolute inset-0"
          width="700"
          height="700"
          viewBox="0 0 700 700"
        >
          {/* Radial lines from center */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 350 + 318 * Math.cos(rad);
            const y2 = 350 + 318 * Math.sin(rad);
            return (
              <motion.line
                key={angle}
                x1="350"
                y1="350"
                x2={x2}
                y2={y2}
                stroke="rgba(0,212,255,0.06)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: angle / 360, ease: "easeOut" }}
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
