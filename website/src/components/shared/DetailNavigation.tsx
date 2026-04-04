import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface DetailNavigationProps {
  prev?: NavItem;
  next?: NavItem;
  className?: string;
}

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DetailNavigation({
  prev,
  next,
  className,
}: DetailNavigationProps) {
  if (!prev && !next) return null;

  const cardClasses = cn(
    "group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4",
    "transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]"
  );

  return (
    <nav
      aria-label="Page navigation"
      className={cn("flex w-full items-stretch justify-between gap-4", className)}
    >
      {/* Previous */}
      {prev ? (
        <Link to={prev.href} className={cn(cardClasses, "mr-auto")}>
          <ArrowLeftIcon />
          <div className="flex flex-col">
            <span className="text-xs text-white/30">Previous</span>
            <span className="text-sm font-medium text-white/70 transition-colors duration-200 group-hover:text-white">
              {prev.label}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next */}
      {next ? (
        <Link to={next.href} className={cn(cardClasses, "ml-auto text-right")}>
          <div className="flex flex-col">
            <span className="text-xs text-white/30">Next</span>
            <span className="text-sm font-medium text-white/70 transition-colors duration-200 group-hover:text-white">
              {next.label}
            </span>
          </div>
          <ArrowRightIcon />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
