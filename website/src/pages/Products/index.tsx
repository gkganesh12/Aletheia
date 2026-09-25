import PageHero from "@/components/shared/PageHero";
import PageSEO from "@/components/shared/PageSEO";
import Products from "@/components/sections/Products";
import CTASection from "@/components/shared/CTASection";
import { breadcrumbJsonLd } from "@/lib/seo";
export default function ProductsPage() {
  return (
    <div className="page-content">
      <PageSEO
        title="AI Products"
        description="Meet Inscrape, Nirvana and SwarmScope: web data extraction, intelligent alert management and multi-agent simulation from Aletheia AI."
        path="/products"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <PageHero
        overline="Our products"
        title="Built from curiosity. Made to be used."
        description="The tools we build for the problems we care about. Explore our own products in data, developer workflows and AI."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <Products />
      <CTASection
        heading="Something else in mind?"
        description="Let’s build the product your business needs."
      />
    </div>
  );
}
