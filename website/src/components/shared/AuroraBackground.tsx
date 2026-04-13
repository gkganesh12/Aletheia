/**
 * AuroraBackground — Animated gradient mesh that creates a living, breathing
 * aurora effect. Pure CSS keyframes = zero JS overhead.
 */
export default function AuroraBackground() {
  return (
    <>
      <style>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          25%      { transform: translate(5%, -8%) rotate(3deg) scale(1.05); }
          50%      { transform: translate(-3%, 5%) rotate(-2deg) scale(0.95); }
          75%      { transform: translate(7%, 3%) rotate(4deg) scale(1.02); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0%, 0%) rotate(0deg) scale(1); }
          25%      { transform: translate(-6%, 4%) rotate(-3deg) scale(0.97); }
          50%      { transform: translate(4%, -6%) rotate(2deg) scale(1.06); }
          75%      { transform: translate(-5%, -3%) rotate(-4deg) scale(0.98); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33%      { transform: translate(8%, -4%) scale(1.08); }
          66%      { transform: translate(-4%, 7%) scale(0.94); }
        }
        @keyframes scan-line {
          0%   { top: -5%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Layer 1: Violet — dominant, top-left */}
        <div
          className="absolute -left-[10%] -top-[20%] h-[800px] w-[900px] rounded-full opacity-[0.14]"
          style={{
            background: "radial-gradient(ellipse, #8b5cf6, transparent 65%)",
            filter: "blur(60px)",
            animation: "aurora-1 18s ease-in-out infinite",
          }}
        />
        {/* Layer 2: Indigo — center, larger */}
        <div
          className="absolute left-[30%] top-[10%] h-[700px] w-[800px] rounded-full opacity-[0.1]"
          style={{
            background: "radial-gradient(ellipse, #6366f1, transparent 60%)",
            filter: "blur(50px)",
            animation: "aurora-2 22s ease-in-out infinite",
          }}
        />
        {/* Layer 3: Cyan — bottom-right, cool counterpoint */}
        <div
          className="absolute right-[-5%] bottom-[-10%] h-[600px] w-[700px] rounded-full opacity-[0.1]"
          style={{
            background: "radial-gradient(ellipse, #06b6d4, transparent 65%)",
            filter: "blur(50px)",
            animation: "aurora-3 25s ease-in-out infinite",
          }}
        />
        {/* Layer 4: Deep violet — subtle fill */}
        <div
          className="absolute left-[60%] top-[30%] h-[500px] w-[600px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(ellipse, #7c3aed, transparent 60%)",
            filter: "blur(40px)",
            animation: "aurora-1 28s ease-in-out infinite reverse",
          }}
        />

        {/* Scan line — cybersecurity radar sweep */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #8b5cf640, #06b6d440, transparent)",
            boxShadow: "0 0 20px 2px rgba(139,92,246,0.08), 0 0 60px 4px rgba(99,102,241,0.04)",
            animation: "scan-line 8s linear infinite",
          }}
        />
      </div>
    </>
  );
}
