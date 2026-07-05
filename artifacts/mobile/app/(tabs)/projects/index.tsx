import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useListProjects } from "@workspace/api-client";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useI18n } from "@workspace/i18n";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const CREAM = "#faf9f6";

export default function ProjectsScreen() {
  const theme = useColors();
  const c = theme.colors;
  const { isDark } = useAppTheme();
  const router = useRouter();
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  const { data: projects = [], isLoading, refetch } = useListProjects();

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    ((p as any).location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading && projects.length === 0) {
    return (
      <View style={[s.flex, { backgroundColor: bg }]}>
        <ScreenHeader title={t("projects.title")} />
        <View style={s.center}><ActivityIndicator color={GOLD} /></View>
      </View>
    );
  }

  return (
    <View style={[s.flex, { backgroundColor: bg }]}>
      <ScreenHeader title={t("projects.title")} subtitle={`${filtered.length} ${t("projects.title").toLowerCase()}`} />

      <View style={s.searchWrap}>
        <View style={[s.searchBox, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Feather name="search" size={16} color={muted} style={{ marginRight: 8 }} />
          <TextInput
            style={[s.searchInput, { color: fg }]}
            placeholder={t("projects.search")}
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
        contentContainerStyle={s.list}
        refreshing={isLoading}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={s.empty}>
            <Feather name="layers" size={36} color={muted} />
            <Text style={[s.emptyText, { color: muted }]}>
              {isLoading ? "Loading…" : t("projects.no_projects")}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
            onPress={() => router.push({ pathname: "/(tabs)/projects/[id]", params: { id: item.id } })}
            activeOpacity={0.75}
          >
            <View style={[s.imgBox, { backgroundColor: `${GOLD}12` }]}>
              {(item as any).imageUrl ? (
                <Image source={{ uri: (item as any).imageUrl }} style={s.img} resizeMode="cover" />
              ) : (
                <Feather name="layers" size={24} color={GOLD} />
              )}
            </View>
            <View style={s.info}>
              <Text style={[s.name, { color: fg }]} numberOfLines={1}>{item.name}</Text>
              {(item as any).location && (
                <View style={s.metaRow}>
                  <Feather name="map-pin" size={11} color={muted} />
                  <Text style={[s.meta, { color: muted }]} numberOfLines={1}> {(item as any).location}</Text>
                </View>
              )}
              {(item as any).unitCount !== undefined && (
                <Text style={[s.meta, { color: muted }]}>
                  {(item as any).unitCount} {t("projects.units")}
                </Text>
              )}
            </View>
            <View style={[s.badge, {
              backgroundColor: item.isActive ? "rgba(34,197,94,0.12)" : `${muted}18`,
              borderColor: item.isActive ? "rgba(34,197,94,0.3)" : `${muted}30`,
            }]}>
              <Text style={[s.badgeTxt, { color: item.isActive ? "#22c55e" : muted }]}>
                {item.isActive ? t("status.active") : t("status.inactive")}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={muted} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  searchBox: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 4 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  imgBox: { width: 52, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  img: { width: 52, height: 52 },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontWeight: "600" },
  meta: { fontSize: 12 },
  metaRow: { flexDirection: "row", alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  badgeTxt: { fontSize: 11, fontWeight: "600" },
});
