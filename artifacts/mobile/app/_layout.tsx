import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 1. Cleaned up API Client imports
import { setBaseUrl } from "@workspace/api-client";
// 2. Imported useAuth directly from the shared package
import { AuthProvider as SharedAuthProvider, useAuth } from "@workspace/shared/auth";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
// 3. Replaced the unsecure adapter with the newly created secure one
import { secureSessionAdapter } from "@/lib/session-storage";

function resolveApiBaseUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    const normalized = configuredUrl.replace(/\/+$/, "");
    if (
      Platform.OS === "android" &&
      /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)
    ) {
      return normalized.replace(/(localhost|127\.0\.0\.1)/i, "10.0.2.2");
    }
    return normalized;
  }

  const domain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (domain) {
    const normalizedDomain = domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    return `https://${normalizedDomain}`;
  }

  return Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";
}

setBaseUrl(resolveApiBaseUrl());

// (Removed the hardcoded AsyncStorage setAuthTokenGetter)

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  // 4. Mapped currentUser from useAuth to keep the logic intact
  const { currentUser: user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    const currentPath = "/" + segments.join("/");

    // Public / mid-flow auth paths that MUST remain accessible even with a session.
    const midFlowPaths = [
      "/(auth)/reset-password",
      "/(auth)/pending-approval",
      "/(auth)/complete-profile",
      "/(auth)/oauth-callback",
      "/(auth)/verify-email",
      "/(auth)/forgot-password",
    ];
    const isMidFlow = midFlowPaths.some((p) => currentPath.startsWith(p));

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }
    if (user) {
      // Mirror web: OAuth users needing profile completion go there first.
      if ((user as any).profileCompleted === false) {
        if (!currentPath.startsWith("/(auth)/complete-profile")) {
          router.replace("/(auth)/complete-profile");
        }
        return;
      }
      // Pending / rejected accounts cannot reach the CRM.
      if ((user as any).status === "pending" || (user as any).status === "rejected") {
        if (!currentPath.startsWith("/(auth)/pending-approval")) {
          router.replace("/(auth)/pending-approval");
        }
        return;
      }
      if (inAuthGroup && !isMidFlow) {
        router.replace("/(tabs)");
      }
    }
  }, [user, isLoading, segments, router]);

  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <AuthGate>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            {/* 6. Wired the SharedAuthProvider with the secure adapter and 'mobile' client type */}
            <SharedAuthProvider storage={secureSessionAdapter} client="mobile">
              {/* 7. Removed the duplicate local <AuthProvider> */}
              <LanguageProvider>
                <GestureHandlerRootView>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </LanguageProvider>
            </SharedAuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
