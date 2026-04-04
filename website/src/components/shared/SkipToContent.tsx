export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:bg-accent-400 focus:px-4 focus:py-2 focus:font-medium focus:text-black"
    >
      Skip to main content
    </a>
  );
}
