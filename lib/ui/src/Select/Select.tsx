import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Optional title shown above the option list in the picker sheet */
  title?: string;
}

/**
 * A tap-to-open picker matching the web `<Select>`: a bordered field showing the
 * current value, which opens a bottom-anchored option list on press.
 */
export const Select: React.FC<SelectProps> = ({ value, onValueChange, options, placeholder = "Select…", disabled, title }) => {
  const { colors, radius, spacing, typography } = useUITheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          minHeight: 36,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.input,
          backgroundColor: disabled ? colors.muted : colors.background,
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: selected ? colors.foreground : colors.mutedForeground,
            fontSize: typography.fontSize.base,
          }}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={{ color: colors.mutedForeground }}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              maxHeight: "70%",
              paddingBottom: spacing[6],
            }}
          >
            {title ? (
              <Text
                style={{
                  color: colors.foreground,
                  fontFamily: typography.fontFamily.semibold,
                  fontSize: typography.fontSize.base,
                  padding: spacing[4],
                }}
              >
                {title}
              </Text>
            ) : null}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                    style={{
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[4],
                      backgroundColor: isSelected ? colors.primaryMuted : "transparent",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.foreground,
                        fontFamily: isSelected ? typography.fontFamily.semibold : typography.fontFamily.sans,
                      }}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? <Text style={{ color: colors.primary }}>✓</Text> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
Select.displayName = "Select";
