import { brand } from "@/data/brand";
const SITE_URL = "https://aletheiaai.tech";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-preview.png`;
/* ── JSON-LD Helpers ────────────────────────────────────────────────── */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aletheia AI",
    url: SITE_URL,
    logo: `${SITE_URL}${brand.logo}`,
    description:
      "AI engineering studio — we ship AI products, build full-stack platforms and deliver client solutions.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: brand.socials.map((s) => s.href),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aletheia AI",
    url: SITE_URL,
    description:
      "AI engineering studio — we ship AI products, build full-stack platforms and deliver client solutions.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Aletheia AI",
      url: SITE_URL,
    },
    url: `${SITE_URL}/services/${service.slug}`,
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    },
    url: `${SITE_URL}/products/${product.slug}`,
    author: {
      "@type": "Organization",
      name: "Aletheia AI",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  author: string;
  datePublished: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Aletheia AI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    datePublished: article.datePublished,
    image: article.image ? `${SITE_URL}${article.image}` : DEFAULT_OG_IMAGE,
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function caseStudyJsonLd(cs: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.description,
    author: {
      "@type": "Organization",
      name: "Aletheia AI",
    },
    publisher: {
      "@type": "Organization",
      name: "Aletheia AI",
    },
    mainEntityOfPage: `${SITE_URL}/case-studies/${cs.slug}`,
  };
}
