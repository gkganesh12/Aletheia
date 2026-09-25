import { brand } from "@/data/brand";
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src={brand.logo}
      alt={brand.name}
      width="2144"
      height="733"
    />
  );
}
