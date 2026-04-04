import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button } from "@/components/ui";

const trustBadges = [
  { icon: "💬", label: "Free Consultation" },
  { icon: "🤝", label: "No Commitment" },
  { icon: "⚡", label: "24h Response" },
];

interface CTASectionProps {
  heading?: string;
  description?: string;
  className?: string;
}

export default function CTASection({
  heading = "Ready to Secure Your Future?",
  description = "Get in touch and a member of our team will respond within 24 hours.",
  className = "",
}: CTASectionProps) {
  return (
    <section
      className={`relative overflow-hidden py-24 sm:py-32 ${className}`}
    >
      {/* Subtle accent gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-400)]/[0.03] to-transparent" />
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/20 to-transparent" />
      </div>

      <Container size="narrow" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">
            {description}
          </p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-white/40"
              >
                <span aria-hidden="true">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild variant="primary" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/services">Explore Services</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
