/**
 * Reset Password — Mobile.
 * Mirrors web /reset-password. Accepts token via query param, allows setting a
 * new password, then redirects to /login.
 */
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { buildNativeTheme } from "@workspace/ui/tokens";
import { apiClient } from "@workspace/api-client";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResetPasswordScreen(): React.ReactElement {
  const router = useRouter();
  const { colors: c } = useColors();
  const { t } = useLanguage();
  const theme = React.useMemo(() => buildNativeTheme(false), []);
  const params = useLocalSearchParams<{ token?: string }>();
  const token = params.token ?? "";

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const submit = async () => {
    setError(null);
    if (!token) {
      setError(t("reset_password_screen.missing_token"));
      return;
    }
    if (password.length < 8) {
      setError(t("reset_password_screen.password_min_length"));
      return;
    }
    if (password !== confirm) {
      setError(t("reset_password_screen.passwords_mismatch"));
      return;
    }
    setLoading(true);
    try {
      await apiClient.request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setTimeout(() => router.replace("/(auth)/login"), 1200);
    } catch (e: any) {
      setError(e?.message ?? t("reset_password_screen.reset_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={t("reset_password_screen.title")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.desc, { color: c.mutedForeground }]}>
          {t("reset_password_screen.description")}
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("reset_password_screen.new_password_placeholder")}
          placeholderTextColor={c.mutedForeground}
          secureTextEntry
          style={[styles.input, { color: c.foreground, borderColor: c.border }]}
        />
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          placeholder={t("reset_password_screen.confirm_password_placeholder")}
          placeholderTextColor={c.mutedForeground}
          secureTextEntry
          style={[styles.input, { color: c.foreground, borderColor: c.border }]}
        />

        {error ? (
          <Text style={[styles.error, { color: theme.colors.destructive }]}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={[styles.success, { color: c.success }]}>
            {t("reset_password_screen.success_message")}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={submit}
          disabled={loading}
          style={[styles.button, { backgroundColor: c.accent, opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color={c.accentForeground} />
          ) : (
            <Text style={[styles.buttonText, { color: c.accentForeground }]}>{t("reset_password_screen.update_button")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={[styles.link, { color: c.accent }]}>{t("reset_password_screen.back_to_sign_in")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 14 },
  desc: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: { fontSize: 13 },
  success: { fontSize: 13 },
  button: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: 12, fontSize: 14, fontWeight: "600" },
});
