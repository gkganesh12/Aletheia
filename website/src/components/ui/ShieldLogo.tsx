import { cn } from "@/lib/utils";

interface ShieldLogoProps {
  className?: string;
  size?: number;
}

export default function ShieldLogo({ className, size = 36 }: ShieldLogoProps) {
  return (
    <img
      src="/images/shield-logo.svg"
      alt="Aletheia AI"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}
