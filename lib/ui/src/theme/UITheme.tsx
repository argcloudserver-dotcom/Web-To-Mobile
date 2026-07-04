import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { buildNativeTheme, type NativeTheme } from "../tokens/native";

const UIThemeContext = createContext<boolean | null>(null);

/**
 * Wrap the app (or a subtree) to make the app's own dark/light preference
 * available to every @workspace/ui component. If no provider is mounted,
 * components fall back to the device's system color scheme.
 */
export function UIThemeProvider({
  isDark,
  children,
}: {
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <UIThemeContext.Provider value={isDark}>{children}</UIThemeContext.Provider>
  );
}

/** Returns the full design-token theme object for the current mode. */
export function useUITheme(): NativeTheme {
  const providedIsDark = useContext(UIThemeContext);
  const systemScheme = useColorScheme();
  const isDark = providedIsDark ?? systemScheme !== "light";
  return buildNativeTheme(isDark);
}
