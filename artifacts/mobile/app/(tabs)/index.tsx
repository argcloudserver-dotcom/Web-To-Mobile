import React from "react";
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useListLeads, useListPlannerTasks } from "@workspace/api-client";
import { ScreenHeader } from "@/components/ScreenHeader";
import { shadow } from "@/lib/shadow";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const CREAM = "#faf9f6";

function getGreeting(t: (key: string) => string): string {
  const h = new Date().getHours();
  if (h < 12) return t("home.greeting_morning");
  if (h < 17) return t("home.greeting_afternoon");
  return t("home.greeting_evening");
}

const KPI_COLORS = ["#c9a84c", "#22c55e", "#3b82f6", "#0f1e35"];

export default function HomeScreen() {
  const theme = useColors();
  const c = theme.colors;
  const cr = theme.crmStatus;
  const { isDark, toggleTheme } = useAppTheme();
  const router = useRouter();
  const { user } = useAuthContext();
  const { t, language } = useLanguage();

  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = useListLeads();
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useListPlannerTasks();
  const [refreshing, setRefreshing] = React.useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([refetchLeads(), refetchTasks()]);
    setRefreshing(false);
  }

  const myLeads     = leads.filter((l) => l.primarySalesId === user?.id || ["ceo","admin","director"].includes(user?.role ?? ""));
  const activeLeads = myLeads.filter((l) => !["bought","not_qualified","low_budget"].includes(l.status));
  const wonLeads    = myLeads.filter((l) => l.status === "bought");
  const todayTasks  = tasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate).toDateString() === new Date().toDateString();
  });

  const kpis = [
    { label: t("home.kpi_active"),    value: activeLeads.length, icon: "users" as const,       color: GOLD },
    { label: t("home.kpi_won"),       value: wonLeads.length,    icon: "trending-up" as const,  color: "#22c55e" },
    { label: t("home.kpi_due_today"), value: todayTasks.length,  icon: "check-square" as const, color: "#3b82f6" },
    { label: t("home.kpi_total"),     value: myLeads.length,     icon: "bar-chart-2" as const,  color: NAVY },
  ];

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <ScreenHeader
        title={t("home.app_name")}
        subtitle={t("home.app_tagline")}
        rightElement={
          <TouchableOpacity
            onPress={toggleTheme}
            style={s.themeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name={isDark ? "sun" : "moon"} size={15} color="rgba(201,168,76,0.9)" />
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} colors={[GOLD]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Banner */}
        <View style={s.banner}>
          <View>
            <Text style={[s.greetText, { color: fg }]}>
              {getGreeting(t)}, {user?.name.split(" ")[0]} 👋
            </Text>
            <Text style={[s.dateText, { color: muted }]}>
              {new Date().toLocaleDateString(language === "ar" ? "ar" : "en-US", { weekday: "long", month: "long", day: "numeric" })}
            </Text>
          </View>
        </View>

        {/* KPI Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.kpiRow}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        >
          {kpis.map((kpi) => (
            <View key={kpi.label} style={[s.kpiCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[s.kpiIcon, { backgroundColor: `${kpi.color}16` }]}>
                <Feather name={kpi.icon} size={18} color={kpi.color} />
              </View>
              <Text style={[s.kpiValue, { color: fg }]}>{kpi.value}</Text>
              <Text style={[s.kpiLabel, { color: muted }]}>{kpi.label}</Text>
              <View style={[s.kpiAccent, { backgroundColor: kpi.color }]} />
            </View>
          ))}
        </ScrollView>

        {/* Active Leads */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: fg }]}>{t("home.my_leads")}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/leads")} style={s.seeAllBtn}>
              <Text style={[s.seeAll, { color: GOLD }]}>{t("home.view_all")}</Text>
              <Feather name="arrow-right" size={13} color={GOLD} />
            </TouchableOpacity>
          </View>

          {leadsLoading ? (
            <>
              <View style={[s.skeleton, { backgroundColor: cardBorder, height: 64, marginBottom: 8 }]} />
              <View style={[s.skeleton, { backgroundColor: cardBorder, height: 64, marginBottom: 8 }]} />
            </>
          ) : activeLeads.length === 0 ? (
            <View style={s.empty}>
              <Feather name="inbox" size={28} color={muted} />
              <Text style={[s.emptyText, { color: muted }]}>{t("home.no_active_leads")}</Text>
            </View>
          ) : (
            activeLeads.slice(0, 5).map((lead) => {
              const sc = (cr as Record<string, { bg: string }>)[lead.status]?.bg ?? GOLD;
              const status = (cr as Record<string, { label: string }>)[lead.status];
              return (
                <TouchableOpacity
                  key={lead.id}
                  style={[s.leadCard, { backgroundColor: cardBg, borderColor: cardBorder }]}
                  onPress={() => router.push({ pathname: "/(tabs)/leads/[id]", params: { id: lead.id } })}
                  activeOpacity={0.75}
                >
                  <View style={[s.statusBar, { backgroundColor: sc }]} />
                  <View style={s.leadInfo}>
                    <Text style={[s.leadName, { color: fg }]} numberOfLines={1}>{lead.name}</Text>
                    <Text style={[s.leadProject, { color: muted }]} numberOfLines={1}>{lead.projectName ?? t("home.no_project")}</Text>
                  </View>
                  <View style={[s.badge, { backgroundColor: `${sc}18` }]}>
                    <Text style={[s.badgeText, { color: sc }]}>
                      {status?.label ?? lead.status}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={muted} />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Today's Tasks */}
        <View style={[s.section, { marginBottom: 100 }]}>
          <Text style={[s.sectionTitle, { color: fg }]}>{t("home.todays_tasks")}</Text>
          {tasksLoading ? (
            <View style={[s.skeleton, { backgroundColor: cardBorder, height: 80 }]} />
          ) : todayTasks.length === 0 ? (
            <View style={s.empty}>
              <Feather name="calendar" size={28} color={muted} />
              <Text style={[s.emptyText, { color: muted }]}>{t("home.no_tasks_today")}</Text>
            </View>
          ) : (
            todayTasks.slice(0, 5).map((task) => {
              const done = task.status === "done";
              return (
                <View key={task.id} style={[s.taskRow, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <View style={[s.taskCheck, done && { backgroundColor: "rgba(34,197,94,0.12)", borderColor: "#22c55e" }]}>
                    <Feather name={done ? "check" : "clock"} size={13} color={done ? "#22c55e" : muted} />
                  </View>
                  <Text style={[s.taskTitle, { color: fg }, done && s.taskDone]} numberOfLines={1}>
                    {task.title}
                  </Text>
                  {done && (
                    <View style={[s.badge, { backgroundColor: "rgba(34,197,94,0.12)" }]}>
                      <Text style={[s.badgeText, { color: "#22c55e" }]}>{t("home.done_badge")}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1 },
  scroll:        { flex: 1 },
  content:       { paddingHorizontal: 20, paddingTop: 16 },
  themeBtn: {
    width: 34, height: 34, borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.35)",
    backgroundColor: "rgba(201,168,76,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  banner: {
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
    marginBottom: 20,
  },
  greetText:     { fontSize: 22, fontWeight: "700" },
  dateText:      { fontSize: 13, marginTop: 2 },
  kpiRow:        { marginHorizontal: -20, marginBottom: 24 },
  kpiCard:       {
    borderRadius: 14, padding: 16, width: 118, overflow: "hidden",
    borderWidth: 1,
    ...shadow({ opacity: 0.06, radius: 10, elevation: 3 }),
  },
  kpiIcon:       { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  kpiValue:      { fontSize: 26, fontWeight: "700" },
  kpiLabel:      { fontSize: 11, marginTop: 2 },
  kpiAccent:     { position: "absolute", right: 0, top: 0, bottom: 0, width: 3, borderTopRightRadius: 14, borderBottomRightRadius: 14 },
  section:       { marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle:  { fontSize: 16, fontWeight: "700" },
  seeAllBtn:     { flexDirection: "row", alignItems: "center", gap: 4 },
  seeAll:        { fontSize: 13, fontWeight: "600" },
  skeleton:      { borderRadius: 12 },
  empty:         { alignItems: "center", paddingVertical: 28, gap: 10 },
  emptyText:     { fontSize: 14 },
  leadCard:      {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 13, overflow: "hidden",
    borderWidth: 1, paddingVertical: 12, paddingRight: 12,
    marginBottom: 8,
    ...shadow({ opacity: 0.04, radius: 6, elevation: 2 }),
  },
  statusBar:     { width: 4, alignSelf: "stretch", borderRadius: 2 },
  leadInfo:      { flex: 1 },
  leadName:      { fontSize: 14, fontWeight: "600" },
  leadProject:   { fontSize: 12, marginTop: 2 },
  badge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  badgeText:     { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  taskRow:       {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, padding: 14,
    marginBottom: 6, borderWidth: 1,
  },
  taskCheck:     {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 1.5, borderColor: "#d8d4cd",
    alignItems: "center", justifyContent: "center",
  },
  taskTitle:     { flex: 1, fontSize: 14 },
  taskDone:      { textDecorationLine: "line-through", opacity: 0.5 },
});
