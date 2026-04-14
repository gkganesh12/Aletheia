import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Card } from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import FilterButtons from "@/components/shared/FilterButtons";
import PageSEO, { breadcrumbJsonLd } from "@/components/shared/PageSEO";
import { blogPosts } from "@/data/blogPosts";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Derive unique categories from data                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const categories = Array.from(new Set(blogPosts.map((p) => p.category)));

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export default function BlogPage() {
  const [active, setActive] = useState("All");

  const filteredPosts =
    active === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === active);

  return (
    <PageTransition>
      <PageSEO
        title="Blog — AI & Cybersecurity Insights"
        description="Deep dives into AI, cybersecurity and emerging technologies. Written by practitioners at Aletheia AI — technical insights for engineers and decision-makers."
        path="/blog"
        keywords="AI blog, cybersecurity blog, machine learning articles, AI engineering insights"
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])}
      />
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        overline="Blog"
        title="Insights & Research"
        description="Deep dives into AI, cybersecurity and the technologies shaping the future of defence. Written by practitioners, for practitioners."
      />

      {/* ─── Posts Grid ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          {/* Filter bar */}
          <AnimatedSection>
            <FilterButtons
              categories={categories}
              active={active}
              onChange={setActive}
              className="mb-12"
            />
          </AnimatedSection>

          {/* Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={index * 0.05}>
                <Card hover className="group flex h-full flex-col overflow-hidden p-0">
                  <motion.div
                    className="flex h-full flex-col"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Thumbnail */}
                    {post.thumbnail && (
                      <div className="overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex h-full flex-col p-6">
                    {/* Category badge */}
                    <span className="mb-4 inline-block w-fit rounded bg-[var(--color-accent-400)]/10 px-2 py-1 text-xs font-semibold uppercase text-[var(--color-accent-400)]">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors duration-200 group-hover:text-[var(--color-accent-400)]">
                      {post.title}
                    </h3>

                    {/* Excerpt (2-line truncation) */}
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/50">
                      {post.excerpt}
                    </p>

                    {/* Author + date + readTime */}
                    <div className="mt-auto flex items-center gap-3 border-t border-white/[0.06] pt-4 text-xs text-white/30">
                      <span>{post.author}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.date}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Read More link */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-400)] transition-colors duration-200 hover:text-[var(--color-accent-300)]"
                    >
                      Read More
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                    </div>
                  </motion.div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <AnimatedSection>
              <p className="py-20 text-center text-white/40">
                No posts found in this category.
              </p>
            </AnimatedSection>
          )}
        </Container>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <CTASection />
    </PageTransition>
  );
}
