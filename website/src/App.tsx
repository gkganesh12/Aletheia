import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/shared/Preloader";
import { CustomCursor } from "@/components/shared/CustomCursor";
import SkipToContent from "@/components/shared/SkipToContent";
import ScrollProgress from "@/components/shared/ScrollProgress";
import BackToTop from "@/components/shared/BackToTop";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

/* ── Pages ──────────────────────────────────────────────────────────── */
import Home from "@/pages/Home";
import AboutPage from "@/pages/About";
import ServicesPage from "@/pages/Services";
import ServiceDetail from "@/pages/Services/ServiceDetail";
import ProductsPage from "@/pages/Products";
import ProductDetail from "@/pages/Products/ProductDetail";
import CaseStudiesPage from "@/pages/CaseStudies";
import CaseStudyDetailPage from "@/pages/CaseStudies/CaseStudyDetail";
import BlogPage from "@/pages/Blog";
import BlogPost from "@/pages/Blog/BlogPost";
import ContactPage from "@/pages/Contact";
import CareersPage from "@/pages/Careers";
import IndustriesPage from "@/pages/Industries";
import ConceptPage from "@/pages/Concept";

/* ── Scroll to top on route change ──────────────────────────────────── */
function ScrollToTop() {
  const location = useLocation();
  useState(() => {
    window.scrollTo(0, 0);
  });
  // Also scroll on pathname changes
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
  // Use location to ensure hook dependency on route changes
  void location;
  return null;
}

/* ── Animated Routes (shared layout) ───────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/concept" element={<ConceptPage />} />
      </Routes>
    </AnimatePresence>
  );
}

/* ── Inner App (has access to router context) ────────────────────────── */
function InnerApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll>
      <SkipToContent />
      <ScrollProgress />
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <Navbar />
      <ErrorBoundary>
        <main id="main-content">
          <ScrollToTop />
          <AnimatedRoutes />
        </main>
      </ErrorBoundary>
      <Footer />
      <BackToTop />
    </SmoothScroll>
  );
}

/* ── App ────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}
