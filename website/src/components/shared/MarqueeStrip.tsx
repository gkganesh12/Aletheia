import type { ReactNode, CSSProperties } from "react";

interface MarqueeStripProps {
  children: ReactNode;
  /** Scroll direction. Default `"left"`. */
  direction?: "left" | "right";
  /** Duration of one full loop in seconds. Default 30. */
  speed?: number;
  className?: string;
}

/**
 * Infinite horizontal marquee built with pure CSS `@keyframes`.
 *
 * Content is duplicated once so the loop is seamless.  Pauses on hover.
 *
 * ```tsx
 * <MarqueeStrip speed={20}>
 *   {logos.map(l => <img key={l.alt} src={l.src} alt={l.alt} />)}
 * </MarqueeStrip>
 * ```
 */
export default function MarqueeStrip({
  children,
  direction = "left",
  speed = 30,
  className = "",
}: MarqueeStripProps) {
  const animationName =
    direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right";

  const trackStyle: CSSProperties = {
    display: "flex",
    width: "max-content",
    animation: `${animationName} ${speed}s linear infinite`,
  };

  return (
    <>
      {/* Inject keyframes once — duplicate style tags are de-duped by React */}
      <style>{`
        @keyframes marquee-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        className={`overflow-hidden [&:hover_>_div]:![animation-play-state:paused] ${className}`}
      >
        <div style={trackStyle}>
          {/* Original */}
          <div className="flex shrink-0 items-center">{children}</div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
