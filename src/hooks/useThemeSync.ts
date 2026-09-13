import { useEffect } from "react";

import { useThemeStore } from "../stores/themeStore";

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
}
