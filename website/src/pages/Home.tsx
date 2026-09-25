import { useRef } from "react";
import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import BrandStatement from "@/components/sections/BrandStatement";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
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
        title="Aletheia AI — Intelligence. Put to work."
        description="AI systems, websites and software. Aletheia AI builds intelligent products, digital experiences and the engineering behind your next idea."
        path="/"
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <Hero />
      <FeaturedProjects />
      <BrandStatement />
      <Services />
      <Process />
      <Products />
      <About />
      <CTASection />
    </div>
  );
}
