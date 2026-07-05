import React from "react";
import {
  ActivityIndicator, FlatList, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  type ListRenderItem,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useListUsers, useListPendingUsers } from "@workspace/api-client/hooks/employees";
import type { User } from "@workspace/api-client";
import { useI18n } from "@workspace/i18n";
import { parseApiError } from "@workspace/shared/errors";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const CREAM = "#faf9f6";

const ROLES = ["all", "ceo", "admin", "director", "team_leader", "sales"] as const;
const ROLE_META: Record<string, { color: string; label: string }> = {
  ceo: { color: "#7C3AED", label: "CEO" },
  admin: { color: "#DC2626", label: "Admin" },
  director: { color: "#0891B2", label: "Director" },
  team_leader: { color: "#2563EB", label: "Team Leader" },
  sales: { color: "#16A34A", label: "Sales" },
};

export default function EmployeesListScreen(): React.ReactElement {
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
  const [roleFilter, setRoleFilter] = React.useState<(typeof ROLES)[number]>("all");

  const { data: users = [], isLoading, isRefetching, refetch, error } = useListUsers({ status: "active" });
  const { data: pending = [] } = useListPendingUsers();

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || (u.title ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const renderItem: ListRenderItem<User> = React.useCallback(
    ({ item }) => (
      <EmployeeRow user={item} muted={muted} cardBg={cardBg} cardBorder={cardBorder} fg={fg}
        onPress={() => router.push({ pathname: "/(tabs)/employees/[id]", params: { id: item.id } })} />
    ),
    [router, muted, cardBg, cardBorder, fg],
  );

  if (isLoading && users.length === 0) {
    return (
      <View style={[s.flex, { backgroundColor: bg }]}>
        <ScreenHeader title={t("employees.title")} />
        <View style={s.center}><ActivityIndicator color={GOLD} /></View>
      </View>
    );
  }

  if (error) {
    const parsed = parseApiError(error);
    return (
      <View style={[s.flex, { backgroundColor: bg }]}>
        <ScreenHeader title={t("employees.title")} />
        <View style={[s.center, { padding: 24 }]}>
          <Feather name="alert-circle" size={36} color={muted} style={{ marginBottom: 12 }} />
          <Text style={[s.errorTitle, { color: fg }]}>{parsed.title}</Text>
          <Text style={[s.errorMsg, { color: muted }]}>{parsed.message}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.flex, { backgroundColor: bg }]}>
      <ScreenHeader
        title={t("employees.title")}
        subtitle={`${filtered.length} ${t("employees.title").toLowerCase()}`}
        rightElement={
          <TouchableOpacity
            style={s.pendingBtn}
            onPress={() => router.push("/(tabs)/employees/pending")}
          >
            <Feather name="user-plus" size={13} color={GOLD} />
            {pending.length > 0 && (
              <View style={s.pendingBadge}>
                <Text style={s.pendingBadgeText}>{pending.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <View style={s.searchWrap}>
        <View style={[s.searchBox, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Feather name="search" size={16} color={muted} style={{ marginRight: 8 }} />
          <TextInput
            style={[s.searchInput, { color: fg }]}
            placeholder={t("employees.search")}
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

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={s.filterRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      >
        {ROLES.map((r) => {
          const active = r === roleFilter;
          const meta = ROLE_META[r];
          const color = meta?.color ?? GOLD;
          return (
            <TouchableOpacity
              key={r}
              style={[s.chip, { backgroundColor: cardBg, borderColor: active ? color : cardBorder },
                active && { backgroundColor: `${color}18` }]}
              onPress={() => setRoleFilter(r)}
            >
              <Text style={[s.chipTxt, { color: active ? color : muted }, active && { fontWeight: "700" }]}>
                {r === "all" ? "All" : meta?.label ?? r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GOLD} colors={[GOLD]} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="users" size={36} color={muted} />
            <Text style={[s.emptyText, { color: muted }]}>{t("employees.no_employees")}</Text>
          </View>
        }
      />
    </View>
  );
}

interface EmployeeRowProps {
  user: User; muted: string; cardBg: string; cardBorder: string; fg: string; onPress: () => void;
}
const EmployeeRow = React.memo(function EmployeeRow({ user, muted, cardBg, cardBorder, fg, onPress }: EmployeeRowProps) {
  const meta = ROLE_META[user.role] ?? { color: GOLD, label: user.role };
  const initials = user.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <TouchableOpacity style={[s.card, { backgroundColor: cardBg, borderColor: cardBorder }]} activeOpacity={0.75} onPress={onPress}>
      <View style={[s.avatar, { backgroundColor: `${meta.color}1a` }]}>
        <Text style={[s.avatarTxt, { color: meta.color }]}>{initials}</Text>
      </View>
      <View style={s.cardBody}>
        <Text style={[s.cardTitle, { color: fg }]} numberOfLines={1}>{user.name}</Text>
        {!!user.title && <Text style={[s.cardMeta, { color: muted }]} numberOfLines={1}>{user.title}</Text>}
        {!!user.phone && (
          <View style={s.metaRow}>
            <Feather name="phone" size={11} color={muted} />
            <Text style={[s.cardMeta, { color: muted }]}>{user.phone}</Text>
          </View>
        )}
      </View>
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <View style={[s.roleBadge, { backgroundColor: `${meta.color}15`, borderColor: `${meta.color}30`, borderWidth: 1 }]}>
          <Text style={[s.roleTxt, { color: meta.color }]}>{meta.label}</Text>
        </View>
        {user.isOnline && <View style={s.onlineDot} />}
      </View>
    </TouchableOpacity>
  );
});

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { maxHeight: 52, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipTxt: { fontSize: 13, fontWeight: "500" },
  list: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  card: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1 },
  avatar: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  avatarTxt: { fontSize: 16, fontWeight: "700" },
  cardBody: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  cardMeta: { fontSize: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  roleTxt: { fontSize: 11, fontWeight: "700" },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" },
  pendingBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "rgba(201,168,76,0.12)",
    borderWidth: 1, borderColor: "rgba(201,168,76,0.35)",
    alignItems: "center", justifyContent: "center",
  },
  pendingBadge: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: "#dc2626", borderRadius: 8,
    minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  pendingBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  errorTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6, textAlign: "center" },
  errorMsg: { fontSize: 13, textAlign: "center", marginBottom: 20 },
  retryBtn: { backgroundColor: GOLD, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
