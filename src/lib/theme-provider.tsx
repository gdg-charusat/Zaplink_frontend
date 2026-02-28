import { useEffect, useState } from "react";
import { ThemeProviderContext, type Theme, type ThemeProviderState } from "./theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "zaplink-theme",
  ...props
}: ThemeProviderProps) {
  const explicitKey = `${storageKey}-explicit`;

  const [explicit, setExplicit] = useState<boolean>(() => {
    try {
      return localStorage.getItem(explicitKey) === "true";
    } catch {
      return false;
    }
  });

  const detectSystem = (): Theme => {
    try {
      if (window?.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    } catch {
      // Ignore matchMedia errors and fall back to default theme
    }
    return defaultTheme;
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") return stored;
      return detectSystem();
    } catch {
      // Ignore storage read errors and fall back to default
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Apply system theme and mark as non-explicit (useful for "apply on login")
  const applySystemTheme = () => {
    const sys = detectSystem();
    try {
      localStorage.setItem(storageKey, sys);
      localStorage.setItem(explicitKey, "false");
    } catch {
      // Ignore storage write errors
    }
    setExplicit(false);
    setThemeState(sys);
  };

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(storageKey, t);
      localStorage.setItem(explicitKey, "true");
    } catch {
      // Ignore storage write errors
    }
    setExplicit(true);
    setThemeState(t);
  };

  // Listen for system changes only when user hasn't explicitly chosen a theme
  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        if (!explicit) {
          setThemeState(e.matches ? "dark" : "light");
        }
      };
      // old and new API support
      if (mq.addEventListener) mq.addEventListener("change", handler);
      else mq.addListener(handler);

      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else mq.removeListener(handler);
      };
    } catch {
      // Ignore matchMedia errors; theme will stay as-is
      return;
    }
  }, [explicit]);

  const value: ThemeProviderState = {
    theme,
    setTheme,
    applySystemTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
