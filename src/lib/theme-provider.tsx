import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applySystemTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  applySystemTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

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
    } catch {}
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
    } catch {}
    setExplicit(false);
    setThemeState(sys);
  };

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(storageKey, t);
      localStorage.setItem(explicitKey, "true");
    } catch {}
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
      else mq.addListener(handler as any);

      return () => {
        if (mq.removeEventListener) mq.removeEventListener("change", handler);
        else mq.removeListener(handler as any);
      };
    } catch {
      return;
    }
  }, [explicit]);

  const value = {
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

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};