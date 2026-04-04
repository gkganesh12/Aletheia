import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  className?: string;
}

export default function Breadcrumbs({ crumbs, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/20">/</span>}
          {crumb.href ? (
            <Link to={crumb.href} className="text-white/40 transition-colors hover:text-white/70">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-white/60">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
