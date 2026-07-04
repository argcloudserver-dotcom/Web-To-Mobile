/**
 * User Permission Overrides — Mobile.
 * Mirrors web /permissions. Admin-only. Lists employees, tap to open a modal
 * with per-module Role Default / Explicit Allow / Explicit Deny toggles.
 */
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useListUsers } from "@workspace/api-client/hooks/employees";
import { apiClient } from "@workspace/api-client";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/contexts/LanguageContext";

type OverrideValue = "default" | "allow" | "deny";

const MODULES: Array<{ key: string; labelKey: string; perms: Array<{ key: string; labelKey: string }> }> = [
  {
    key: "leads",
    labelKey: "permissions_screen.module_leads",
    perms: [
      { key: "view", labelKey: "permissions_screen.perm_leads_view" },
      { key: "edit", labelKey: "permissions_screen.perm_leads_edit" },
      { key: "assign", labelKey: "permissions_screen.perm_leads_assign" },
      { key: "delete", labelKey: "permissions_screen.perm_leads_delete" },
    ],
  },
  {
    key: "resale",
    labelKey: "permissions_screen.module_resale",
    perms: [
      { key: "view", labelKey: "permissions_screen.perm_resale_view" },
      { key: "create", labelKey: "permissions_screen.perm_resale_create" },
      { key: "delete", labelKey: "permissions_screen.perm_resale_delete" },
    ],
  },
  {
    key: "projects",
    labelKey: "permissions_screen.module_projects",
    perms: [
      { key: "view", labelKey: "permissions_screen.perm_projects_view" },
      { key: "edit", labelKey: "permissions_screen.perm_projects_edit" },
    ],
  },
  {
    key: "targets",
    labelKey: "permissions_screen.module_targets",
    perms: [
      { key: "view", labelKey: "permissions_screen.perm_targets_view" },
      { key: "edit", labelKey: "permissions_screen.perm_targets_edit" },
    ],
  },
];

const ROLE_FILTERS = ["all", "sales_agent", "team_leader", "sales_manager", "director"] as const;
const ROLE_FILTER_LABEL_KEYS: Record<(typeof ROLE_FILTERS)[number], string> = {
  all: "permissions_screen.all_roles",
  sales_agent: "permissions_screen.role_sales_agent",
  team_leader: "permissions_screen.role_team_leader",
  sales_manager: "permissions_screen.role_sales_manager",
  director: "permissions_screen.role_director",
};

