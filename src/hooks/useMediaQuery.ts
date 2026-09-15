import { useEffect, useState } from "react";

// For CSS-only responsive styling, prefer Tailwind's md:/lg: classes —
// this hook is for cases where the breakpoint decision needs to reach
// actual JS logic (conditional rendering, choosing which data to fetch,
// toggling a feature on/off), not just which classes apply.
//
// Usage: const isDesktop = useMediaQuery("(min-width: 768px)");
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Re-sync in case `query` itself changed since the last render —
    // the lazy initializer above only runs once, on mount.
    setMatches(mediaQueryList.matches);

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
