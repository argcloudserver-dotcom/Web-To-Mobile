import React from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { useI18n } from "@workspace/i18n";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColors } from "@/hooks/useColors";

const GOLD = "#c9a84c";
const GOLD_BRIGHT = "#e8c96a";
const NAVY = "#0f1e35";
const NAVY_MID = "#1e3560";
const CREAM = "#faf9f6";

const ROLE_COLORS: Record<string, string> = {
  ceo: "#7C3AED", admin: "#DC2626", director: "#0891B2", team_leader: "#2563EB", sales: "#16A34A",
};

export default function ProfileScreen(): React.ReactElement | null {
  const router = useRouter();
  const { t } = useI18n();
  const { isDark, toggleTheme } = useAppTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut } = useAuthContext();
  const { colors: c } = useColors();

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role] ?? NAVY;
  const initials = user.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  function handleSignOut() {
    Alert.alert(t("common.confirm"), t("common.confirm_delete"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.yes_delete"), style: "destructive",
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await signOut();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <ScreenHeader title={t("profile.title")} subtitle={user.name} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Profile hero card */}
        <View style={[s.heroCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {/* Avatar with role color */}
          <View style={[s.avatarWrap, { backgroundColor: `${roleColor}18`, borderColor: `${roleColor}30` }]}>
            <Text style={[s.avatarText, { color: roleColor }]}>{initials}</Text>
          </View>
          <Text style={[s.name, { color: fg }]}>{user.name}</Text>
          {!!user.title && <Text style={[s.jobTitle, { color: muted }]}>{user.title}</Text>}
          <Text style={[s.email, { color: muted }]}>{user.email}</Text>
          <View style={[s.rolePill, { backgroundColor: `${roleColor}15`, borderColor: `${roleColor}30` }]}>
            <View style={[s.roleDot, { backgroundColor: roleColor }]} />
            <Text style={[s.roleTxt, { color: roleColor }]}>{user.role.replace("_", " ").toUpperCase()}</Text>
          </View>
        </View>

        {/* Settings section */}
        <Text style={[s.sectionLabel, { color: muted }]}>{t("common.actions").toUpperCase()}</Text>
        <View style={[s.menuCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          {/* Theme toggle */}
          <TouchableOpacity style={s.row} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor: "rgba(201,168,76,0.12)" }]}>
              <Feather name={isDark ? "sun" : "moon"} size={16} color={GOLD} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowLabel, { color: fg }]}>{isDark ? "Light Mode" : "Dark Mode"}</Text>
            </View>
            <View style={[s.togglePill, { backgroundColor: isDark ? GOLD : cardBorder }]}>
              <View style={[s.toggleThumb, { transform: [{ translateX: isDark ? 16 : 2 }] }]} />
            </View>
          </TouchableOpacity>

          <View style={[s.divider, { backgroundColor: cardBorder }]} />

          {/* Language toggle */}
          <TouchableOpacity
            style={s.row}
            onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); await toggleLanguage(); }}
            activeOpacity={0.7}
          >
            <View style={[s.rowIcon, { backgroundColor: "rgba(201,168,76,0.12)" }]}>
              <Feather name="globe" size={16} color={GOLD} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.rowLabel, { color: fg }]}>{language === "en" ? "العربية" : "English"}</Text>
              <Text style={[s.rowMeta, { color: muted }]}>{language === "en" ? "التبديل إلى العربية" : "Switch to English"}</Text>
            </View>
            <View style={[s.langBadge, { backgroundColor: "rgba(201,168,76,0.12)", borderColor: "rgba(201,168,76,0.3)" }]}>
              <Text style={[s.langBadgeTxt, { color: GOLD }]}>{language === "en" ? "AR" : "EN"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <View style={[s.menuCard, { backgroundColor: cardBg, borderColor: cardBorder, marginBottom: 80 }]}>
          <TouchableOpacity style={s.row} onPress={handleSignOut} activeOpacity={0.7}>
            <View style={[s.rowIcon, { backgroundColor: "rgba(220,38,38,0.10)" }]}>
              <Feather name="log-out" size={16} color="#dc2626" />
            </View>
            <Text style={[s.rowLabel, { color: "#dc2626" }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.version, { color: muted }]}>TIL Real Estate Group CRM · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  heroCard: {
    alignItems: "center", borderRadius: 18, padding: 28,
    marginBottom: 24, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center",
    marginBottom: 14, borderWidth: 2,
  },
  avatarText: { fontSize: 28, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  jobTitle: { fontSize: 13, marginTop: 2 },
  email: { fontSize: 12, marginTop: 2 },
  rolePill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 12, borderWidth: 1,
  },
  roleDot: { width: 7, height: 7, borderRadius: 7 },
  roleTxt: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  sectionLabel: { fontSize: 11, fontWeight: "600", marginBottom: 8, letterSpacing: 0.8 },
  menuCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowLabel: { fontSize: 15, fontWeight: "500" },
  rowMeta: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginLeft: 64 },
  togglePill: { width: 36, height: 22, borderRadius: 11, justifyContent: "center" },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#FFF" },
  langBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  langBadgeTxt: { fontSize: 12, fontWeight: "700" },
  version: { textAlign: "center", fontSize: 12, marginTop: 8, marginBottom: 16 },
});
