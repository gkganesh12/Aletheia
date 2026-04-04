import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────── */
/*  Size map                                                              */
/* ────────────────────────────────────────────────────────────────────── */

const sizeStyles = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
} as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export type ContainerSize = keyof typeof sizeStyles;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max-width preset. @default "default" */
  size?: ContainerSize;
  children?: ReactNode;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                             */
/* ────────────────────────────────────────────────────────────────────── */

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          sizeStyles[size],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Container";

export { Container };
