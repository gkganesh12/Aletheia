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
          const hero = element.querySelector(".photo-hero");
          gsap.fromTo(
            hero,
            { clipPath: "inset(0 2% 0 2%)" },
            {
              clipPath: "inset(0 0% 0 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top 84px",
                end: "+=350",
                scrub: 0.6,
              },
            },
          );
          gsap.to(".photo-hero-image", {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.7,
            },
          });
          gsap.to(".photo-hero h1", {
            y: 90,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
          // Each image has 20% overscan: parallax never exposes an empty edge.
          element
            .querySelectorAll<HTMLElement>("[data-parallax-photo]")
            .forEach((frame) => {
              gsap.fromTo(
                frame.querySelector("img"),
                { yPercent: -5 },
                {
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: frame,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.7,
                  },
                },
              );
            });
          gsap.fromTo(
            ".photo-project-1",
            { y: 70 },
            {
              y: -45,
              ease: "none",
              scrollTrigger: {
                trigger: ".photo-project-grid",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
          const gallery =
            element.querySelector<HTMLElement>(".process-gallery");
          const steps = Array.from(
            element.querySelectorAll<HTMLElement>(".process-step"),
          );
          if (gallery) {
            steps.forEach((step, i) => {
              ScrollTrigger.create({
                trigger: step,
                start: "top 55%",
                end: "bottom 55%",
                onEnter: () => {
                  gallery.dataset.processStage = String(i);
                },
                onEnterBack: () => {
                  gallery.dataset.processStage = String(i);
                },
              });
            });
            gsap.fromTo(
              ".process-progress i",
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: ".process-steps",
                  start: "top 55%",
                  end: "bottom 55%",
                  scrub: 0.4,
                },
              },
            );
            gsap.fromTo(
              ".process-frame img",
              { yPercent: -3 },
              {
                yPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: ".process-steps",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
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
            if (gallery) gallery.dataset.processStage = "0";
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
