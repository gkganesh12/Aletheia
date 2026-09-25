import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
      () => {
        const lenis = new Lenis({ duration: 0.85, anchors: true });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      },
    );
    return () => mm.revert();
  }, [pathname]);
  return <>{children}</>;
}
