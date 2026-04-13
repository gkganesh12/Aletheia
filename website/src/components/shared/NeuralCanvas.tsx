import { useRef, useEffect, useCallback } from "react";

/* ── Palette ──────────────────────────────────────────────────────────── */
const VIOLET = "#8b5cf6";
const INDIGO = "#6366f1";
const CYAN = "#06b6d4";
const WHITE = "#ffffff";

/* ── Types ────────────────────────────────────────────────────────────── */
interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  /** original position before rotation */
  origX: number;
  origY: number;
  r: number;
  color: string;
  glow: string;
  label?: string;
  type: "core" | "product" | "service" | "agent";
  at: number;
  to: number[];
}

/* ── Hex→RGB ──────────────────────────────────────────────────────────── */
function rgb(c: string) {
  const v = parseInt(c.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255] as const;
}

/* ── Quadratic bezier point ───────────────────────────────────────────── */
function bezierPt(
  ax: number, ay: number,
  cpx: number, cpy: number,
  bx: number, by: number,
  t: number,
) {
  const u = 1 - t;
  return [u * u * ax + 2 * u * t * cpx + t * t * bx, u * u * ay + 2 * u * t * cpy + t * t * by] as const;
}

/* ── Control point for a curved connection ────────────────────────────── */
function ctrlPt(
  ax: number, ay: number, bx: number, by: number, idx: number,
) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const curvature = 0.18 * (idx % 2 === 0 ? 1 : -1);
  return [mx + (-dy / len) * len * curvature, my + (dx / len) * len * curvature] as const;
}

/* ── Build the node graph ─────────────────────────────────────────────── */
function buildGraph(w: number, h: number): Node[] {
  const cx = w / 2;
  const cy = h / 2;
  const s = Math.min(w, h) / 950;

  const n: Node[] = [];

  /* 0 — Core */
  n.push({
    x: cx, y: cy, baseX: cx, baseY: cy, origX: cx, origY: cy,
    r: 22 * s, color: WHITE, glow: VIOLET,
    label: "ALETHEIA AI", type: "core", at: 0.0, to: [],
  });

  /* 1-3 — Products */
  const products = [
    { name: "Inscrape", angle: -Math.PI / 2 },
    { name: "Nirvana", angle: Math.PI / 6 },
    { name: "SwarmScope", angle: (5 * Math.PI) / 6 },
  ];
  const pR = 270 * s;
  products.forEach((p, i) => {
    const x = cx + Math.cos(p.angle) * pR;
    const y = cy + Math.sin(p.angle) * pR;
    n.push({
      x, y, baseX: x, baseY: y, origX: x, origY: y,
      r: 14 * s, color: VIOLET, glow: VIOLET,
      label: p.name, type: "product",
      at: 0.12 + i * 0.04, to: [0],
    });
  });

  /* 4-9 — Services */
  const services = [
    "AI Engineering", "MVP Studio", "Full-Stack",
    "Cloud & DevOps", "Cybersecurity", "Data & ML",
  ];
  const sR = 165 * s;
  services.forEach((name, i) => {
    const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
    const x = cx + Math.cos(angle) * sR;
    const y = cy + Math.sin(angle) * sR;
    n.push({
      x, y, baseX: x, baseY: y, origX: x, origY: y,
      r: 7.5 * s, color: INDIGO, glow: INDIGO,
      label: name, type: "service",
      at: 0.30 + i * 0.025, to: [0, 1 + (i % 3)],
    });
  });

  /* 10-22 — 13 Agent nodes */
  for (let i = 0; i < 13; i++) {
    const angle = (i * Math.PI * 2) / 13 + (i % 2 === 0 ? 0.18 : -0.12);
    const dist = (215 + (i * 19) % 140) * s;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    n.push({
      x, y, baseX: x, baseY: y, origX: x, origY: y,
      r: 3.5 * s, color: CYAN, glow: CYAN,
      type: "agent",
      at: 0.50 + i * 0.015, to: [4 + (i % 6)],
    });
  }

  return n;
}

/* ── Component ────────────────────────────────────────────────────────── */
interface Props {
  progressRef: React.RefObject<number>;
  className?: string;
}