export default function PermissionsScreen(): React.ReactElement {
  const router = useRouter();
  const { colors: c } = useColors();
  const { t } = useLanguage();
  const { data: users = [], isLoading } = useListUsers();

  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [selected, setSelected] = React.useState<any | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, OverrideValue>>({});

  const filtered = React.useMemo(() => {
    return (users as any[]).filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    });
  }, [users, roleFilter, search]);

  const openEmployee = async (user: any) => {
    setSelected(user);
    try {
      const res: any = await apiClient.request(`/users/${user.id}/permissions`, { method: "GET" });
      setOverrides(res?.overrides ?? {});
    } catch {
      setOverrides({});
    }
  };

  const setOverride = (moduleKey: string, permKey: string, value: OverrideValue) => {
    const k = `${moduleKey}.${permKey}`;
    setOverrides((prev) => ({ ...prev, [k]: value }));
  };

  const save = async () => {
    if (!selected) return;
    try {
      await apiClient.request(`/users/${selected.id}/permissions`, {
        method: "PUT",
        body: JSON.stringify({ overrides }),
        headers: { "Content-Type": "application/json" },
      });
      setSelected(null);
    } catch (e) {
      // no-op; toast layer can hook in
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScreenHeader
        title={t("permissions_screen.title")}
        subtitle={t("permissions_screen.employee_count", { count: filtered.length })}
        onBack={() => router.back()}
      />

      <View style={styles.filters}>
        <View style={[styles.searchBox, { backgroundColor: c.card, borderColor: c.border }]}>
          <Feather name="search" size={16} color={c.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("permissions_screen.search_placeholder")}
            placeholderTextColor={c.mutedForeground}
            style={[styles.searchInput, { color: c.foreground }]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleRow}>
          {ROLE_FILTERS.map((r) => {
            const active = roleFilter === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRoleFilter(r)}
                style={[
                  styles.roleChip,
                  {
                    backgroundColor: active ? c.accent : "transparent",
                    borderColor: active ? c.accent : c.border,
                  },
                ]}
              >
                <Text style={{ color: active ? c.accentForeground : c.foreground, fontSize: 12, fontWeight: "600" }}>
                  {t(ROLE_FILTER_LABEL_KEYS[r])}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={c.accent} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(u: any) => u.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openEmployee(item)}
              style={[styles.userCard, { backgroundColor: c.card, borderColor: c.border }]}
            >
              <View style={[styles.avatar, { backgroundColor: c.accent }]}>
                <Text style={[styles.avatarText, { color: c.accentForeground }]}>{item.name?.[0] ?? "?"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: c.foreground }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.userMeta, { color: c.mutedForeground }]} numberOfLines={1}>
                  {item.role?.replace("_", " ")} · {item.email}
                </Text>
              </View>
              <Feather name="sliders" size={18} color={c.accent} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: c.mutedForeground }]}>{t("permissions_screen.no_employees_match")}</Text>
          }
        />
      )}

      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        <View style={{ flex: 1, backgroundColor: c.background }}>
          <ScreenHeader
            title={selected?.name ?? t("permissions_screen.permissions_title")}
            subtitle={t("permissions_screen.overrides_subtitle")}
            onBack={() => setSelected(null)}
            rightElement={
              <TouchableOpacity onPress={save} style={[styles.saveBtn, { backgroundColor: c.accent }]}>
                <Text style={[styles.saveBtnText, { color: c.accentForeground }]}>{t("permissions_screen.save")}</Text>
              </TouchableOpacity>
            }
          />
          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            {MODULES.map((mod) => (
              <View
                key={mod.key}
                style={[styles.moduleCard, { backgroundColor: c.card, borderColor: c.border }]}
              >
                <Text style={[styles.moduleTitle, { color: c.foreground }]}>{t(mod.labelKey)}</Text>
                {mod.perms.map((p) => {
                  const key = `${mod.key}.${p.key}`;
                  const value: OverrideValue = overrides[key] ?? "default";
                  return (
                    <View key={key} style={styles.permRow}>
                      <Text style={[styles.permLabel, { color: c.foreground }]}>{t(p.labelKey)}</Text>
                      <View style={styles.segment}>
                        {(["default", "allow", "deny"] as OverrideValue[]).map((opt) => {
                          const active = value === opt;
                          const tone =
                            opt === "allow" ? c.success : opt === "deny" ? c.danger : c.accent;
                          const optLabelKey =
                            opt === "allow" ? "permissions_screen.opt_allow" : opt === "deny" ? "permissions_screen.opt_deny" : "permissions_screen.opt_default";
                          return (
                            <Pressable
                              key={opt}
                              onPress={() => setOverride(mod.key, p.key, opt)}
                              style={[
                                styles.segmentBtn,
                                {
                                  backgroundColor: active ? tone : "transparent",
                                  borderColor: active ? tone : c.border,
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  color: active ? "#fff" : c.foreground,
                                  fontSize: 11,
                                  fontWeight: "700",
                                }}
                              >
                                {t(optLabelKey)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14 },
  roleRow: { gap: 8, paddingVertical: 6, paddingRight: 8 },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "700" },
  userName: { fontSize: 14, fontWeight: "700" },
  userMeta: { fontSize: 12, marginTop: 2 },
  empty: { textAlign: "center", padding: 32, fontSize: 13 },
  moduleCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  moduleTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 4,
  },
  permLabel: { flex: 1, fontSize: 13 },
  segment: { flexDirection: "row", gap: 6 },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBtnText: { fontWeight: "700", fontSize: 13 },
});
