import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, Card } from "@/components/ui";
import { copy } from "@/data/copy";
import { services } from "@/data/services";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { staggerContainer, staggerItem, cardHover } from "@/lib/motion-variants";

/* ────────────────────────────────────────────────────────────────────── */
/*  Icon map — lightweight inline SVGs keyed by the service.icon string  */
/* ────────────────────────────────────────────────────────────────────── */

const iconPaths: Record<string, React.ReactNode> = {
  Shield: (
    <path
      d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7l-9-5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  Crosshair: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  Layers: (
    <>
      <polygon points="12,2 2,7 12,12 22,7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <polyline points="2,12 12,17 22,12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <polyline points="2,17 12,22 22,17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </>
  ),
  Zap: (
    <polygon
      points="13,2 3,14 12,14 11,22 21,10 12,10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  FileCheck: (
    <>
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <polyline points="9,15 11,17 15,13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Brain: (
    <>
      <path
        d="M12 2a5 5 0 00-4.9 4.1A4 4 0 004 10a4 4 0 001.1 2.8A4.5 4.5 0 004 16a4.5 4.5 0 004.5 4.5c.5 0 1-.08 1.5-.25V22h4v-1.75c.5.17 1 .25 1.5.25A4.5 4.5 0 0020 16a4.5 4.5 0 00-1.1-3.2A4 4 0 0020 10a4 4 0 00-3.1-3.9A5 5 0 0012 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
    </>
  ),
  Radio: (
    <>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16.24 7.76a6 6 0 010 8.49" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M7.76 16.24a6 6 0 010-8.49" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M4.93 19.07a10 10 0 010-14.14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
};

/* ────────────────────────────────────────────────────────────────────── */
/*  ServiceIcon                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function ServiceIcon({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[--color-accent-400]/10 transition-transform duration-300 group-hover:scale-110">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-accent-400 transition-colors duration-300 group-hover:text-[var(--color-accent-400)]"
        aria-hidden="true"
      >
        {iconPaths[name] ?? iconPaths.Shield}
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Services Section                                                     */
/* ────────────────────────────────────────────────────────────────────── */

export default function Services() {
  return (
    <section id="services" className="py-16 lg:py-24 bg-white/[0.015]">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline={copy.services.overline}
            heading={copy.services.heading}
            description={copy.services.description}
            align="center"
          />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={staggerItem}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
              >
                <Card
                  variant="glass"
                  hover
                  className={cn(
                    "group p-6 lg:p-8",
                    "hover:border-[var(--color-accent-400)]/20 hover:border-accent-400/30 hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]",
                    "transition-all duration-300",
                  )}
                >
                  <ServiceIcon name={service.icon} />

                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
