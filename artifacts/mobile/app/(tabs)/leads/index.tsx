import React from "react";
import {
  ActivityIndicator, FlatList, RefreshControl, StyleSheet,
  Text, TouchableOpacity, View, type ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useLeads } from "@workspace/api-client/hooks/leads";
import type { Lead } from "@workspace/api-client";
import { STATUS_LABELS } from "@workspace/core";
import { useI18n } from "@workspace/i18n";
import { parseApiError } from "@workspace/shared/errors";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";

export default function LeadsListScreen(): React.ReactElement {
  const router = useRouter();
  const { locale } = useI18n();
  const { colors: c } = useColors();

  const { data: leads, isLoading, isRefetching, refetch, error } = useLeads();

  const renderItem: ListRenderItem<Lead> = React.useCallback(
    ({ item }) => (
      <LeadRow
        lead={item}
        locale={locale}
        accent={GOLD}
        muted={c.mutedForeground}
        card={c.card}
        border={c.border}
        foreground={c.foreground}
        onPress={() => router.push(`/(tabs)/leads/${item.id}`)}
      />
    ),
    [locale, router, c],
  );

  if (isLoading) {
    return (
      <View style={[s.flex, s.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={GOLD} size="large" />
      </View>
    );
  }

  if (error) {
    const parsed = parseApiError(error);
    return (
      <View style={[s.flex, { backgroundColor: c.background }]}>
        <ScreenHeader title="Leads" />
        <View style={[s.center, s.flex, { padding: 24 }]}>
          <Feather name="alert-circle" size={36} color={c.mutedForeground} style={{ marginBottom: 12 }} />
          <Text style={[s.errorTitle, { color: c.foreground }]}>{parsed.title}</Text>
          <Text style={[s.errorMsg, { color: c.mutedForeground }]}>{parsed.message}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const total = leads?.length ?? 0;

  return (
    <View style={[s.flex, { backgroundColor: c.background }]}>
      <ScreenHeader
        title="Leads"
        subtitle={`${total} total`}
        rightElement={
          <View style={s.countBadge}>
            <Text style={s.countText}>{total}</Text>
          </View>
        }
      />
      <FlatList
        data={leads ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={s.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={GOLD} colors={[GOLD]} />
        }
        ListEmptyComponent={
          <View style={[s.center, s.empty]}>
            <Feather name="inbox" size={36} color={c.mutedForeground} style={{ marginBottom: 10 }} />
            <Text style={[s.emptyText, { color: c.mutedForeground }]}>No leads yet.</Text>
          </View>
        }
      />
    </View>
  );
}

interface RowProps {
  lead: Lead;
  locale: "en" | "ar";
  accent: string;
  muted: string;
  card: string;
  border: string;
  foreground: string;
  onPress: () => void;
}

function LeadRow({ lead, locale, accent, muted, card, border, foreground, onPress }: RowProps) {
  const statusLabel = STATUS_LABELS[lead.status]?.[locale] ?? lead.status;
  const initials = lead.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[s.row, { backgroundColor: card, borderColor: border }]}>
      {/* Status bar */}
      <View style={[s.statusBar, { backgroundColor: accent }]} />

      {/* Avatar */}
      <View style={[s.avatar, { backgroundColor: `${NAVY}18` }]}>
        <Text style={[s.avatarText, { color: NAVY }]}>{initials || "?"}</Text>
      </View>

      {/* Info */}
      <View style={s.rowMain}>
        <Text style={[s.rowName, { color: foreground }]} numberOfLines={1}>{lead.name}</Text>
        <Text style={[s.rowMeta, { color: muted }]} numberOfLines={1}>
          {lead.phone ?? lead.email ?? lead.source}
        </Text>
      </View>

      {/* Status pill */}
      <View style={[s.statusPill, { backgroundColor: `${accent}15`, borderColor: accent }]}>
        <Text style={[s.statusText, { color: accent }]}>{statusLabel}</Text>
      </View>

      <Feather name="chevron-right" size={14} color={muted} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16, flexGrow: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingLeft: 0,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBar: { width: 4, alignSelf: "stretch", marginRight: 8, borderRadius: 2 },
  avatar: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "700" },
  rowMain: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 14, fontWeight: "600" },
  rowMeta: { fontSize: 12, marginTop: 2 },
  statusPill: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  statusText: { fontSize: 11, fontWeight: "600" },
  countBadge: {
    backgroundColor: "rgba(201,168,76,0.18)",
    borderRadius: 10, borderWidth: 1,
    borderColor: "rgba(201,168,76,0.35)",
    paddingHorizontal: 8, paddingVertical: 3,
  },
  countText: { color: GOLD, fontSize: 12, fontWeight: "700" },
  empty: { paddingVertical: 48 },
  emptyText: { fontSize: 14 },
  errorTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6, textAlign: "center" },
  errorMsg: { fontSize: 13, textAlign: "center", marginBottom: 20 },
  retryBtn: {
    backgroundColor: GOLD, paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
