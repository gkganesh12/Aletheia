export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  children?: NavChild[];
}

export const navLinks: NavLink[] = [
  { id: "industries", label: "Industries", href: "/industries" },
  { id: "services", label: "Services", href: "/services" },
  { id: "products", label: "Products", href: "/products" },
  {
    id: "resources",
    label: "Resources",
    href: "#",
    children: [
      { label: "Blog", href: "/blog", description: "Insights & research" },
      { label: "Case Studies", href: "/case-studies", description: "Proven results" },
    ],
  },
  {
    id: "company",
    label: "Company",
    href: "#",
    children: [
      { label: "About Us", href: "/about", description: "Our story & team" },
      { label: "Careers", href: "/careers", description: "Join our team" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
];

export const mobileNavLinks: NavLink[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "services", label: "Services", href: "/services" },
  { id: "products", label: "Products", href: "/products" },
  { id: "case-studies", label: "Case Studies", href: "/case-studies" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "contact", label: "Contact", href: "/contact" },
];
