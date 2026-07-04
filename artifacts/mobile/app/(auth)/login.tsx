import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Line } from "react-native-svg";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, type LoginFormValues } from "@workspace/api-client/zod/auth";
import { useLogin } from "@workspace/api-client/hooks/auth";
import { useAuth } from "@workspace/shared/auth";
import { useLanguage } from "@/contexts/LanguageContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_H = SCREEN_HEIGHT * 0.48;

const GOLD = "#c9a84c";
const GOLD_BRIGHT = "#e8c96a";
const NAVY_DEEP = "#0a1520";
const NAVY = "#0f1e35";
const NAVY_MID = "#1e3560";
const NAVY_LIGHT = "#243d70";
const CREAM = "#faf9f6";

type LoginSuccessPayload = {
  user?: { id?: string };
  token?: string;
  accessToken?: string;
};

// Window-light positions: [xOf400, yPercentOfHero]
const LIGHTS = [
  [12,58],[12,68],[25,50],[38,42],[38,54],[52,34],[52,46],[66,32],
  [80,28],[80,40],[94,26],[94,38],[108,44],[120,32],[120,44],
  [134,48],[148,36],[148,50],[162,40],[176,52],[190,44],[204,52],
  [218,38],[230,46],[244,56],[256,44],[270,50],[282,54],[294,46],[308,48],
  [322,40],[334,52],[348,44],[362,56],[376,50],[390,58],
] as const;

