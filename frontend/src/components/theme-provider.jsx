import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: (_theme) => {},
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Apply the theme by setting `light` or `dark` on <html>.
  // For `system`, we read the current OS preference once (no live listener).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    const resolvedClass =
      theme === "system"
        ? window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    root.classList.add(resolvedClass);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {}
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
