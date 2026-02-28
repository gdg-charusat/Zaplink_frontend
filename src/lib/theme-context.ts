import { createContext } from "react";

export type Theme = "dark" | "light";

export type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    applySystemTheme: () => void;
};

export const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
    applySystemTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