export default function NeuralCanvas({ progressRef, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const init = useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    nodesRef.current = buildGraph(w, h);
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width: w, height: h } = cvs.getBoundingClientRect();
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── render loop ─────────────────────────────────────── */
    const draw = (ts: number) => {
      const p = progressRef.current ?? 0;
      const t = ts / 1000;
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      /* ── subtle background grid (fades in) ──────────────── */
      if (p > 0.02) {
        const ga = Math.min(0.025, (p - 0.02) * 0.15);
        ctx.strokeStyle = `rgba(139,92,246,${ga})`;
        ctx.lineWidth = 0.5;
        const step = 80;
        for (let gx = step; gx < w; gx += step) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        }
        for (let gy = step; gy < h; gy += step) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }
      }

      /* ── rotate network slowly with scroll ──────────────── */
      const rotAngle = p * 0.22; // ~12.6° at full scroll
      const cos = Math.cos(rotAngle);
      const sin = Math.sin(rotAngle);

      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        const dx = nd.origX - cx;
        const dy = nd.origY - cy;
        nd.baseX = cx + dx * cos - dy * sin;
        nd.baseY = cy + dx * sin + dy * cos;
        // floating
        nd.x = nd.baseX + Math.sin(t * 0.55 + i * 0.8) * 3;
        nd.y = nd.baseY + Math.cos(t * 0.45 + i * 0.6) * 3;
      }

      /* ═══ CONNECTIONS (bezier curves) ═══════════════════════ */
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        if (p < nd.at) continue;
        const na = Math.min(1, (p - nd.at) / 0.07);

        for (let ci = 0; ci < nd.to.length; ci++) {
          const tg = nodes[nd.to[ci]];
          if (p < tg.at) continue;

          const [cpx, cpy] = ctrlPt(tg.x, tg.y, nd.x, nd.y, i + ci);
          const lineGrow = Math.min(1, (p - nd.at) / 0.06);

          /* draw curved connection */
          const alpha = na * (nd.type === "agent" ? 0.07 : 0.13);
          const [cr, cg, cb] = rgb(nd.glow);

          ctx.beginPath();
          ctx.moveTo(tg.x, tg.y);
          // partial growth — evaluate bezier at lineGrow fraction
          const segments = Math.max(8, Math.floor(lineGrow * 20));
          for (let s = 1; s <= segments; s++) {
            const st = (s / segments) * lineGrow;
            const [bx, by] = bezierPt(tg.x, tg.y, cpx, cpy, nd.x, nd.y, st);
            ctx.lineTo(bx, by);
          }
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.lineWidth = nd.type === "agent" ? 0.6 : 1;
          ctx.stroke();

          /* ── data particles with trails (after 55%) ──────── */
          if (p > 0.55 && lineGrow > 0.9) {
            const pAlpha = Math.min(1, (p - 0.55) / 0.12);
            for (let k = 0; k < 3; k++) {
              const pp = ((t * 0.22 + i * 0.11 + k * 0.33) % 1);
              // particle trail: 4 dots fading behind
              for (let trail = 0; trail < 4; trail++) {
                const tp = pp - trail * 0.02;
                if (tp < 0 || tp > 1) continue;
                const [px, py] = bezierPt(tg.x, tg.y, cpx, cpy, nd.x, nd.y, tp);
                const pa = Math.sin(pp * Math.PI) * pAlpha * (0.75 - trail * 0.18);
                const pr = 2 - trail * 0.35;
                ctx.beginPath();
                ctx.arc(px, py, Math.max(0.5, pr), 0, Math.PI * 2);
                ctx.fillStyle = trail === 0
                  ? `rgba(255,255,255,${pa})`
                  : `rgba(${cr},${cg},${cb},${pa * 0.7})`;
                ctx.fill();
              }
            }
          }
        }
      }

      /* ═══ NODES ═════════════════════════════════════════════ */
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        if (p < nd.at) continue;
        const na = Math.min(1, (p - nd.at) / 0.07);
        const [cr, cg, cb] = rgb(nd.glow);

        /* ── burst ring on appearance ─────────────────────── */
        const burstAge = p - nd.at;
        if (burstAge < 0.08 && burstAge > 0) {
          const burstT = burstAge / 0.08; // 0→1
          const burstR = nd.r + burstT * nd.r * 4;
          const burstA = (1 - burstT) * 0.4;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, burstR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${burstA})`;
          ctx.lineWidth = 1.5 * (1 - burstT);
          ctx.stroke();
        }

        /* ── soft glow (radial gradient, no shadowBlur) ──── */
        const glowR = nd.r * 4;
        const grad = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, glowR);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${na * 0.18})`);
        grad.addColorStop(0.4, `rgba(${cr},${cg},${cb},${na * 0.06})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        /* ── node circle with subtle inner gradient ──────── */
        ctx.save();
        ctx.globalAlpha = na;
        const nodeGrad = ctx.createRadialGradient(
          nd.x - nd.r * 0.3, nd.y - nd.r * 0.3, 0,
          nd.x, nd.y, nd.r,
        );
        nodeGrad.addColorStop(0, nd.type === "core" ? "#ffffff" : `rgba(${cr},${cg},${cb},1)`);
        nodeGrad.addColorStop(0.6, nd.color);
        nodeGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0.7)`);
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();
        ctx.restore();

        /* ── thin outline ring ────────────────────────────── */
        if (nd.type !== "agent") {
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, nd.r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${na * 0.15})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        /* ── label ────────────────────────────────────────── */
        if (nd.label && na > 0.4) {
          const labelA = Math.min(1, (na - 0.4) / 0.6) * 0.6;
          ctx.save();
          ctx.globalAlpha = labelA;
          const fs = nd.type === "core" ? 14 : nd.type === "product" ? 11 : 9;
          ctx.font = `${nd.type === "core" ? 600 : 500} ${fs}px "Outfit", system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillStyle = WHITE;
          // text shadow
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(${cr},${cg},${cb},0.5)`;
          ctx.fillText(nd.label, nd.x, nd.y + nd.r + 18);
          ctx.restore();
        }
      }

      /* ═══ CORE PULSE RINGS ══════════════════════════════════ */
      if (p > 0.03) {
        const core = nodes[0];
        const ba = Math.min(1, p / 0.06);

        // Ring 1 — fast pulse
        const r1 = core.r + 12 + Math.sin(t * 2.5) * 5;
        const a1 = ba * (0.1 + Math.sin(t * 2.5) * 0.06);
        ctx.beginPath();
        ctx.arc(core.x, core.y, r1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,92,246,${a1})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Ring 2 — slower, larger
        const r2 = core.r + 28 + Math.sin(t * 1.2) * 7;
        ctx.beginPath();
        ctx.arc(core.x, core.y, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${a1 * 0.4})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Ring 3 — dashed orbit
        if (p > 0.1) {
          ctx.save();
          ctx.setLineDash([4, 8]);
          const r3 = core.r + 50 + Math.sin(t * 0.8) * 4;
          ctx.beginPath();
          ctx.arc(core.x, core.y, r3, t * 0.3, t * 0.3 + Math.PI * 1.5);
          ctx.strokeStyle = `rgba(6,182,212,${ba * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }
      }

      /* ═══ AMBIENT MOTES ═════════════════════════════════════ */
      if (p > 0.2) {
        const mAlpha = Math.min(1, (p - 0.2) / 0.2);
        for (let i = 0; i < 35; i++) {
          const mx = ((Math.sin(t * 0.12 + i * 2.3) + 1) / 2) * w;
          const my = ((Math.cos(t * 0.1 + i * 1.9) + 1) / 2) * h;
          const ma = mAlpha * 0.14 * (0.4 + Math.sin(t * 0.7 + i * 1.3) * 0.6);
          const mr = 0.8 + Math.sin(t + i) * 0.3;
          ctx.beginPath();
          ctx.arc(mx, my, mr, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0
            ? `rgba(6,182,212,${ma})`
            : `rgba(139,92,246,${ma})`;
          ctx.fill();
        }
      }

      /* ═══ OUTER ORBIT RING ══════════════════════════════════ */
      if (p > 0.45) {
        const oa = Math.min(1, (p - 0.45) / 0.15) * 0.04;
        const or = Math.min(w, h) * 0.42;
        ctx.save();
        ctx.setLineDash([2, 12]);
        ctx.beginPath();
        ctx.arc(cx, cy, or, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139,92,246,${oa})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [init, progressRef]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
