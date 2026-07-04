/**
 * Complete Profile — Mobile.
 * Mirrors web /complete-profile. Shown to OAuth users whose profile is
 * incomplete (missing role/phone). Submits to /auth/complete-profile.
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
import { useRouter } from "expo-router";
import { apiClient } from "@workspace/api-client";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

const ROLES = ["sales", "team_leader", "director"] as const;
const ROLE_LABEL_KEYS = {
  sales: "complete_profile_screen.role_sales",
  team_leader: "complete_profile_screen.role_team_leader",
  director: "complete_profile_screen.role_director",
} as const;

export default function CompleteProfileScreen(): React.ReactElement {
  const router = useRouter();
  const { colors: c } = useColors();
  const { currentUser, refresh } = useAuth() as any;
  const { t } = useLanguage();

  const [name, setName] = React.useState(currentUser?.name ?? "");
  const [phone, setPhone] = React.useState(currentUser?.phone ?? "");
  const [role, setRole] = React.useState<(typeof ROLES)[number]>("sales");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name || !phone) {
      setError(t("complete_profile_screen.required_error"));
      return;
    }
    setLoading(true);
    try {
      await apiClient.request("/auth/complete-profile", {
        method: "POST",
        body: JSON.stringify({ phone, role }),
        headers: { "Content-Type": "application/json" },
      });
      await refresh?.();
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? t("complete_profile_screen.submit_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={t("complete_profile_screen.title")} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.desc, { color: c.mutedForeground }]}>
          {t("complete_profile_screen.description")}
        </Text>

        <Text style={[styles.label, { color: c.foreground }]}>{t("complete_profile_screen.full_name_label")}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t("complete_profile_screen.full_name_placeholder")}
          placeholderTextColor={c.mutedForeground}
          style={[styles.input, { color: c.foreground, borderColor: c.border }]}
        />

        <Text style={[styles.label, { color: c.foreground }]}>{t("complete_profile_screen.phone_label")}</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+20 ..."
          placeholderTextColor={c.mutedForeground}
          keyboardType="phone-pad"
          style={[styles.input, { color: c.foreground, borderColor: c.border }]}
        />

        <Text style={[styles.label, { color: c.foreground }]}>{t("complete_profile_screen.role_label")}</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => {
            const active = role === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: active ? c.accent : "transparent",
                    borderColor: active ? c.accent : c.border,
                  },
                ]}
              >
                <Text style={{ color: active ? "#fff" : c.foreground, fontWeight: "600", fontSize: 12 }}>
                  {t(ROLE_LABEL_KEYS[r])}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error ? <Text style={[styles.error, { color: c.danger }]}>{error}</Text> : null}

        <TouchableOpacity
          onPress={submit}
          disabled={loading}
          style={[styles.button, { backgroundColor: c.accent, opacity: loading ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("complete_profile_screen.continue_button")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 10 },
  desc: { fontSize: 14, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "600", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  error: { fontSize: 13, marginTop: 4 },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
