import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/contexts/LanguageContext";
import { customFetch } from "@workspace/api-client";
import { AuthHero } from "@/components/AuthHero";
import { LinearGradient } from "expo-linear-gradient";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const NAVY_MID = "#1e3560";
const NAVY_LIGHT = "#243d70";
const CREAM = "#faf9f6";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSend() {
    setError("");
    if (!email.trim()) { setError(t("forgot_password.email_required")); return; }
    setIsLoading(true);
    try {
      await customFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSent(true);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err?.data?.error ?? err?.message ?? t("forgot_password.send_failed"));
    } finally {
      setIsLoading(false);
    }
  }

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
          icon={sent ? "check-circle" : "key"}
          title={sent ? t("forgot_password.check_your_email") : t("forgot_password.reset_your_password")}
          iconColor={sent ? "#22c55e" : GOLD}
        />

        <View style={s.panel}>
          <View style={s.pill} />

          {sent ? (
            <View style={s.successBox}>
              <View style={s.successIconWrap}>
                <Feather name="check-circle" size={44} color="#22c55e" />
              </View>
              <Text style={s.successTitle}>{t("forgot_password.email_sent_title")}</Text>
              <Text style={s.successBody}>
                {t("forgot_password.email_sent_body_prefix")}{"\n"}
                <Text style={{ color: GOLD, fontWeight: "600" }}>{email}</Text>
                {"\n\n"}{t("forgot_password.email_sent_body_suffix")}
              </Text>
              <TouchableOpacity style={s.backBtn} onPress={() => router.replace("/(auth)/login")}>
                <Feather name="arrow-left" size={14} color="#7a7672" />
                <Text style={s.backBtnText}>{t("forgot_password.back_to_sign_in")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={s.heading}>{t("forgot_password.heading")}</Text>
              <Text style={s.subheading}>{t("forgot_password.subheading")}</Text>

              {!!error && (
                <View style={s.errorBox}>
                  <Feather name="alert-circle" size={14} color="#dc2626" />
                  <Text style={s.errorText}>{error}</Text>
                </View>
              )}

              <View style={s.fieldGroup}>
                <Text style={s.label}>{t("forgot_password.email_label")}</Text>
                <View style={[s.underline, focused && s.underlineFocused]}>
                  <Feather name="mail" size={15} color={focused ? GOLD : "#9a9490"} style={s.icon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@company.com"
                    placeholderTextColor="#c0bcb6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={s.textInput}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading}
                activeOpacity={0.85}
                style={[s.ctaWrap, isLoading && { opacity: 0.65 }]}
              >
                <LinearGradient
                  colors={[NAVY, NAVY_MID, NAVY_LIGHT]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={s.ctaGradient}
                >
                  {isLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.ctaText}>{t("forgot_password.send_reset_link")}</Text>
                  }
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={s.backLink} onPress={() => router.replace("/(auth)/login")}>
                <Feather name="arrow-left" size={14} color="#9a9490" />
                <Text style={s.backLinkText}>{t("forgot_password.back_to_sign_in")}</Text>
              </TouchableOpacity>
            </>
          )}

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
  fieldGroup: { marginBottom: 28 },
  label: { color: "#7a7672", fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
  underline: { flexDirection: "row", alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#d8d4cd", paddingBottom: 10 },
  underlineFocused: { borderBottomColor: GOLD },
  icon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 15, color: "#2a2520", height: 28, paddingVertical: 0 },
  ctaWrap: { borderRadius: 14, overflow: "hidden", marginBottom: 16, shadowColor: NAVY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 16, elevation: 8 },
  ctaGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15.5, letterSpacing: 0.3 },
  backLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  backLinkText: { color: "#9a9490", fontSize: 13 },
  successBox: { alignItems: "center", paddingVertical: 12 },
  successIconWrap: { marginBottom: 16 },
  successTitle: { color: NAVY, fontSize: 22, fontWeight: "800", marginBottom: 12 },
  successBody: { color: "#7a7672", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 28 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#d8d4cd" },
  backBtnText: { color: "#7a7672", fontSize: 14 },
});
