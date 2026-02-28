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
    } catch (e) {
      console.warn("Theme detection failed:", e);
    }
    return defaultTheme;
  };

  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark") return stored;
      return detectSystem();
    } catch {
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
    } catch (e) {
      console.warn("Theme storage failed:", e);
    }
    setExplicit(false);
    setThemeState(sys);
  };

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(storageKey, t);
      localStorage.setItem(explicitKey, "true");
    } catch (e) {
      console.warn("Theme storage failed:", e);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else (mq as any).addListener(handler);

      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        else (mq as any).removeListener(handler);
      };
    } catch {
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