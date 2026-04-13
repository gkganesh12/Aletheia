import { motion } from "framer-motion";

const orbs = [
  {
    id: 1,
    size: 700,
    x: "45%",
    y: "-15%",
    color: "#8b5cf6",
    opacity: 0.16,
    duration: 20,
    scale: [1, 1.2, 0.9, 1.1, 1],
    xOffset: [0, 50, -30, 20, 0],
    yOffset: [0, -40, 30, -20, 0],
  },
  {
    id: 2,
    size: 500,
    x: "-5%",
    y: "50%",
    color: "#6366f1",
    opacity: 0.1,
    duration: 25,
    scale: [1, 0.85, 1.15, 0.95, 1],
    xOffset: [0, 40, -50, 30, 0],
    yOffset: [0, 30, -40, 50, 0],
  },
  {
    id: 3,
    size: 400,
    x: "75%",
    y: "60%",
    color: "#06b6d4",
    opacity: 0.06,
    duration: 22,
    scale: [1, 1.3, 0.85, 1.1, 1],
    xOffset: [0, -60, 40, -20, 0],
    yOffset: [0, 50, -30, 40, 0],
  },
  {
    id: 4,
    size: 300,
    x: "85%",
    y: "10%",
    color: "#7c3aed",
    opacity: 0.05,
    duration: 18,
    scale: [1, 1.1, 0.9, 1.2, 1],
    xOffset: [0, -30, 50, -40, 0],
    yOffset: [0, -20, 40, -30, 0],
  },
];

export default function MorphingOrbs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            opacity: orb.opacity,
            filter: "blur(40px)",
          }}
          animate={{
            scale: orb.scale,
            x: orb.xOffset,
            y: orb.yOffset,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
