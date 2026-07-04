/**
 * Login screen — Mobile.
 *
 * Validates the form with the shared `LoginSchema` (from
 * `@workspace/api-client/zod/auth`), submits via the shared `useLogin`
 * mutation (from `@workspace/api-client/hooks/auth`), and persists the
 * session token through the shared `useAuth` context
 * (`@workspace/shared/auth`).
 *
 * UI now uses the shared `@workspace/ui` component library, so it follows
 * the exact same design tokens (and dark/light preference) as the web app.
 */
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema, type LoginFormValues } from "@workspace/api-client/zod/auth";
import { useLogin } from "@workspace/api-client/hooks/auth";
import { useAuth } from "@workspace/shared/auth";
import { Button, Card, Input } from "@workspace/ui";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

type LoginSuccessPayload = {
  user?: { id?: string };
  token?: string;
  accessToken?: string;
};

export default function LoginScreen(): React.ReactElement {
  const router = useRouter();
  const theme = useColors();
  const { colors, spacing, typography, radius } = theme;
  const { t } = useLanguage();

  const { setToken, refetch } = useAuth();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const { control, handleSubmit, formState: { isSubmitting } } = form;

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (data) => {
        const payload = data as unknown as LoginSuccessPayload;
        // Only accept a real bearer token from the server. Falling back to
        // `user.id` would authenticate the client with a value the backend
        // does not recognise, producing a phantom "logged-in" state that
        // 401s on the first /me refresh.
        const token = payload.token ?? payload.accessToken ?? null;
        if (!token) {
          setServerError(t("auth.session_error"));
          return;
        }
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
    // Send `client: "mobile"` explicitly in the body as a second, independent
    // signal alongside the X-Client-Platform header set in custom-fetch.ts.
    loginMutation.mutate({
      data: { ...values, client: "mobile" } as typeof values & { client: "mobile" },
    });
  });

  const submitting = isSubmitting || loginMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: spacing[6], justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: "center", marginBottom: spacing[8] }}>
          <Text
            style={{
              color: colors.foreground,
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize["3xl"],
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            TIL Group
          </Text>
          <View
            style={{ width: 48, height: 2, backgroundColor: colors.accent, marginVertical: spacing[3], borderRadius: radius.full }}
          />
          <Text style={{ color: colors.mutedForeground, fontSize: typography.fontSize.sm }}>
            {t("auth.tagline")}
          </Text>
        </View>

        <Card style={{ padding: spacing[6] }}>
          <Text
            style={{
              color: colors.foreground,
              fontFamily: typography.fontFamily.semibold,
              fontSize: typography.fontSize["2xl"],
              marginBottom: spacing[1],
            }}
          >
            {t("auth.welcome_back")}
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: typography.fontSize.sm, marginBottom: spacing[5] }}>
            {t("auth.sign_in_subtitle")}
          </Text>

          <View style={{ gap: spacing[3] }}>
            <View>
              <Text style={{ color: colors.foreground, fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
                {t("auth.email")}
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <View>
                    <Input
                      value={field.value ?? ""}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="you@company.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      invalid={!!fieldState.error}
                    />
                    {fieldState.error ? (
                      <Text style={{ color: colors.destructive, fontSize: typography.fontSize.xs, marginTop: spacing[1] }}>
                        {fieldState.error.message}
                      </Text>
                    ) : null}
                  </View>
                )}
              />
            </View>

            <View>
              <Text style={{ color: colors.foreground, fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
                {t("auth.password")}
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <View>
                    <Input
                      value={field.value ?? ""}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="••••••••"
                      secureTextEntry
                      textContentType="password"
                      invalid={!!fieldState.error}
                    />
                    {fieldState.error ? (
                      <Text style={{ color: colors.destructive, fontSize: typography.fontSize.xs, marginTop: spacing[1] }}>
                        {fieldState.error.message}
                      </Text>
                    ) : null}
                  </View>
                )}
              />
            </View>
          </View>

          {serverError ? (
            <View
              style={{
                backgroundColor: colors.destructive,
                borderRadius: radius.md,
                padding: spacing[3],
                marginBottom: spacing[4],
              }}
            >
              <Text style={{ color: colors.destructiveForeground, fontSize: typography.fontSize.sm }}>
                {serverError}
              </Text>
            </View>
          ) : null}

          <Button loading={submitting} onPress={onSubmit} size="lg">
            {t("auth.login")}
          </Button>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: spacing[5] }}>
            <Button variant="link" size="sm" onPress={() => router.push("/(auth)/forgot-password")}>
              {t("auth.forgot_password")}
            </Button>
            <Button variant="link" size="sm" onPress={() => router.push("/(auth)/register")}>
              {t("auth.create_account_link")}
            </Button>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
