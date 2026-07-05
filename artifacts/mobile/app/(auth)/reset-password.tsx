import React, { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiClient } from "@workspace/api-client";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthHero } from "@/components/AuthHero";
import { LinearGradient } from "expo-linear-gradient";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const NAVY_MID = "#1e3560";
const NAVY_LIGHT = "#243d70";
const CREAM = "#faf9f6";

export default function ResetPasswordScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ token?: string }>();
  const token = params.token ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!token) { setError(t("reset_password_screen.missing_token")); return; }
    if (password.length < 8) { setError(t("reset_password_screen.password_min_length")); return; }
    if (password !== confirm) { setError(t("reset_password_screen.passwords_mismatch")); return; }
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
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <AuthHero
          icon="lock"
          title={t("reset_password_screen.title")}
          subtitle={t("reset_password_screen.description")}
        />

        <View style={s.panel}>
          <View style={s.pill} />

          <Text style={s.heading}>{t("reset_password_screen.title")}</Text>
          <Text style={s.subheading}>{t("reset_password_screen.description")}</Text>

          {error ? (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color="#dc2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={s.successBox}>
              <Feather name="check-circle" size={14} color="#22c55e" />
              <Text style={s.successText}>{t("reset_password_screen.success_message")}</Text>
            </View>
          ) : null}

          {/* New Password */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>{t("reset_password_screen.new_password_placeholder")}</Text>
            <View style={[s.underline, focused === "pass" && s.underlineFocused]}>
              <Feather name="lock" size={15} color={focused === "pass" ? GOLD : "#9a9490"} style={s.icon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#c0bcb6"
                secureTextEntry={!showPass}
                onFocus={() => setFocused("pass")}
                onBlur={() => setFocused(null)}
                style={s.textInput}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name={showPass ? "eye-off" : "eye"} size={15} color="#9a9490" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>{t("reset_password_screen.confirm_password_placeholder")}</Text>
            <View style={[s.underline, focused === "conf" && s.underlineFocused]}>
              <Feather name="lock" size={15} color={focused === "conf" ? GOLD : "#9a9490"} style={s.icon} />
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="••••••••"
                placeholderTextColor="#c0bcb6"
                secureTextEntry={!showConf}
                onFocus={() => setFocused("conf")}
                onBlur={() => setFocused(null)}
                style={s.textInput}
              />
              <TouchableOpacity onPress={() => setShowConf(!showConf)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Feather name={showConf ? "eye-off" : "eye"} size={15} color="#9a9490" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={submit}
            disabled={loading}
            activeOpacity={0.85}
            style={[s.ctaWrap, loading && { opacity: 0.65 }]}
          >
            <LinearGradient
              colors={[NAVY, NAVY_MID, NAVY_LIGHT]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.ctaGradient}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.ctaText}>{t("reset_password_screen.update_button")}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={s.backLink} onPress={() => router.replace("/(auth)/login")}>
            <Feather name="arrow-left" size={14} color="#9a9490" />
            <Text style={s.backLinkText}>{t("reset_password_screen.back_to_sign_in")}</Text>
          </TouchableOpacity>

          <View style={{ height: insets.bottom + 24 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a1520" },
  panel: {
    backgroundColor: CREAM,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 18,
    flex: 1,
  },
  pill: { width: 38, height: 4, borderRadius: 2, backgroundColor: "#ccc9c3", alignSelf: "center", marginBottom: 22 },
  heading: { color: NAVY, fontSize: 22, fontWeight: "800", letterSpacing: -0.4, marginBottom: 4 },
  subheading: { color: "#9e9a94", fontSize: 13, marginBottom: 24, lineHeight: 20 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(220,38,38,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(220,38,38,0.2)", padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 13, flex: 1 },
  successBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(34,197,94,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(34,197,94,0.2)", padding: 12, marginBottom: 16 },
  successText: { color: "#22c55e", fontSize: 13, flex: 1 },
  fieldGroup: { marginBottom: 22 },
  label: { color: "#7a7672", fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
  underline: { flexDirection: "row", alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#d8d4cd", paddingBottom: 10 },
  underlineFocused: { borderBottomColor: GOLD },
  icon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: "#2a2520", height: 28, paddingVertical: 0 },
  ctaWrap: { borderRadius: 14, overflow: "hidden", marginTop: 8, marginBottom: 16, shadowColor: NAVY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 16, elevation: 8 },
  ctaGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15.5, letterSpacing: 0.3 },
  backLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  backLinkText: { color: "#9a9490", fontSize: 13 },
});
