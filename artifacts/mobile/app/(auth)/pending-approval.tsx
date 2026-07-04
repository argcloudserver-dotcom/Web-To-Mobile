/**
 * Pending Approval — Mobile.
 * Mirrors web /pending-approval. Shown to users whose account status is
 * "pending" or "rejected". Provides logout + refresh actions.
 */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function PendingApprovalScreen(): React.ReactElement {
  const router = useRouter();
  const { currentUser, logout, refresh } = useAuth() as any;
  const { colors: c } = useColors();
  const { t } = useLanguage();
  const isRejected = currentUser?.status === "rejected";

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader title={isRejected ? t("pending_approval_screen.account_rejected") : t("pending_approval_screen.pending_approval")} />
      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: c.card }]}>
          <Feather
            name={isRejected ? "x-circle" : "clock"}
            size={40}
            color={isRejected ? c.danger : c.accent}
          />
        </View>
        <Text style={[styles.title, { color: c.foreground }]}>
          {isRejected ? t("pending_approval_screen.access_denied") : t("pending_approval_screen.awaiting_approval")}
        </Text>
        <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
          {isRejected
            ? t("pending_approval_screen.rejected_body")
            : t("pending_approval_screen.pending_body")}
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: c.accent }]}
          onPress={async () => {
            await refresh?.();
          }}
        >
          <Text style={[styles.primaryBtnText, { color: c.accentForeground }]}>{t("pending_approval_screen.refresh_status")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ghostBtn, { borderColor: c.border }]}
          onPress={async () => {
            await logout?.();
            router.replace("/(auth)/login");
          }}
        >
          <Text style={[styles.ghostBtnText, { color: c.foreground }]}>{t("pending_approval_screen.sign_out")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 16 },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20, maxWidth: 320 },
  primaryBtn: {
    marginTop: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryBtnText: { fontWeight: "700" },
  ghostBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  ghostBtnText: { fontWeight: "600" },
});
