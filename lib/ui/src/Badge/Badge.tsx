import React from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";
import type { CrmStatusKey } from "../tokens/tokens";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  /** Use a CRM lead-status token instead of a generic variant (e.g. "qualified", "bought") */
  status?: CrmStatusKey;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", status, style }) => {
  const { colors, crmStatus, radius, typography, spacing } = useUITheme();

  let bg: string;
  let fg: string;
  let borderColor = "transparent";

  if (status) {
    const s = crmStatus[status];
    bg = s.muted;
    fg = s.text;
  } else {
    switch (variant) {
      case "secondary":
        bg = colors.secondary;
        fg = colors.secondaryForeground;
        break;
      case "destructive":
        bg = colors.destructive;
        fg = colors.destructiveForeground;
        break;
      case "outline":
        bg = "transparent";
        fg = colors.foreground;
        borderColor = colors.border;
        break;
      default:
        bg = colors.primary;
        fg = colors.primaryForeground;
    }
  }

  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          backgroundColor: bg,
          borderColor,
          borderWidth: borderColor === "transparent" ? 0 : 1,
          borderRadius: radius.md,
          paddingHorizontal: spacing[2],
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text style={{ color: fg, fontSize: typography.fontSize.xs, fontFamily: typography.fontFamily.semibold }}>
        {children ?? (status ? crmStatus[status].label : null)}
      </Text>
    </View>
  );
};
Badge.displayName = "Badge";
