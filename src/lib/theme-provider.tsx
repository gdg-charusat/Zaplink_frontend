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
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Update CSS variables based on theme
    if (theme === "light") {
      document.documentElement.style.setProperty("--background", "#f8fafc");
      document.documentElement.style.setProperty("--foreground", "#1e293b");
      document.documentElement.style.setProperty("--card", "#ffffff");
      document.documentElement.style.setProperty(
        "--card-foreground",
        "#1e293b"
      );
      document.documentElement.style.setProperty("--border", "#e2e8f0");
    } else {
      document.documentElement.style.setProperty("--background", "#1e293b");
      document.documentElement.style.setProperty("--foreground", "#f8fafc");
      document.documentElement.style.setProperty("--card", "#334155");
      document.documentElement.style.setProperty(
        "--card-foreground",
        "#f8fafc"
      );
      document.documentElement.style.setProperty("--border", "#475569");
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
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
