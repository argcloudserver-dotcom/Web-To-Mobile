import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
const RESEND_COOLDOWN = 60;

function useCountdown() {
  const [seconds, setSeconds] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const start = useCallback(() => {
    setSeconds(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(s => { if (s <= 1) { clearInterval(timerRef.current!); return 0; } return s - 1; });
    }, 1000);
  }, []);
  useEffect(() => { start(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [start]);
  return { seconds, start, canResend: seconds === 0 };
}

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email = "" } = useLocalSearchParams<{ email: string }>();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const { seconds, start: startCountdown, canResend } = useCountdown();

  async function handleVerify() {
    setError("");
    if (code.length !== 6) { setError(t("verify_email_screen.code_required")); return; }
    setIsLoading(true);
    try {
      await customFetch("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(auth)/login");
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err?.data?.error ?? err?.message ?? t("verify_email_screen.verification_failed"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setIsResending(true);
    try {
      await customFetch("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      startCountdown();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setError(err?.data?.error ?? err?.message ?? t("verify_email_screen.resend_failed"));
    } finally {
      setIsResending(false);
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
          icon="shield"
          title={t("verify_email_screen.email_verification")}
          subtitle={t("auth.verify_email")}
        />

        <View style={s.panel}>
          <View style={s.pill} />

          <Text style={s.heading}>{t("auth.verify_email")}</Text>
          <Text style={s.subheading}>{t("auth.verify_code")}</Text>
          {!!email && (
            <Text style={s.emailHighlight}>{email}</Text>
          )}

          {!!error && (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color="#dc2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* OTP code box */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>{t("verify_email_screen.verification_code_label")}</Text>
            <View style={[s.codeWrap, focused && s.codeWrapFocused]}>
              <TextInput
                value={code}
                onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
                placeholder="0  0  0  0  0  0"
                placeholderTextColor="#c0bcb6"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={s.codeInput}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            disabled={isLoading || code.length !== 6}
            activeOpacity={0.85}
            style={[s.ctaWrap, (isLoading || code.length !== 6) && { opacity: 0.5 }]}
          >
            <LinearGradient
              colors={[NAVY, NAVY_MID, NAVY_LIGHT]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.ctaGradient}
            >
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.ctaText}>{t("verify_email_screen.verify_button")}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <View style={s.resendRow}>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={s.backText}>{t("verify_email_screen.back_to_sign_in")}</Text>
            </TouchableOpacity>
            {canResend ? (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                {isResending
                  ? <ActivityIndicator size="small" color={GOLD} />
                  : <Text style={s.resendText}>{t("auth.resend_code")}</Text>
                }
              </TouchableOpacity>
            ) : (
              <Text style={s.countdownText}>
                {t("auth.resend_in")} <Text style={{ color: GOLD }}>{seconds}s</Text>
              </Text>
            )}
          </View>

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
  subheading: { color: "#9e9a94", fontSize: 13, lineHeight: 20 },
  emailHighlight: { color: GOLD, fontSize: 14, fontWeight: "600", marginTop: 4, marginBottom: 16 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(220,38,38,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(220,38,38,0.2)", padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 13, flex: 1 },
  fieldGroup: { marginTop: 20, marginBottom: 28 },
  label: { color: "#7a7672", fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 12, textTransform: "uppercase" },
  codeWrap: { borderBottomWidth: 2, borderBottomColor: "#d8d4cd", paddingBottom: 10, alignItems: "center" },
  codeWrapFocused: { borderBottomColor: GOLD },
  codeInput: { fontSize: 32, fontWeight: "700", letterSpacing: 14, textAlign: "center", color: NAVY, height: 48 },
  ctaWrap: { borderRadius: 14, overflow: "hidden", marginBottom: 20, shadowColor: NAVY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 16, elevation: 8 },
  ctaGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15.5, letterSpacing: 0.3 },
  resendRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backText: { color: "#9a9490", fontSize: 13 },
  resendText: { color: GOLD, fontSize: 13, fontWeight: "600" },
  countdownText: { color: "#9a9490", fontSize: 12 },
});
