import { useParams, Link } from "react-router-dom";
import { Container } from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DetailNavigation from "@/components/shared/DetailNavigation";
import { blogPosts } from "@/data/blogPosts";

const categoryColors: Record<string, string> = {
  AI: "bg-blue-500/20 text-blue-400",
  Cybersecurity: "bg-red-500/20 text-red-400",
  Engineering: "bg-green-500/20 text-green-400",
  Research: "bg-purple-500/20 text-purple-400",
  Industry: "bg-amber-500/20 text-amber-400",
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const postIndex = blogPosts.findIndex((p: { slug: string }) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-white">Post Not Found</h1>
          <p className="text-white/50">
            The blog post you are looking for does not exist.
          </p>
          <Link
            to="/blog"
            className="mt-4 text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)]"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </PageTransition>
    );
  }

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : undefined;
  const nextPost =
    postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : undefined;

  // Render content with basic markdown-like processing
  const renderContent = (content: string) => {
    const blocks = content.split("\n\n");
    return blocks.map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 heading
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={i}
            className="mb-4 mt-10 text-2xl font-bold text-white first:mt-0"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      // H3 heading
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={i}
            className="mb-3 mt-8 text-xl font-semibold text-white first:mt-0"
          >
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Code block
      if (trimmed.startsWith("```")) {
        const codeContent = trimmed.replace(/```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre
            key={i}
            className="my-6 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
          >
            <code className="text-sm text-white/70">{codeContent}</code>
          </pre>
        );
      }

      // List items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").filter((line) => line.trim());
        return (
          <ul key={i} className="my-4 space-y-2 pl-6">
            {items.map((item, j) => (
              <li
                key={j}
                className="list-disc text-base leading-relaxed text-white/60"
              >
                {item.replace(/^[-*]\s+/, "")}
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p
          key={i}
          className="mb-5 text-base leading-relaxed text-white/60"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <PageTransition>
      <PageHero
        compact
        overline={post.category}
        title={post.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Thumbnail */}
            {post.thumbnail && (
              <AnimatedSection>
                <div className="mb-8 overflow-hidden rounded-2xl">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-64 w-full object-cover sm:h-80"
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>
            )}

            {/* Article metadata bar */}
            <AnimatedSection>
              <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-white/[0.06] pb-6">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    categoryColors[post.category] ?? "bg-white/10 text-white/60"
                  }`}
                >
                  {post.category}
                </span>
                <span className="text-sm text-white/40">{post.author}</span>
                <span className="text-sm text-white/30">{post.date}</span>
                <span className="text-sm text-white/30">{post.readTime}</span>
              </div>
            </AnimatedSection>

            {/* Article content */}
            <AnimatedSection delay={0.1}>
              <article className="prose-invert">{renderContent(post.content)}</article>
            </AnimatedSection>

            {/* Navigation */}
            <AnimatedSection delay={0.2} className="mt-16">
              <DetailNavigation
                prev={
                  prevPost
                    ? { label: prevPost.title, href: `/blog/${prevPost.slug}` }
                    : undefined
                }
                next={
                  nextPost
                    ? { label: nextPost.title, href: `/blog/${nextPost.slug}` }
                    : undefined
                }
              />
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
