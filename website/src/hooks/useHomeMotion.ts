import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function useHomeMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add(
        "(min-width:600px) and (min-height:650px) and (prefers-reduced-motion:no-preference)",
        () => {
          const strandGroup = element.querySelector(".signal-strands");
          if (strandGroup)
            gsap.to(strandGroup, {
              y: 90,
              rotation: -8,
              transformOrigin: "50% 50%",
              ease: "none",
              scrollTrigger: {
                trigger: ".brand-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          gsap.fromTo(
            ".architecture-flow",
            { y: 22 },
            {
              y: -8,
              ease: "none",
              scrollTrigger: {
                trigger: ".work-feature",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
          const board = element.querySelector<HTMLElement>(".story-board");
          const steps = Array.from(
            element.querySelectorAll<HTMLElement>(".story-step"),
          );
          if (board && steps.length) {
            const setStage = (stage: number) => {
              board.dataset.storyStage = String(stage);
            };
            steps.forEach((step, i) => {
              ScrollTrigger.create({
                trigger: step,
                start: "top 55%",
                end: "bottom 55%",
                onEnter: () => setStage(i),
                onEnterBack: () => setStage(i),
              });
            });
            gsap.fromTo(
              ".story-board-bottom i",
              { scaleX: 0.06 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: ".story-steps",
                  start: "top 55%",
                  end: "bottom 55%",
                  scrub: 0.4,
                },
              },
            );
            gsap.to(".story-visual .engineering-graph", {
              rotation: 18,
              scale: 1.05,
              transformOrigin: "50% 50%",
              ease: "none",
              scrollTrigger: {
                trigger: ".story-steps",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          }
          gsap.fromTo(
            ".founder-image img",
            { yPercent: -4, scale: 1.08 },
            {
              yPercent: 4,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: ".people-chapter",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
          return () => {
            if (board) board.dataset.storyStage = "0";
          };
        },
      );
    }, element);
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
