import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════
   Data nodes on the rings — labeled with Aletheia's domains
   ═══════════════════════════════════════════════════════════════════════ */

interface OrbNode {
  angle: number;
  ring: number;
  size: number;
  label?: string;
  pulse?: boolean;
  color: string;
}

const nodes: OrbNode[] = [
  // Ring 1 — Core AI
  { angle: 0, ring: 1, size: 7, label: "AI", pulse: true, color: "#8b5cf6" },
  { angle: 72, ring: 1, size: 4, color: "#a78bfa" },
  { angle: 144, ring: 1, size: 6, label: "ML", pulse: true, color: "#7c3aed" },
  { angle: 216, ring: 1, size: 4, color: "#818cf8" },
  { angle: 288, ring: 1, size: 5, label: "LLM", color: "#6366f1" },
  // Ring 2 — Engineering
  { angle: 20, ring: 2, size: 6, label: "SEC", pulse: true, color: "#6366f1" },
  { angle: 80, ring: 2, size: 3, color: "#818cf8" },
  { angle: 140, ring: 2, size: 6, label: "API", color: "#7c3aed" },
  { angle: 200, ring: 2, size: 4, color: "#a78bfa" },
  { angle: 260, ring: 2, size: 5, label: "CLOUD", color: "#06b6d4" },
  { angle: 320, ring: 2, size: 3, color: "#22d3ee" },
  // Ring 3 — Outer
  { angle: 15, ring: 3, size: 4, color: "#818cf8" },
  { angle: 75, ring: 3, size: 5, label: "OSINT", pulse: true, color: "#06b6d4" },
  { angle: 135, ring: 3, size: 3, color: "#a78bfa" },
  { angle: 195, ring: 3, size: 5, label: "AGENT", color: "#8b5cf6" },
  { angle: 255, ring: 3, size: 4, color: "#6366f1" },
  { angle: 315, ring: 3, size: 5, label: "THREAT", color: "#7c3aed" },
];

const ringRadii = [140, 220, 310];
const ringSpeeds = [30, 45, 65];
const ringDirections = [1, -1, 1];
const ringColors = ["#8b5cf6", "#6366f1", "#06b6d4"];

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
  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <motion.div
        className="relative w-full max-w-[680px]"
        style={{
          aspectRatio: "1 / 1",
          rotateX,
          rotateY,
          transformPerspective: 800,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Center glow — pulsing violet */}
        <div
          className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, #6366f1 30%, transparent 70%)",
            opacity: 0.35,
            filter: "blur(20px)",
          }}
        />

        {/* Center dot */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]"
          animate={{
            boxShadow: [
              "0 0 8px #8b5cf6, 0 0 20px #6366f1",
              "0 0 16px #8b5cf6, 0 0 40px #6366f1",
              "0 0 8px #8b5cf6, 0 0 20px #6366f1",
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
            {/* Ring circle */}
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
                stroke={`${ringColors[ringIndex]}20`}
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
                    animate={{ rotate: -360 * ringDirections[ringIndex] }}
                    transition={{
                      duration: ringSpeeds[ringIndex],
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {/* Node dot — individually colored */}
                    <motion.div
                      className="rounded-full"
                      style={{
                        width: node.size,
                        height: node.size,
                        backgroundColor: node.color,
                      }}
                      animate={
                        node.pulse
                          ? {
                              boxShadow: [
                                `0 0 ${node.size}px ${node.color}`,
                                `0 0 ${node.size * 3}px ${node.color}`,
                                `0 0 ${node.size}px ${node.color}`,
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

                    {/* Label — gradient text */}
                    {node.label && (
                      <span
                        className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-wider"
                        style={{ color: `${node.color}70` }}
                      >
                        {node.label}
                      </span>
                    )}
                  </motion.div>
                );
              })}
          </motion.div>
        ))}

        {/* Connecting lines from center */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 680 680"
          preserveAspectRatio="xMidYMid meet"
        >
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 340 + 308 * Math.cos(rad);
            const y2 = 340 + 308 * Math.sin(rad);
            const colors = ["#8b5cf6", "#6366f1", "#06b6d4", "#8b5cf6", "#6366f1", "#06b6d4"];
            return (
              <motion.line
                key={angle}
                x1="340"
                y1="340"
                x2={x2}
                y2={y2}
                stroke={`${colors[i]}10`}
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
