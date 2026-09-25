import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function useHomeMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        "(min-width:900px) and (prefers-reduced-motion:no-preference)",
        () => {
          gsap.to(".hero-asterisk", {
            rotation: 100,
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: ".brand-hero",
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          gsap.fromTo(
            "[data-work-heading]",
            { xPercent: 5 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: "#work",
                start: "top bottom",
                end: "top 25%",
                scrub: 0.5,
              },
            },
          );
          gsap.fromTo(
            "[data-statement-word]",
            { color: "#A8B6FF" },
            {
              color: "#FF775E",
              ease: "none",
              scrollTrigger: {
                trigger: ".brand-statement",
                start: "top 40%",
                end: "center 40%",
                scrub: 0.5,
              },
            },
          );
          gsap.to(".statement-last i", {
            rotation: 45,
            ease: "none",
            scrollTrigger: {
              trigger: ".brand-statement",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          gsap.fromTo(
            ".founder-image img",
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: ".people-chapter",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        },
      );
    }, root);
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      mm.revert();
      ctx.revert();
    };
  }, [root]);
}
