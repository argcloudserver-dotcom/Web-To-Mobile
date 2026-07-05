import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  useListNotifications, useMarkNotificationRead,
  useMarkAllNotificationsRead, getListNotificationsQueryKey,
} from "@workspace/api-client";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const CREAM = "#faf9f6";

function timeAgo(dateStr: string, t: (key: string, vars?: Record<string, string | number>) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return t("notifications_screen.just_now");
  if (mins < 60) return t("notifications_screen.minutes_ago", { n: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return t("notifications_screen.hours_ago", { n: hrs });
  return t("notifications_screen.days_ago", { n: Math.floor(hrs / 24) });
}

export default function NotificationsScreen() {
  const { colors: c } = useColors();
  const { isDark } = useAppTheme();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  const { data: notifications = [], isLoading, refetch } = useListNotifications();
  const markRead    = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleMarkRead(id: string) {
    markRead.mutate({ notificationId: id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleMarkAllRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <ScreenHeader
        title={t("notifications_screen.title")}
        subtitle={
          unreadCount > 0
            ? t("notifications_screen.unread_count", { count: unreadCount })
            : t("notifications_screen.all_caught_up")
        }
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={handleMarkAllRead}
              style={s.markAllBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="check-circle" size={13} color={GOLD} />
              <Text style={s.markAllText}>{t("notifications_screen.mark_all")}</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={GOLD} colors={[GOLD]} />}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!notifications.length}
        ListEmptyComponent={() => (
          <View style={s.empty}>
            <View style={[s.emptyIcon, { backgroundColor: `${GOLD}14` }]}>
              <Feather name="bell-off" size={28} color={GOLD} />
            </View>
            <Text style={[s.emptyTitle, { color: fg }]}>
              {isLoading ? t("notifications_screen.loading") : t("notifications_screen.all_caught_up_title")}
            </Text>
            <Text style={[s.emptyText, { color: muted }]}>
              {t("notifications_screen.no_notifications")}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              s.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
              !item.isRead && { backgroundColor: `${GOLD}08`, borderColor: `${GOLD}28` },
            ]}
            onPress={() => !item.isRead && handleMarkRead(item.id)}
            activeOpacity={0.75}
          >
            <View style={[s.dot, { backgroundColor: item.isRead ? cardBorder : GOLD }]} />
            <View style={s.cardContent}>
              <Text style={[s.cardTitle, { color: fg }]} numberOfLines={1}>{item.titleEn}</Text>
              {item.bodyEn ? (
                <Text style={[s.cardBody, { color: muted }]} numberOfLines={2}>{item.bodyEn}</Text>
              ) : null}
              <Text style={[s.cardTime, { color: muted }]}>{timeAgo(item.createdAt, t)}</Text>
            </View>
            {!item.isRead && (
              <TouchableOpacity
                onPress={() => handleMarkRead(item.id)}
                style={s.checkBtn}
              >
                <Feather name="check" size={13} color={GOLD} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  markAllBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: "rgba(201,168,76,0.12)",
    borderWidth: 1, borderColor: "rgba(201,168,76,0.3)",
  },
  markAllText: { fontSize: 12, fontWeight: "600", color: GOLD },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyText: { fontSize: 14 },
  card: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    borderRadius: 13, padding: 14, marginBottom: 8, borderWidth: 1,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "600" },
  cardBody: { fontSize: 13, marginTop: 3 },
  cardTime: { fontSize: 11, marginTop: 5 },
  checkBtn: {
    padding: 7, borderRadius: 9,
    backgroundColor: "rgba(201,168,76,0.12)",
    borderWidth: 1, borderColor: "rgba(201,168,76,0.25)",
  },
});
