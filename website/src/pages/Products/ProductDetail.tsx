import { useParams, Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DetailNavigation from "@/components/shared/DetailNavigation";
import { Container, GlassPanel, Button, GradientText, SectionHeading } from "@/components/ui";
import { productDetails } from "@/data/productDetails";

/* ────────────────────────────────────────────────────────────────────── */
/*  Tech logo mapping (Simple Icons CDN)                                 */
/* ────────────────────────────────────────────────────────────────────── */

const TECH_LOGO_MAP: Record<string, { slug: string; color: string }> = {
  Python: { slug: "python", color: "3776AB" },
  Go: { slug: "go", color: "00ADD8" },
  Rust: { slug: "rust", color: "DEA584" },
  TypeScript: { slug: "typescript", color: "3178C6" },
  React: { slug: "react", color: "61DAFB" },
  "Apache Kafka": { slug: "apachekafka", color: "white" },
  "Apache Flink": { slug: "apacheflink", color: "E6526F" },
  Elasticsearch: { slug: "elasticsearch", color: "005571" },
  Neo4j: { slug: "neo4j", color: "4581C3" },
  Kubernetes: { slug: "kubernetes", color: "326CE5" },
  Redis: { slug: "redis", color: "FF4438" },
  PostgreSQL: { slug: "postgresql", color: "4169E1" },
  Terraform: { slug: "terraform", color: "844FBA" },
  ClickHouse: { slug: "clickhouse", color: "FFCC01" },
  WebAssembly: { slug: "webassembly", color: "654FF0" },
  Docker: { slug: "docker", color: "2496ED" },
};

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[var(--color-accent-400)]"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const productIndex = productDetails.findIndex((p) => p.slug === slug);
  const product = productDetails[productIndex];

  /* ── Not found ──────────────────────────────────────────────────────── */
  if (!product) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-white">Product Not Found</h1>
          <p className="text-white/50">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/products"
            className="mt-4 text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)]"
          >
            &larr; Back to Products
          </Link>
        </div>
      </PageTransition>
    );
  }

  const prevProduct =
    productIndex > 0 ? productDetails[productIndex - 1] : undefined;
  const nextProduct =
    productIndex < productDetails.length - 1
      ? productDetails[productIndex + 1]
      : undefined;

  const [gradientFrom, gradientTo] = product.gradient;

  return (
    <PageTransition>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHero
        overline={product.tagline}
        title={product.name}
        description={product.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      >
        {/* Gradient accent bar */}
        <div
          className="h-1 w-24 rounded-full"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          }}
        />
      </PageHero>

      {/* ── Features (2x3 grid) ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Features" heading="What Sets It Apart" />
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature: { title: string; description: string }, i: number) => (
              <AnimatedSection key={feature.title} delay={i * 0.08}>
                <GlassPanel className="h-full p-6 sm:p-8">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </GlassPanel>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Use Cases ───────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Applications" heading="Use Cases" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="mx-auto max-w-2xl">
              <ul className="space-y-3">
                {product.useCases.map((useCase) => (
                  <li key={useCase} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-400)]" />
                    <span className="text-base leading-relaxed text-white/60">
                      {useCase}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Pricing"
              heading="Plans That Scale With You"
            />
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.pricing.map((tier, i) => {
              const isHighlighted = tier.highlighted === true;

              return (
                <AnimatedSection key={tier.tier} delay={i * 0.1}>
                  <GlassPanel
                    className={`relative flex h-full flex-col p-6 sm:p-8 ${
                      isHighlighted
                        ? "border-[var(--color-accent-400)]"
                        : ""
                    }`}
                  >
                    {/* Popular badge */}
                    {isHighlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent-400)] px-3 py-1 text-xs font-semibold text-black">
                        Most Popular
                      </span>
                    )}

                    {/* Tier header */}
                    <h3 className="text-lg font-semibold text-white">
                      {tier.tier}
                    </h3>

                    {/* Price */}
                    <p className="mt-6 text-3xl font-bold text-white">
                      {tier.price === "Custom" ? (
                        <GradientText from={gradientFrom} to={gradientTo}>
                          Custom
                        </GradientText>
                      ) : (
                        tier.price
                      )}
                    </p>

                    {/* Feature list */}
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-white/60"
                        >
                          <CheckIcon />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-8">
                      <Button
                        asChild
                        variant={isHighlighted ? "primary" : "secondary"}
                        size="md"
                        className="w-full"
                      >
                        <Link to="/contact">
                          {tier.price === "Custom"
                            ? "Contact Sales"
                            : "Get Started"}
                        </Link>
                      </Button>
                    </div>
                  </GlassPanel>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Technology" heading="Built With" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              {product.techStack.map((tech) => {
                const logo = TECH_LOGO_MAP[tech];
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/60 transition-all duration-300 hover:border-white/25 hover:text-white hover:bg-white/[0.08] select-none"
                  >
                    {logo && (
                      <img
                        src={`https://cdn.simpleicons.org/${logo.slug}/${logo.color}`}
                        alt={`${tech} logo`}
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] object-contain flex-shrink-0"
                        loading="lazy"
                        draggable={false}
                      />
                    )}
                    {tech}
                  </span>
                );
              })}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <DetailNavigation
              prev={
                prevProduct
                  ? {
                      label: prevProduct.name,
                      href: `/products/${prevProduct.slug}`,
                    }
                  : undefined
              }
              next={
                nextProduct
                  ? {
                      label: nextProduct.name,
                      href: `/products/${nextProduct.slug}`,
                    }
                  : undefined
              }
            />
          </AnimatedSection>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
