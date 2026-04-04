import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, GradientText, Button } from "@/components/ui";
import { copy } from "@/data/copy";
import { products } from "@/data/products";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";

/* ────────────────────────────────────────────────────────────────────── */
/*  Checkmark icon                                                       */
/* ────────────────────────────────────────────────────────────────────── */

function CheckIcon({ gradient }: { gradient: [string, string] }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`check-${gradient[0].replace("#", "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
        fill={`url(#check-${gradient[0].replace("#", "")})`}
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Product Card                                                         */
/* ────────────────────────────────────────────────────────────────────── */

interface ProductCardProps {
  product: (typeof products)[number];
}

function ProductCard({ product }: ProductCardProps) {
  const [from, to] = product.gradient;

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8",
        "transition-all duration-300",
        "hover:border-white/[0.15]",
      )}
      style={
        {
          "--card-from": from,
          "--card-to": to,
        } as React.CSSProperties
      }
      whileHover={{
        borderColor: `${from}33`, // ~20% alpha hex
      }}
    >
      {/* Gradient top border accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, ${from}, ${to})`,
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom, ${from}08, transparent)`,
        }}
      />

      {/* Product name */}
      <h3 className="text-2xl font-bold">
        <GradientText from={from} to={to}>
          {product.name}
        </GradientText>
      </h3>

      {/* Tagline */}
      <p className="mt-1 text-sm font-medium text-white/80">
        {product.tagline}
      </p>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-white/50">
        {product.description}
      </p>

      {/* Feature list */}
      <ul className="mt-6 space-y-3">
        {product.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
            <CheckIcon gradient={product.gradient} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8">
        <Button variant="secondary" size="md">
          Learn More
        </Button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Products Section                                                     */
/* ────────────────────────────────────────────────────────────────────── */

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Each card gets a different parallax depth
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const cardOffsets = [y1, y2, y3];

  return (
    <section id="products" ref={sectionRef} className="py-16 lg:py-24">
      <Container>
        <AnimatedSection>
          <SectionHeading
            overline={copy.products.overline}
            heading={copy.products.heading}
            description={copy.products.description}
            align="center"
          />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {products.map((product, i) => (
            <motion.div key={product.id} variants={staggerItem} style={{ y: cardOffsets[i % 3] }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