// Perspective lines: 7 rays emanating from the vanishing point
const PERSP_ANGLES = [-5, -3, -1.5, 0, 1.5, 3, 5];

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useLanguage();
  const { setToken, refetch } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (data) => {
        const payload = data as unknown as LoginSuccessPayload;
        const token = payload.token ?? payload.accessToken ?? null;
        if (!token) { setServerError(t("auth.session_error")); return; }
        await setToken(token);
        refetch();
        router.replace("/(tabs)");
      },
      onError: (err: unknown) => {
        setServerError(err instanceof Error ? err.message : t("auth.login_failed"));
      },
    },
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    loginMutation.mutate({ data: { ...values, client: "mobile" } as typeof values & { client: "mobile" } });
  });

  const submitting = isSubmitting || loginMutation.isPending;

  // Vanishing-point coords (centre, 82% down the hero)
  const vpX = SCREEN_WIDTH / 2;
  const vpY = HERO_H * 0.82;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ─────────── HERO ─────────── */}
      <View style={{ height: HERO_H, overflow: "hidden" }}>

        {/* Background gradient */}
        <LinearGradient
          colors={[NAVY_DEEP, "#132035", "#1c3256", NAVY_LIGHT]}
          locations={[0, 0.3, 0.65, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Sky radial overlay — SVG circle gradient */}
        <Svg
          width={SCREEN_WIDTH}
          height={HERO_H}
          style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
        >
          {/* Perspective rays from vanishing point */}
          {PERSP_ANGLES.map((deg, i) => {
            const rad = (deg * 6 * Math.PI) / 180;
            const len = SCREEN_WIDTH * 2.5;
            const opacity = 0.018 + (3 - Math.abs(deg)) * 0.006;
            return (
              <Line
                key={i}
                x1={vpX} y1={vpY}
                x2={vpX + len * Math.cos(rad)}
                y2={vpY - len * Math.sin(rad)}
                stroke={`rgba(255,255,255,${opacity.toFixed(3)})`}
                strokeWidth={1}
              />
            );
          })}

          {/* City: far layer (tallest, faintest) */}
          <Svg
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            x={0} y={HERO_H - (HERO_H * 0.62)}
            width={SCREEN_WIDTH}
            height={HERO_H * 0.62}
          >
            <Path
              d="M0,100 L0,65 L12,65 L12,50 L22,50 L22,38 L30,38 L30,28 L38,28 L38,38 L50,38 L50,65 L62,65 L62,48 L72,48 L72,36 L80,36 L80,26 L88,26 L88,16 L96,16 L96,26 L106,26 L106,36 L118,36 L118,55 L130,55 L130,40 L140,40 L140,30 L150,30 L150,20 L158,20 L158,30 L170,30 L170,45 L182,45 L182,32 L192,32 L192,45 L205,45 L205,60 L216,60 L216,46 L226,46 L226,36 L234,36 L234,26 L242,26 L242,36 L254,36 L254,50 L266,50 L266,38 L276,38 L276,50 L290,50 L290,60 L302,60 L302,44 L312,44 L312,34 L320,34 L320,44 L334,44 L334,58 L346,58 L346,46 L358,46 L358,58 L370,58 L370,50 L382,50 L382,60 L400,60 L400,100 Z"
              fill="rgba(255,255,255,0.035)"
            />
          </Svg>

          {/* City: mid layer */}
          <Svg
            viewBox="0 0 400 85"
            preserveAspectRatio="none"
            x={0} y={HERO_H - (HERO_H * 0.55)}
            width={SCREEN_WIDTH}
            height={HERO_H * 0.55}
          >
            <Path
              d="M0,85 L0,62 L16,62 L16,50 L28,50 L28,40 L36,40 L36,32 L44,32 L44,40 L58,40 L58,62 L70,62 L70,48 L82,48 L82,38 L90,38 L90,28 L98,28 L98,20 L106,20 L106,28 L120,28 L120,44 L132,44 L132,56 L144,56 L144,42 L154,42 L154,32 L162,32 L162,42 L176,42 L176,58 L188,58 L188,46 L200,46 L200,58 L212,58 L212,44 L222,44 L222,34 L230,34 L230,44 L244,44 L244,56 L256,56 L256,44 L268,44 L268,56 L280,56 L280,62 L292,62 L292,50 L302,50 L302,40 L310,40 L310,50 L324,50 L324,62 L336,62 L336,50 L348,50 L348,62 L362,62 L362,54 L374,54 L374,62 L400,62 L400,85 Z"
              fill="rgba(255,255,255,0.065)"
            />
          </Svg>

          {/* City: foreground layer (clearest) */}
          <Svg
            viewBox="0 0 400 70"
            preserveAspectRatio="none"
            x={0} y={HERO_H - (HERO_H * 0.44)}
            width={SCREEN_WIDTH}
            height={HERO_H * 0.44}
          >
            <Path
              d="M0,70 L0,55 L20,55 L20,46 L32,46 L32,55 L50,55 L50,42 L60,42 L60,36 L68,36 L68,42 L84,42 L84,56 L96,56 L96,44 L106,44 L106,36 L114,36 L114,28 L122,28 L122,36 L136,36 L136,52 L148,52 L148,60 L160,60 L160,48 L170,48 L170,38 L178,38 L178,48 L192,48 L192,58 L204,58 L204,48 L216,48 L216,58 L228,58 L228,46 L238,46 L238,36 L246,36 L246,46 L260,46 L260,56 L272,56 L272,46 L284,46 L284,56 L298,56 L298,62 L310,62 L310,52 L320,52 L320,44 L328,44 L328,52 L342,52 L342,60 L356,60 L356,54 L368,54 L368,60 L384,60 L384,56 L400,56 L400,70 Z"
              fill="rgba(255,255,255,0.12)"
            />
          </Svg>
        </Svg>

        {/* Window lights */}
        {LIGHTS.map(([xOf400, yPct], i) => {
          const left = (xOf400 / 400) * SCREEN_WIDTH;
          const bottom = (yPct * 0.28 / 100) * HERO_H;
          const size = i % 4 === 0 ? 3 : 2;
          const opacity = 0.25 + (i % 4) * 0.12;
          return (
            <View
              key={i}
              style={{
                position: "absolute",
                left,
                bottom,
                width: size,
                height: size,
                borderRadius: 1,
                backgroundColor: `rgba(255,230,140,${opacity})`,
              }}
            />
          );
        })}

        {/* Atmospheric fog fade */}
        <LinearGradient
          colors={["transparent", "rgba(30,64,96,0.55)", "rgba(35,62,82,0.9)"]}
          locations={[0, 0.7, 1]}
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: HERO_H * 0.42,
          }}
          pointerEvents="none"
        />

        {/* Horizon glow */}
        <View style={{
          position: "absolute",
          bottom: HERO_H * 0.03,
          left: SCREEN_WIDTH * 0.2,
          right: SCREEN_WIDTH * 0.2,
          height: 16,
          backgroundColor: "rgba(201,168,76,0.18)",
          borderRadius: 8,
        }} />

        {/* Gold horizon rule */}
        <LinearGradient
          colors={["transparent", "rgba(201,168,76,0.45)", "rgba(232,201,106,0.85)", "rgba(201,168,76,0.45)", "transparent"]}
          locations={[0, 0.15, 0.5, 0.85, 1]}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={{
            position: "absolute",
            bottom: 5, left: 0, right: 0,
            height: 1.5,
          }}
        />

        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoRow}>
            <LinearGradient
              colors={[GOLD, GOLD_BRIGHT]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.logoIcon}
            >
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path
                  d="M2.5 17.5L10 2.5L17.5 17.5"
                  stroke="#132035"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M5.5 13H14.5"
                  stroke="#132035"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </LinearGradient>
            <Text style={s.logoTitle}>TIL Group</Text>
          </View>
          <Text style={s.logoTagline}>منصة ذكاء العقارات</Text>
        </View>
      </View>

      {/* ─────────── FORM PANEL ─────────── */}
      <ScrollView
        style={s.panel}
        contentContainerStyle={s.panelContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Pull pill */}
        <View style={s.pill} />

        {/* Heading */}
        <View style={s.headingBlock}>
          <Text style={s.heading}>{t("auth.welcome_back")}</Text>
          <Text style={s.subheading}>{t("auth.sign_in_subtitle")}</Text>
        </View>

        {/* Server error */}
        {serverError ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{serverError}</Text>
          </View>
        ) : null}

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <View style={s.fieldGroup}>
              <Text style={s.label}>{t("auth.email")}</Text>
              <View style={[
                s.underline,
                focused === "email" && s.underlineFocused,
                !!fieldState.error && s.underlineError,
              ]}>
                <TextInput
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => { field.onBlur(); setFocused(null); }}
                  placeholder="you@company.com"
                  placeholderTextColor="#c0bcb6"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  style={s.textInput}
                />
              </View>
              {fieldState.error ? (
                <Text style={s.fieldError}>{fieldState.error.message}</Text>
              ) : null}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <View style={[s.fieldGroup, s.fieldGroupLast]}>
              <Text style={s.label}>{t("auth.password")}</Text>
              <View style={[
                s.underline,
                focused === "password" && s.underlineFocused,
                !!fieldState.error && s.underlineError,
              ]}>
                <TextInput
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => { field.onBlur(); setFocused(null); }}
                  placeholder="••••••••"
                  placeholderTextColor="#c0bcb6"
                  secureTextEntry
                  textContentType="password"
                  style={s.textInput}
                />
              </View>
              {fieldState.error ? (
                <Text style={s.fieldError}>{fieldState.error.message}</Text>
              ) : null}
            </View>
          )}
        />

        {/* CTA */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={submitting}
          activeOpacity={0.85}
          style={s.ctaWrap}
        >
          <LinearGradient
            colors={[NAVY, NAVY_MID, NAVY_LIGHT]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.ctaGradient}
          >
            {submitting
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.ctaText}>{t("auth.login")}</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* Links */}
        <View style={s.linksRow}>
          <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
            <Text style={s.forgotLink}>{t("auth.forgot_password")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={s.createRow}
          >
            <Text style={s.createText}>{t("auth.create_account_link")}</Text>
            <Text style={s.createArrow}> ←</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },

  /* Logo */
  logoWrap: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  logoTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  logoTagline: {
    color: "rgba(201,168,76,0.75)",
    fontSize: 10.5,
    letterSpacing: 2,
  },

  /* Form panel */
  panel: {
    flex: 1,
    backgroundColor: CREAM,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    zIndex: 2,
  },
  panelContent: {
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 36,
  },
  pill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc9c3",
    alignSelf: "center",
    marginBottom: 20,
  },

  /* Heading */
  headingBlock: {
    marginBottom: 26,
  },
  heading: {
    color: NAVY,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
    textAlign: "right",
    writingDirection: "rtl",
  },
  subheading: {
    color: "#9e9a94",
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
  },

  /* Error */
  errorBox: {
    backgroundColor: "rgba(220,38,38,0.08)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.2)",
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    textAlign: "right",
  },

  /* Fields */
  fieldGroup: {
    marginBottom: 22,
  },
  fieldGroupLast: {
    marginBottom: 30,
  },
  label: {
    color: "#7a7672",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginBottom: 10,
    textAlign: "right",
    writingDirection: "rtl",
  },
  underline: {
    borderBottomWidth: 2,
    borderBottomColor: "#d8d4cd",
    paddingBottom: 10,
  },
  underlineFocused: {
    borderBottomColor: GOLD,
  },
  underlineError: {
    borderBottomColor: "#dc2626",
  },
  textInput: {
    color: "#2a2520",
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 28,
    textAlign: "right",
    writingDirection: "rtl",
  },
  fieldError: {
    color: "#dc2626",
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
  },

  /* CTA */
  ctaWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15.5,
    letterSpacing: 0.3,
  },

  /* Links */
  linksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotLink: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(201,168,76,0.3)",
    paddingBottom: 1,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  createText: {
    color: NAVY,
    fontSize: 13,
    fontWeight: "700",
  },
  createArrow: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "700",
  },
});
