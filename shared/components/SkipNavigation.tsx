export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-cyan-500 focus:text-white focus:rounded-lg focus:font-medium focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
