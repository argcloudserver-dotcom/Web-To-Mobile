import React from "react";
import {
  ActivityIndicator, FlatList, RefreshControl, StyleSheet,
  Text, TextInput, TouchableOpacity, View, type ListRenderItem,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useListClients } from "@workspace/api-client/hooks/clients";
import type { Client } from "@workspace/api-client";
import { useI18n } from "@workspace/i18n";
import { parseApiError } from "@workspace/shared/errors";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const CREAM = "#faf9f6";

export default function ClientsListScreen(): React.ReactElement {
  const router = useRouter();
  const { t } = useI18n();
  const { isDark } = useAppTheme();
  const { colors: c } = useColors();

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  const [search, setSearch] = React.useState("");
  const { data: clients = [], isLoading, isRefetching, refetch, error } = useListClients();

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (cl) => cl.name.toLowerCase().includes(q) || (cl.email ?? "").toLowerCase().includes(q) || (cl.phone ?? "").toLowerCase().includes(q),
    );
  }, [clients, search]);

  const renderItem: ListRenderItem<Client> = React.useCallback(
    ({ item }) => (
      <ClientRow client={item} muted={muted} cardBg={cardBg} cardBorder={cardBorder} fg={fg}
        onPress={() => router.push({ pathname: "/(tabs)/clients/[id]", params: { id: item.id } })} />
    ),
    [router, muted, cardBg, cardBorder, fg],
  );

  if (isLoading && clients.length === 0) {
    return (
      <View style={[s.flex, { backgroundColor: bg }]}>
        <ScreenHeader title={t("clients.title")} />
        <View style={s.center}><ActivityIndicator color={GOLD} /></View>
      </View>
    );
  }

  if (error) {
    const parsed = parseApiError(error);
    return (
      <View style={[s.flex, { backgroundColor: bg }]}>
        <ScreenHeader title={t("clients.title")} />
        <View style={[s.center, { padding: 24 }]}>
          <Feather name="alert-circle" size={36} color={muted} style={{ marginBottom: 12 }} />
          <Text style={[s.errorTitle, { color: fg }]}>{parsed.title}</Text>
          <Text style={[s.errorMsg, { color: muted }]}>{parsed.message}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
            <Text style={s.retryText}>{t("clients.back") || "Try again"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.flex, { backgroundColor: bg }]}>
      <ScreenHeader title={t("clients.title")} subtitle={`${filtered.length} ${t("clients.title").toLowerCase()}`} />

      <View style={s.searchWrap}>
        <View style={[s.searchBox, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Feather name="search" size={16} color={muted} style={{ marginRight: 8 }} />
          <TextInput
            style={[s.searchInput, { color: fg }]}
            placeholder={t("clients.search")}
            placeholderTextColor={muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={15} color={muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GOLD} colors={[GOLD]} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="users" size={36} color={muted} />
            <Text style={[s.emptyText, { color: muted }]}>{t("clients.no_clients")}</Text>
          </View>
        }
      />
    </View>
  );
}

interface ClientRowProps {
  client: Client; muted: string; cardBg: string; cardBorder: string; fg: string; onPress: () => void;
}
const ClientRow = React.memo(function ClientRow({ client, muted, cardBg, cardBorder, fg, onPress }: ClientRowProps) {
  const initials = client.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <TouchableOpacity style={[s.card, { backgroundColor: cardBg, borderColor: cardBorder }]} activeOpacity={0.75} onPress={onPress}>
      <View style={[s.avatar, { backgroundColor: `${GOLD}18` }]}>
        <Text style={[s.avatarTxt, { color: GOLD }]}>{initials}</Text>
      </View>
      <View style={s.cardBody}>
        <Text style={[s.cardTitle, { color: fg }]} numberOfLines={1}>{client.name}</Text>
        {!!client.company && <Text style={[s.cardMeta, { color: muted }]} numberOfLines={1}>{client.company}</Text>}
        {!!client.email && (
          <View style={s.metaRow}>
            <Feather name="mail" size={11} color={muted} />
            <Text style={[s.cardMeta, { color: muted }]} numberOfLines={1}>{client.email}</Text>
          </View>
        )}
        {!!client.phone && (
          <View style={s.metaRow}>
            <Feather name="phone" size={11} color={muted} />
            <Text style={[s.cardMeta, { color: muted }]}>{client.phone}</Text>
          </View>
        )}
      </View>
      <Feather name="chevron-right" size={18} color={muted} />
    </TouchableOpacity>
  );
});

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1 },
  avatar: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontSize: 16, fontWeight: "700" },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardMeta: { fontSize: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  errorTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6, textAlign: "center" },
  errorMsg: { fontSize: 13, textAlign: "center", marginBottom: 20 },
  retryBtn: { backgroundColor: GOLD, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
