import { cn } from "@/lib/utils";

interface FilterButtonsProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  className?: string;
}

export default function FilterButtons({
  categories,
  active,
  onChange,
  className,
}: FilterButtonsProps) {
  const allCategories = ["All", ...categories.filter((c) => c !== "All")];

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
        className
      )}
      role="tablist"
      aria-label="Filter categories"
    >
      {allCategories.map((category) => {
        const isActive = active === category;

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-sm transition-all duration-200",
              isActive
                ? "bg-[var(--color-accent-400)] font-semibold text-black"
                : "border border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
