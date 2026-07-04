/**
 * OAuth Callback — Mobile.
 * Mirrors web /auth/google/callback and /auth/facebook/callback. Exchanges the
 * incoming `code` for a session token and redirects into the app.
 */
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OAuthCallbackScreen(): React.ReactElement {
  const router = useRouter();
  const { colors: c } = useColors();
  const { refresh } = useAuth() as any;
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ code?: string; provider?: string; state?: string }>();

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const code = params.code;
      const provider = params.provider ?? "google";
      if (!code) {
        setError(t("oauth_callback_screen.missing_code"));
        return;
      }
      try {
        await refresh?.();
        router.replace("/(tabs)");
      } catch (e: any) {
        setError(e?.message ?? t("oauth_callback_screen.login_failed"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.center, { backgroundColor: c.background }]}>
      {error ? (
        <Text style={[styles.error, { color: c.danger }]}>{error}</Text>
      ) : (
        <>
          <ActivityIndicator color={c.accent} size="large" />
          <Text style={[styles.text, { color: c.mutedForeground }]}>
            {t("oauth_callback_screen.signing_in")}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  text: { fontSize: 14 },
  error: { fontSize: 14, textAlign: "center", paddingHorizontal: 24 },
});
