/**
 * Director Team — Mobile.
 * Mirrors web /employees/director/:id. Lists the team members reporting to a
 * director, grouped by team leader.
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

export default function DirectorTeamScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors: c } = useColors();
  const directorId = id ?? "";

  const { data: director } = useGetUser(directorId);
  const { data: users = [], isLoading } = useListUsers();

  const teamLeaders = React.useMemo(
    () => users.filter((u: any) => u.reportsToId === directorId && u.role === "team_leader"),
    [users, directorId],
  );

  const agentsByLeader = React.useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const u of users as any[]) {
      if (u.role === "sales_agent" || u.role === "sales") {
        (map[u.reportsToId] ??= []).push(u);
      }
    }
    return map;
  }, [users]);

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
        title={director?.name ? `${director.name}'s Team` : "Director Team"}
        subtitle={`${teamLeaders.length} team leaders`}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        {teamLeaders.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="users" size={40} color={c.mutedForeground} />
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>No team leaders yet</Text>
          </View>
        ) : (
          teamLeaders.map((leader: any) => {
            const members = agentsByLeader[leader.id] ?? [];
            return (
              <View
                key={leader.id}
                style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/(tabs)/employees/team/[id]", params: { id: leader.id } })
                  }
                  style={styles.cardHeader}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.leaderName, { color: c.foreground }]} numberOfLines={1}>
                      {leader.name}
                    </Text>
                    <Text style={[styles.leaderMeta, { color: c.mutedForeground }]}>
                      {members.length} agents · Team Leader
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={c.mutedForeground} />
                </TouchableOpacity>
                {members.slice(0, 3).map((m: any) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.memberRow, { borderColor: c.border }]}
                    onPress={() =>
                      router.push({ pathname: "/(tabs)/employees/[id]", params: { id: m.id } })
                    }
                  >
                    <View style={[styles.avatar, { backgroundColor: c.accent }]}>
                      <Text style={[styles.avatarText, { color: c.accentForeground }]}>{m.name?.[0] ?? "?"}</Text>
                    </View>
                    <Text style={[styles.memberName, { color: c.foreground }]} numberOfLines={1}>
                      {m.name}
                    </Text>
                    <Feather name="chevron-right" size={14} color={c.mutedForeground} />
                  </TouchableOpacity>
                ))}
                {members.length > 3 ? (
                  <Text style={[styles.moreText, { color: c.accent }]}>
                    +{members.length - 3} more
                  </Text>
                ) : null}
              </View>
            );
          })
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
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  leaderName: { fontSize: 15, fontWeight: "700" },
  leaderMeta: { fontSize: 12, marginTop: 2 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "700", fontSize: 12 },
  memberName: { flex: 1, fontSize: 13, fontWeight: "600" },
  moreText: { fontSize: 12, fontWeight: "600", paddingLeft: 4 },
});
