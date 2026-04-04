import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Variant & size maps                                                   */
/* ────────────────────────────────────────────────────────────────────── */

const variantStyles = {
  primary:
    "bg-accent-400 text-black font-semibold hover:bg-accent-500 focus-visible:ring-accent-400/50 shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  secondary:
    "border border-white/20 text-white hover:bg-white/10 focus-visible:ring-white/25",
  ghost:
    "text-white/70 hover:text-white hover:bg-white/5 focus-visible:ring-white/25",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-7 text-base rounded-xl gap-2.5",
} as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. @default "primary" */
  variant?: ButtonVariant;
  /** Predefined size. @default "md" */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /**
   * When `true`, the component merges its props onto its single child element
   * instead of rendering a `<button>`. Useful for wrapping `<a>` or router
   * links while keeping consistent styling.
   */
  asChild?: boolean;
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Spinner                                                               */
/* ────────────────────────────────────────────────────────────────────── */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      // Base
      "inline-flex items-center justify-center whitespace-nowrap font-medium",
      "transition-colors duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950",
      "disabled:pointer-events-none disabled:opacity-50",
      "select-none cursor-pointer",
      // Variant + size
      variantStyles[variant],
      sizeStyles[size],
      className,
    );

    /* ── asChild: merge onto single child ──────────────────────────── */
    if (asChild) {
      // Basic slot implementation: renders a styled <span> wrapping children.
      // For production you might swap this with Radix Slot; this keeps deps minimal.
      return (
        <span ref={ref as never} className={classes} {...rest}>
          {children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={classes}
        {...rest}
      >
        {loading && <Spinner className="shrink-0" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
