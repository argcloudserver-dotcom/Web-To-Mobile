/**
 * Leads Kanban — Mobile.
 * Mirrors web /leads/kanban. On mobile, columns stack vertically and each
 * lead appears as a card grouped by status.
 */
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useLeads } from "@workspace/api-client/hooks/leads";
import type { Lead } from "@workspace/api-client";
import { LEAD_STATUS_ORDER, STATUS_LABELS } from "@workspace/core";
import { useI18n } from "@workspace/i18n";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { Badge } from "@workspace/ui";
import type { CrmStatusKey } from "@workspace/ui/tokens";

const COLUMNS: Array<{ key: string; label: string }> = LEAD_STATUS_ORDER.map((key) => ({
  key,
  label: (STATUS_LABELS as any)[key]?.en ?? key,
}));

export default function LeadsKanbanScreen(): React.ReactElement {
  const router = useRouter();
  const { colors: c } = useColors();
  const { locale } = useI18n();
  const { data: leads, isLoading, error } = useLeads();

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.danger }}>Failed to load leads</Text>
      </View>
    );
  }

  const grouped: Record<string, Lead[]> = {};
  for (const l of leads ?? []) {
    const s = (l as any).status ?? "new";
    (grouped[s] ??= []).push(l);
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title="Leads · Kanban"
        onBack={() => router.replace("/(tabs)/leads")}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {COLUMNS.map((col) => {
          const items = grouped[col.key] ?? [];
          return (
            <View
              key={col.key}
              style={[styles.column, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={styles.colHeader}>
                <Text style={[styles.colTitle, { color: c.foreground }]}>{col.label}</Text>
                <View style={[styles.badge, { backgroundColor: c.accent }]}>
                  <Text style={[styles.badgeText, { color: c.accentForeground }]}>{items.length}</Text>
                </View>
              </View>
              {items.length === 0 ? (
                <Text style={[styles.empty, { color: c.mutedForeground }]}>No leads</Text>
              ) : (
                items.map((lead) => (
                  <TouchableOpacity
                    key={(lead as any).id}
                    style={[styles.card, { borderColor: c.border }]}
                    onPress={() => router.push(`/(tabs)/leads/${(lead as any).id}`)}
                  >
                    <Text style={[styles.cardName, { color: c.foreground }]} numberOfLines={1}>
                      {(lead as any).name ?? "Unnamed lead"}
                    </Text>
                    <Text style={[styles.cardMeta, { color: c.mutedForeground }]} numberOfLines={1}>
                      {(lead as any).phone ?? (lead as any).email ?? ""}
                    </Text>
                    <Badge status={col.key as CrmStatusKey} style={{ marginTop: 2 }}>
                      {(STATUS_LABELS as any)?.[locale]?.[col.key] ?? col.label}
                    </Badge>
                  </TouchableOpacity>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  column: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  colHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  colTitle: { fontSize: 15, fontWeight: "700" },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  empty: { fontSize: 12, fontStyle: "italic", paddingVertical: 6 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  cardName: { fontSize: 14, fontWeight: "600" },
  cardMeta: { fontSize: 12 },
});
