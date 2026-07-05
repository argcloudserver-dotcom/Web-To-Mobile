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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  async function handleRegister() {
    setError("");
    if (!name.trim()) { setError(t("auth.full_name_required")); return; }
    if (!email.trim()) { setError(t("auth.email_required")); return; }
    if (password.length < 8) { setError(t("auth.password_min_length")); return; }
    setIsLoading(true);
    try {
      await customFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() || undefined, password }),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/(auth)/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err?.data?.error ?? err?.message ?? t("auth.registration_failed"));
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
          icon="user-plus"
          title={t("register.create_your_account")}
          subtitle="TIL Real Estate CRM"
        />

        {/* Form panel */}
        <View style={s.panel}>
          <View style={s.pill} />

          <Text style={s.heading}>{t("register.join_heading")}</Text>
          <Text style={s.subheading}>{t("register.fill_details")}</Text>

          {!!error && (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color="#dc2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <UnderlineField
            label={t("register.full_name_label")}
            placeholder="Ahmed Mohamed"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            focused={focused === "name"}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            icon="user"
          />
          <UnderlineField
            label={t("register.email_label")}
            placeholder="ahmed@company.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            focused={focused === "email"}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            icon="mail"
          />
          <UnderlineField
            label={t("register.phone_label")}
            placeholder="+20 1XX XXX XXXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            focused={focused === "phone"}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused(null)}
            icon="phone"
          />
          <UnderlineField
            label={t("register.password_label")}
            placeholder={t("register.min_chars_placeholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            focused={focused === "password"}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            icon="lock"
            rightElement={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color="#9a9490" />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            onPress={handleRegister}
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
                : <Text style={s.ctaText}>{t("register.create_account_btn")}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          <View style={s.footerRow}>
            <Text style={s.footerText}>{t("register.already_have_account")}</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={s.footerLink}> {t("register.sign_in_link")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: insets.bottom + 24 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function UnderlineField({
  label, placeholder, value, onChangeText, keyboardType, autoCapitalize,
  secureTextEntry, focused, onFocus, onBlur, icon, rightElement,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  secureTextEntry?: boolean;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  icon?: React.ComponentProps<typeof Feather>["name"];
  rightElement?: React.ReactNode;
}) {
  return (
    <View style={uf.group}>
      <Text style={uf.label}>{label}</Text>
      <View style={[uf.row, focused && uf.rowFocused]}>
        {icon && <Feather name={icon} size={15} color={focused ? GOLD : "#9a9490"} style={uf.icon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#c0bcb6"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          style={uf.input}
        />
        {rightElement}
      </View>
    </View>
  );
}

const uf = StyleSheet.create({
  group: { marginBottom: 20 },
  label: { color: "#7a7672", fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 8, textTransform: "uppercase" },
  row: { flexDirection: "row", alignItems: "center", borderBottomWidth: 2, borderBottomColor: "#d8d4cd", paddingBottom: 10 },
  rowFocused: { borderBottomColor: GOLD },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2a2520", height: 28, paddingVertical: 0 },
});

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
  subheading: { color: "#9e9a94", fontSize: 13, marginBottom: 24 },
  errorBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(220,38,38,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(220,38,38,0.2)", padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 13, flex: 1 },
  ctaWrap: { borderRadius: 14, overflow: "hidden", marginTop: 8, marginBottom: 20, shadowColor: NAVY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 16, elevation: 8 },
  ctaGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15.5, letterSpacing: 0.3 },
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { color: "#9e9a94", fontSize: 13 },
  footerLink: { color: GOLD, fontSize: 13, fontWeight: "700" },
});
