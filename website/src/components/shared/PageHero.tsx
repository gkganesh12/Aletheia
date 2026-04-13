import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  overline?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export default function PageHero({
  overline,
  title,
  description,
  breadcrumbs,
  children,
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/[0.04]",
        compact ? "pb-12 pt-24 sm:pb-16 sm:pt-32" : "pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-28 lg:pt-44",
        className
      )}
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-400) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container className="relative z-10">
        {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} className="mb-6" />}

        {overline && (
          <motion.span
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {overline}
          </motion.span>
        )}

        <motion.h1
          className="max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl font-[var(--font-heading)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {children}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
