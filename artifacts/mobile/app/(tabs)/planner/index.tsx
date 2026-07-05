import React from "react";
import {
  ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet,
  Text, TextInput, TouchableOpacity, View, type ListRenderItem,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";

import {
  useListPlannerTasks, useCreatePlannerTask, useUpdatePlannerTask,
  useDeletePlannerTask, getListPlannerTasksQueryKey,
} from "@workspace/api-client/hooks/planner";
import type { PlannerTask } from "@workspace/api-client";
import { useI18n } from "@workspace/i18n";
import { parseApiError } from "@workspace/shared/errors";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useAppTheme } from "@/contexts/ThemeContext";

const GOLD = "#c9a84c";
const NAVY = "#0f1e35";
const NAVY_MID = "#1e3560";
const CREAM = "#faf9f6";

type Priority = "low" | "medium" | "high";
const PRIORITIES: ReadonlyArray<Priority> = ["low", "medium", "high"];
const PRIORITY_COLORS: Record<Priority, string> = { high: "#dc2626", medium: "#f59e0b", low: "#6b7280" };

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PlannerScreen(): React.ReactElement {
  const { t } = useI18n();
  const { isDark } = useAppTheme();
  const { user } = useAuthContext();
  const { colors: c } = useColors();
  const queryClient = useQueryClient();

  const bg = isDark ? c.background : CREAM;
  const cardBg = isDark ? c.card : "#fff";
  const cardBorder = isDark ? c.border : "#e8e4de";
  const fg = isDark ? c.foreground : NAVY;
  const muted = isDark ? c.mutedForeground : "#9a9490";

  const dateStr = React.useMemo(() => todayString(), []);
  const [newTitle, setNewTitle] = React.useState("");
  const [newPriority, setNewPriority] = React.useState<Priority>("medium");

  const { data: tasks = [], isLoading, isRefetching, refetch, error } = useListPlannerTasks({ userId: user?.id, date: dateStr });
  const createTask = useCreatePlannerTask();
  const updateTask = useUpdatePlannerTask();
  const deleteTask = useDeletePlannerTask();

  const invalidate = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getListPlannerTasksQueryKey() });
  }, [queryClient]);

  const onAdd = React.useCallback(() => {
    const title = newTitle.trim();
    if (!title) return;
    createTask.mutate(
      { data: { title, priority: newPriority, date: dateStr } },
      { onSuccess: () => { setNewTitle(""); invalidate(); }, onError: (err) => { const p = parseApiError(err); Alert.alert(p.title, p.message); } },
    );
  }, [newTitle, newPriority, dateStr, createTask, invalidate]);

  const onToggle = React.useCallback((task: PlannerTask) => {
    updateTask.mutate({ taskId: task.id, data: { isDone: !task.isDone } }, { onSuccess: invalidate, onError: (err) => { const p = parseApiError(err); Alert.alert(p.title, p.message); } });
  }, [updateTask, invalidate]);

  const onDelete = React.useCallback((task: PlannerTask) => {
    Alert.alert(task.title, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTask.mutate({ taskId: task.id }, { onSuccess: invalidate, onError: (err) => { const p = parseApiError(err); Alert.alert(p.title, p.message); } }) },
    ]);
  }, [deleteTask, invalidate]);

  const sorted = React.useMemo(() => {
    const pWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return (pWeight[b.priority as Priority] ?? 0) - (pWeight[a.priority as Priority] ?? 0);
    });
  }, [tasks]);

  const renderItem: ListRenderItem<PlannerTask> = React.useCallback(
    ({ item }) => (
      <TaskRow task={item} cardBg={cardBg} cardBorder={cardBorder} fg={fg} muted={muted}
        onToggle={() => onToggle(item)} onDelete={() => onDelete(item)} />
    ),
    [cardBg, cardBorder, fg, muted, onToggle, onDelete],
  );

  const done = sorted.filter(t => t.isDone).length;
  const total = sorted.length;

  return (
    <View style={[s.flex, { backgroundColor: bg }]}>
      <ScreenHeader
        title={t("planner.title")}
        subtitle={total > 0 ? `${done}/${total} ${t("home.done_badge").toLowerCase()}` : t("planner.subtitle")}
      />

      {/* Composer */}
      <View style={[s.composer, { backgroundColor: cardBg, borderBottomColor: cardBorder }]}>
        <View style={[s.inputRow, { backgroundColor: bg, borderColor: cardBorder }]}>
          <TextInput
            style={[s.input, { color: fg }]}
            placeholder={t("planner.task_name")}
            placeholderTextColor={muted}
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={onAdd}
            returnKeyType="done"
          />
        </View>
        <View style={s.priorityRow}>
          {PRIORITIES.map((p) => {
            const active = p === newPriority;
            const color = PRIORITY_COLORS[p];
            return (
              <TouchableOpacity
                key={p}
                style={[s.priorityChip, { borderColor: active ? color : cardBorder, backgroundColor: active ? `${color}18` : cardBg }]}
                onPress={() => setNewPriority(p)}
              >
                <Text style={[s.priorityTxt, { color: active ? color : muted, fontWeight: active ? "700" : "500" }]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[s.addBtn, { opacity: (!newTitle.trim() || createTask.isPending) ? 0.5 : 1 }]}
            onPress={onAdd}
            disabled={createTask.isPending || !newTitle.trim()}
          >
            <LinearGradient colors={[NAVY, NAVY_MID]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.addBtnGrad}>
              <Feather name="plus" size={14} color="#fff" />
              <Text style={s.addBtnTxt}>{t("planner.add_task")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && tasks.length === 0 ? (
        <View style={s.center}><ActivityIndicator color={GOLD} /></View>
      ) : error ? (
        <View style={[s.center, { padding: 24 }]}>
          <Text style={[s.errorTitle, { color: fg }]}>{parseApiError(error).title}</Text>
          <Text style={[{ color: muted, fontSize: 13, textAlign: "center" }]}>{parseApiError(error).message}</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GOLD} colors={[GOLD]} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Feather name="check-circle" size={36} color={muted} />
              <Text style={[s.emptyText, { color: muted }]}>{t("planner.no_tasks")}</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

interface TaskRowProps {
  task: PlannerTask; cardBg: string; cardBorder: string; fg: string; muted: string;
  onToggle: () => void; onDelete: () => void;
}
const TaskRow = React.memo(function TaskRow({ task, cardBg, cardBorder, fg, muted, onToggle, onDelete }: TaskRowProps) {
  const pColor = PRIORITY_COLORS[(task.priority as Priority) ?? "medium"];
  return (
    <View style={[s.taskRow, { backgroundColor: cardBg, borderColor: cardBorder }, task.isDone && { opacity: 0.55 }]}>
      <TouchableOpacity
        style={[s.checkbox, { borderColor: task.isDone ? "#22c55e" : cardBorder }, task.isDone && { backgroundColor: "#22c55e" }]}
        onPress={onToggle}
      >
        {task.isDone && <Feather name="check" size={13} color="#fff" />}
      </TouchableOpacity>
      <View style={s.taskBody}>
        <Text style={[s.taskTitle, { color: fg }, task.isDone && { textDecorationLine: "line-through" }]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={[s.pBadge, { backgroundColor: `${pColor}18` }]}>
          <Text style={[s.pBadgeTxt, { color: pColor }]}>{task.priority}</Text>
        </View>
      </View>
      <TouchableOpacity style={s.deleteBtn} onPress={onDelete}>
        <Feather name="trash-2" size={15} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );
});

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  composer: { paddingHorizontal: 20, paddingVertical: 14, gap: 10, borderBottomWidth: 1 },
  inputRow: { borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 14, height: 46, justifyContent: "center" },
  input: { fontSize: 15, height: "100%" },
  priorityRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  priorityChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  priorityTxt: { fontSize: 12, textTransform: "capitalize" },
  addBtn: { marginLeft: "auto", borderRadius: 10, overflow: "hidden" },
  addBtnGrad: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnTxt: { color: "#fff", fontSize: 13, fontWeight: "600" },
  list: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 12 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  taskRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 13, padding: 14, marginBottom: 8, borderWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  taskBody: { flex: 1, gap: 4 },
  taskTitle: { fontSize: 15, fontWeight: "500" },
  pBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  pBadgeTxt: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  deleteBtn: { padding: 6 },
  errorTitle: { fontSize: 17, fontWeight: "600", marginBottom: 6 },
});
