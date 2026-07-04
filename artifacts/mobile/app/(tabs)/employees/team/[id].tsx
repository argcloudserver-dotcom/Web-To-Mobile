/**
 * Team Leader Team — Mobile.
 * Mirrors web /employees/team/:id. Lists sales agents reporting to a leader.
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
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useListUsers, useGetUser } from "@workspace/api-client/hooks/employees";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";

export default function TeamLeaderTeamScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors: c } = useColors();
  const leaderId = id ?? "";

  const { data: leader } = useGetUser(leaderId);
  const { data: users = [], isLoading } = useListUsers();

  const members = React.useMemo(
    () => (users as any[]).filter((u) => u.reportsToId === leaderId),
    [users, leaderId],
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title={leader?.name ? `${leader.name}'s Team` : "Team"}
        subtitle={`${members.length} members`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {members.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="user" size={36} color={c.mutedForeground} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No team members</Text>
          </View>
        ) : (
          members.map((m: any) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() =>
                router.push({ pathname: "/(tabs)/employees/[id]", params: { id: m.id } })
              }
            >
              <View style={[styles.avatar, { backgroundColor: c.accent }]}>
                <Text style={[styles.avatarText, { color: c.accentForeground }]}>{m.name?.[0] ?? "?"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: c.foreground }]} numberOfLines={1}>
                  {m.name}
                </Text>
                <Text style={[styles.meta, { color: c.mutedForeground }]} numberOfLines={1}>
                  {m.role?.replace("_", " ") ?? ""} · {m.email ?? ""}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={c.mutedForeground} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", padding: 40, gap: 10 },
  emptyText: { fontSize: 14 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "700" },
  name: { fontSize: 14, fontWeight: "700" },
  meta: { fontSize: 12, marginTop: 2 },
});
