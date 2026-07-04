import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@workspace/ui";
import { useI18n } from "@workspace/i18n";

export default function DealsScreen() {
  const { colors: c, spacing } = useColors();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScreenHeader title={t("deals_screen.title")} />
      <View style={[styles.body, { paddingHorizontal: spacing[6] }]}>
        <Card style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: `${c.accent}18` }]}>
            <Feather name="briefcase" size={28} color={c.accent} />
          </View>
          <Text style={[styles.title, { color: c.foreground }]}>{t("deals_screen.coming_soon")}</Text>
          <Text style={[styles.subtitle, { color: c.mutedForeground }]}>
            {t("deals_screen.description")}
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    width: "100%",
    alignItems: "center",
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
