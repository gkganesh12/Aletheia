import { useId } from "react";
// A drawn field of continuous strands: the visual identity's signal-to-system motif.
const strands = Array.from({ length: 84 }, (_, strand) => {
  const offset = (strand / 83 - 0.5) * 2;
  return Array.from({ length: 81 }, (_, step) => {
    const t = step / 80;
    const angle = t * Math.PI * 2.05 - 0.4;
    const width = 36 + Math.sin(t * Math.PI) * 145;
    const x =
      340 + Math.sin(angle) * 155 + offset * width * Math.cos(angle * 0.6);
    const y = -65 + t * 780 + offset * width * Math.sin(angle * 0.6) * 0.52;
    return `${step ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
});
export default function SignalField() {
  const id = useId();
  return (
    <svg
      className="signal-field"
      viewBox="0 0 700 650"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={id}
          x1="100"
          y1="50"
          x2="560"
          y2="590"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFA58D" />
          <stop offset=".32" stopColor="#FF704E" />
          <stop offset=".58" stopColor="#FFD1AE" />
          <stop offset="1" stopColor="#FF623C" />
        </linearGradient>
      </defs>
      <g className="signal-strands" stroke={`url(#${id})`} strokeWidth="1.5">
        {strands.map((path, i) => (
          <path key={i} d={path} opacity={0.7 + (i % 5) * 0.06} />
        ))}
      </g>
    </svg>
  );
}
