import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UIThemeProvider } from "@workspace/ui";

const STORAGE_KEY = "@til_theme_preference";
const STORAGE_VERSION_KEY = "@til_theme_storage_version";
const STORAGE_VERSION = "2";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const version = await AsyncStorage.getItem(STORAGE_VERSION_KEY);
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (cancelled) return;

      if (version !== STORAGE_VERSION) {
        const next = colorScheme === "dark" ? "dark" : "light";
        await AsyncStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
        await AsyncStorage.setItem(STORAGE_KEY, next);
        setIsDark(next === "dark");
        return;
      }

      if (saved === "light") setIsDark(false);
      else if (saved === "dark") setIsDark(true);
      else setIsDark(colorScheme === "dark");
    })().catch(() => {
      setIsDark(colorScheme === "dark");
    });

    return () => {
      cancelled = true;
    };
  }, [colorScheme]);

  function toggleTheme() {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <UIThemeProvider isDark={isDark}>{children}</UIThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
