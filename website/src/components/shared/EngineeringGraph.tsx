import { useId } from "react";
// A deterministic architecture illustration, not live product telemetry.
const clusters = [
  { x: 215, y: 130 },
  { x: 345, y: 215 },
  { x: 220, y: 310 },
  { x: 105, y: 245 },
  { x: 390, y: 355 },
];
const points = clusters.flatMap((c, group) =>
  Array.from({ length: 18 }, (_, i) => {
    const angle = i * 2.399963;
    const radius = 12 + Math.sqrt(i) * 13;
    return {
      x: c.x + Math.cos(angle) * radius,
      y: c.y + Math.sin(angle) * radius,
      group,
    };
  }),
);
export default function EngineeringGraph({
  className = "",
}: {
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      className={`engineering-graph ${className}`}
      viewBox="0 0 520 460"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".15" />
        </pattern>
      </defs>
      <rect width="520" height="460" fill={`url(#${id})`} />
      <g className="graph-links">
        {points.map((p, i) => (
          <path
            key={i}
            d={`M${p.x},${p.y}L${clusters[p.group].x},${clusters[p.group].y}`}
            stroke="currentColor"
            opacity=".16"
            strokeWidth=".65"
          />
        ))}
        {clusters.map((p, i) => (
          <path
            key={i}
            d={`M${p.x},${p.y} Q260,215 ${clusters[(i + 1) % clusters.length].x},${clusters[(i + 1) % clusters.length].y}`}
            stroke="currentColor"
            opacity=".3"
          />
        ))}
      </g>
      <g className="graph-nodes">
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i % 7 === 0 ? 3.2 : 1.8}
            fill={p.group === 2 ? "#2448FF" : "currentColor"}
            opacity={i % 3 === 0 ? 1 : 0.5}
          />
        ))}
      </g>
      {clusters.map((p, i) => (
        <g key={i} className="graph-hub">
          <circle
            cx={p.x}
            cy={p.y}
            r="9"
            fill={i === 2 ? "#2448FF" : "#F7F8F2"}
            stroke="currentColor"
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill={i === 2 ? "#F7F8F2" : "currentColor"}
          />
        </g>
      ))}
      <path
        d="M35 35h15m-15 0v15M485 35h-15m15 0v15M35 425h15m-15 0v-15M485 425h-15m15 0v-15"
        stroke="currentColor"
        opacity=".45"
      />
      <g fontFamily="monospace" fontSize="8" fill="currentColor">
        <text x="72" y="105">
          CONTEXT
        </text>
        <text x="373" y="120">
          RELATIONSHIPS
        </text>
        <text x="56" y="345">
          MEMORY
        </text>
        <text x="326" y="422">
          EMERGENT BEHAVIOUR
        </text>
      </g>
    </svg>
  );
}
