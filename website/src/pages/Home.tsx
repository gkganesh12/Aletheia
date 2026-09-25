import { useRef } from "react";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import BuildStory from "@/components/sections/BuildStory";
import BuildLog from "@/components/sections/BuildLog";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import About from "@/components/sections/About";
import CTASection from "@/components/shared/CTASection";
import PageSEO from "@/components/shared/PageSEO";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { useHomeMotion } from "@/hooks/useHomeMotion";
export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useHomeMotion(root);
  return (
    <div ref={root} className="brand-home">
      <PageSEO
        title="Aletheia AI — AI systems, websites & software"
        description="AI systems, websites and software. Aletheia AI builds intelligent products, digital experiences and the engineering behind your next idea."
        path="/"
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <Hero />
      <FeaturedProjects />
      <BuildStory />
      <BuildLog />
      <Services />
      <Products />
      <About />
      <CTASection />
    </div>
  );
}
