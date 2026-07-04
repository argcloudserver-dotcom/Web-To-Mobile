import React from "react";
import { useAuth as useSharedAuth } from "@workspace/shared/auth";

/**
 * Compatibility bridge for older mobile screens.
 *
 * The app is now powered by the shared auth provider in app/_layout.tsx, which
 * stores Bearer tokens in SecureStore and attaches them to API calls.  Several
 * existing screens still import this local module, so keep the old names as a
 * thin wrapper instead of running a second AsyncStorage/cookie auth system.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAuthContext() {
  const auth = useSharedAuth();
  return {
    ...auth,
    user: auth.currentUser,
    refresh: auth.refetch,
    logout: auth.signOut,
  };
}

export function useAuth() {
  return useAuthContext();
}
