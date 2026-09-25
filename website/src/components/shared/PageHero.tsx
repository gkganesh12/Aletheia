import { Container } from "@/components/ui";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
interface PageHeroProps {
  overline?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}
export default function PageHero({
  overline,
  title,
  description,
  breadcrumbs,
  children,
  className = "",
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`page-hero ${compact ? "compact" : ""} ${className}`}>
      <Container>
        {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} className="mb-8" />}
        {overline && <p className="eyebrow">{overline}</p>}
        <h1>{title}</h1>
        {description && <p className="page-intro">{description}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
