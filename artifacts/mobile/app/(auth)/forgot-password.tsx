import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Dimensions,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { shadow } from "@/lib/shadow";
import { customFetch } from "@workspace/api-client";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH < 375;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export default function ForgotPasswordScreen() {
  const theme = useColors();
  const c = theme.colors;
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const cardOpacity = useSharedValue(0);
  const cardY = useSharedValue(30);
  const headingOpacity = useSharedValue(0);

  useEffect(() => {
    headingOpacity.value = withTiming(1, { duration: 400, easing: EASE });
    cardOpacity.value = withDelay(120, withTiming(1, { duration: 500, easing: EASE }));
    cardY.value = withDelay(120, withTiming(0, { duration: 500, easing: EASE }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardY.value }],
  }));
  const headingStyle = useAnimatedStyle(() => ({ opacity: headingOpacity.value }));

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

  const s = makeStyles(isDark);

  return (
    <View style={[s.container, { backgroundColor: c.background }]}>
      <View style={[s.goldRule, { backgroundColor: c.accent }]} />
      <KeyboardAwareScrollViewCompat style={s.container} contentContainerStyle={[s.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>

        <Animated.View style={[s.header, headingStyle]}>
          <View style={s.logoOuter}>
            <View style={[s.logoInner, { backgroundColor: c.accent }]}>
              <Feather name={sent ? "check" : "key"} size={isSmallScreen ? 22 : 26} color={c.accentForeground} />
            </View>
          </View>
          <Text style={[s.brand, { color: c.accent }]}>PropOS</Text>
          <View style={s.brandRule} />
          <Text style={[s.subtitle, { color: c.mutedForeground }]}>
            {sent ? t("forgot_password.check_your_email") : t("forgot_password.reset_your_password")}
          </Text>
        </Animated.View>

        <Animated.View style={[s.formCard, { backgroundColor: c.card }, cardStyle]}>
          {sent ? (
            <View style={s.successBox}>
              <View style={s.successIcon}>
                <Feather name="check-circle" size={40} color={c.success} />
              </View>
              <Text style={[s.successTitle, { color: c.foreground }]}>{t("forgot_password.email_sent_title")}</Text>
              <Text style={[s.successBody, { color: c.mutedForeground }]}>
                {t("forgot_password.email_sent_body_prefix")}{"\n"}
                <Text style={{ color: c.accent, fontWeight: "600" }}>{email}</Text>
                {"\n\n"}{t("forgot_password.email_sent_body_suffix")}
              </Text>
              <TouchableOpacity style={[s.backBtn, { borderColor: c.border }]} onPress={() => router.replace("/(auth)/login")}>
                <Feather name="arrow-left" size={14} color={c.mutedForeground} />
                <Text style={[s.backBtnText, { color: c.mutedForeground }]}>{t("forgot_password.back_to_sign_in")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[s.welcome, { color: c.foreground }]}>{t("forgot_password.heading")}</Text>
              <Text style={[s.welcomeSub, { color: c.mutedForeground }]}>
                {t("forgot_password.subheading")}
              </Text>

              <Text style={[s.label, { color: focused ? c.accent : c.mutedForeground }]}>{t("forgot_password.email_label")}</Text>
              <View style={[s.inputBox, { backgroundColor: c.muted, borderColor: focused ? c.accent : c.border }]}>
                <Feather name="mail" size={16} color={focused ? c.accent : c.mutedForeground} style={s.inputIcon} />
                <TextInput
                  style={[s.input, { color: c.foreground }]}
                  placeholder="you@company.com"
                  placeholderTextColor={c.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </View>

              {!!error && (
                <View style={[s.errorBox, { backgroundColor: c.dangerMuted, borderColor: c.danger }]}>
                  <Feather name="alert-circle" size={14} color={c.danger} />
                  <Text style={[s.errorText, { color: c.danger }]}>{error}</Text>
                </View>
              )}

              <View style={s.btnWrap}>
                <TouchableOpacity style={[s.sendBtn, { backgroundColor: c.accent, ...shadow({ color: c.accent, opacity: 0.4, radius: 12, elevation: 7 }) }, isLoading && s.btnDisabled]} onPress={handleSend} disabled={isLoading} activeOpacity={0.85}>
                  {isLoading ? <ActivityIndicator color={c.accentForeground} /> : <Text style={[s.sendBtnText, { color: c.accentForeground }]}>{t("forgot_password.send_reset_link")}</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={s.backLink} onPress={() => router.replace("/(auth)/login")}>
                <Feather name="arrow-left" size={14} color={c.mutedForeground} />
                <Text style={[s.backLinkText, { color: c.mutedForeground }]}>{t("forgot_password.back_to_sign_in")}</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

function makeStyles(isDark: boolean) {
  return StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: isSmallScreen ? 16 : 24 },
    goldRule: { position: "absolute", top: 0, left: 0, right: 0, height: 2, opacity: 0.7 },
    header: { alignItems: "center", marginBottom: 28 },
    logoOuter: { width: isSmallScreen ? 64 : 72, height: isSmallScreen ? 64 : 72, borderRadius: 20, backgroundColor: "rgba(201,168,76,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1, borderColor: "rgba(200,168,75,0.3)" },
    logoInner: { width: isSmallScreen ? 50 : 56, height: isSmallScreen ? 50 : 56, borderRadius: 15, alignItems: "center", justifyContent: "center" },
    brand: { fontSize: isSmallScreen ? 22 : 24, fontWeight: "700" },
    brandRule: { width: 32, height: 1, backgroundColor: "rgba(200,168,75,0.4)", marginVertical: 8 },
    subtitle: { fontSize: isSmallScreen ? 12 : 13 },
    formCard: { borderRadius: 16, padding: isSmallScreen ? 20 : 24, ...shadow({ opacity: 0.25, radius: 24, elevation: 10 }), borderWidth: 1, borderColor: "rgba(200,168,75,0.12)" },
    welcome: { fontSize: isSmallScreen ? 19 : 21, fontWeight: "700", marginBottom: 4 },
    welcomeSub: { fontSize: 13, marginBottom: 22, lineHeight: 20 },
    label: { fontSize: 11, fontWeight: "600", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.6 },
    inputBox: { flexDirection: "row", alignItems: "center", borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 14, height: 48 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15 },
    errorBox: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, padding: 12, marginTop: 12, borderWidth: 1 },
    errorText: { fontSize: 13, flex: 1 },
    btnWrap: { marginTop: 22 },
    sendBtn: { borderRadius: 12, height: 50, alignItems: "center", justifyContent: "center" },
    btnDisabled: { opacity: 0.65 },
    sendBtnText: { fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
    backLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18 },
    backLinkText: { fontSize: 13 },
    successBox: { alignItems: "center", paddingVertical: 12 },
    successIcon: { marginBottom: 16 },
    successTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
    successBody: { fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 28 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
    backBtnText: { fontSize: 14 },
  });
}
