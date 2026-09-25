import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  featuredProjects,
  type FeaturedProject,
} from "@/data/featuredProjects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  previewPosition,
  keyboardPreviewPosition,
} from "./previewPosition.mjs";
import "./FeaturedProjects.css";
function Cover({ project }: { project: FeaturedProject }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="project-cover">
      {!failed ? (
        <img
          src={project.image}
          alt={project.imageAlt}
          width="800"
          height="540"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="project-fallback">{project.name}</div>
      )}
      {project.illustrative && (
        <span className="cover-caption">Project illustration</span>
      )}
    </div>
  );
}
export default function FeaturedProjects() {
  const [active, setActive] = useState<FeaturedProject | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const floating = useMediaQuery(
    "(min-width: 900px) and (hover: hover) and (pointer: fine)",
  );
  const reduced = useReducedMotion();
  const pointer = useRef({ x: 0, y: 0 });
  const keyboard = useRef(false);
  useEffect(() => {
    const element = preview.current;
    if (!element || !active || !floating) return;
    const move = (x: number, y: number, instant = false) => {
      const width = element.offsetWidth,
        height = element.offsetHeight;
      const p = keyboard.current
        ? keyboardPreviewPosition(
            width,
            height,
            window.innerWidth,
            window.innerHeight,
          )
        : previewPosition(
            x,
            y,
            width,
            height,
            window.innerWidth,
            window.innerHeight,
          );
      gsap.to(element, {
        x: p.left,
        y: p.top,
        duration: reduced || instant ? 0 : 0.18,
        ease: "power2.out",
        overwrite: true,
      });
    };
    move(pointer.current.x, pointer.current.y, true);
    const handleMove = (e: PointerEvent) => {
      if (!keyboard.current) move(e.clientX, e.clientY);
    };
    const hide = () => {
      if (keyboard.current) move(pointer.current.x, pointer.current.y, true);
      else setActive(null);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      gsap.killTweensOf(element);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, [active, floating, reduced]);
  return (
    <section
      id="work"
      className="featured-work"
      aria-labelledby="work-title"
      onPointerLeave={() => {
        if (!keyboard.current) setActive(null);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null);
      }}
    >
      <div className="work-heading">
        <div>
          <p className="eyebrow">01 / SELECTED PROJECTS</p>
          <h2 id="work-title" data-work-heading>
            A few things
            <br />
            <span>we’ve brought to life.</span>
          </h2>
        </div>
        <p>
          AI systems, websites and tools.
          <br />A closer look at the things we’ve built.
        </p>
      </div>
      <div className="photo-project-grid">
        {featuredProjects.slice(0, 2).map((p, i) => (
          <Link
            to={`/case-studies/${p.slug}`}
            key={p.slug}
            className={`photo-project photo-project-${i}`}
            onFocus={() => setActive(null)}
            onPointerEnter={() => setActive(null)}
          >
            <div className="photo-project-image" data-parallax-photo>
              <img
                src={
                  i === 0
                    ? "/images/editorial/library.webp"
                    : "/images/editorial/gym.webp"
                }
                srcSet={`/images/editorial/${i === 0 ? "library" : "gym"}-small.webp 800w, /images/editorial/${i === 0 ? "library" : "gym"}.webp 1800w`}
                sizes="(max-width: 599px) 88vw, 46vw"
                alt={
                  i === 0
                    ? "A reader surrounded by curved library bookshelves"
                    : "Colourful weights in a sunlit gym"
                }
                width="1800"
                height={i === 0 ? 2521 : 1200}
                loading="lazy"
              />
              <span className="photo-project-tag">{p.category}</span>
              <span className="photo-project-open" aria-hidden="true">
                ↗
              </span>
              <span className="photo-project-caption">
                Context image / stock photography
              </span>
            </div>
            <div className="photo-project-info">
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="project-list">
        {featuredProjects.slice(2).map((p, i) => (
          <Link
            key={p.slug}
            to={`/case-studies/${p.slug}`}
            className={`project-row ${active?.slug === p.slug ? "is-active" : ""}`}
            data-project={p.slug}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse" && floating) {
                keyboard.current = false;
                pointer.current = { x: e.clientX, y: e.clientY };
                setActive(p);
              }
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                keyboard.current = true;
                setActive(p);
              }
            }}
          >
            <span className="project-number">0{i + 3}</span>
            <div className="project-title">
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
            </div>
            <span className="project-category">{p.category}</span>
            <span className="project-arrow" aria-hidden="true">
              ↗
            </span>
            <div className="project-inline">
              <Cover project={p} />
            </div>
          </Link>
        ))}
      </div>
      <div className="work-footer">
        <p>Different problems. The same care in the build.</p>
        <Link to="/case-studies" className="text-link">
          Explore the work <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {floating &&
        active &&
        createPortal(
          <div ref={preview} className="floating-project" aria-hidden="true">
            <Cover key={active.slug} project={active} />
            <div className="preview-prompt">View project ↗</div>
          </div>,
          document.body,
        )}
    </section>
  );
}
