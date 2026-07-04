import React from "react";
import { ScrollView, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

/**
 * RN has no native <table>, so this mirrors the web table visually with flex rows.
 * Wrap in a horizontal ScrollView when columns don't fit the screen width.
 */
export const Table: React.FC<{ children?: React.ReactNode; style?: StyleProp<ViewStyle>; horizontalScroll?: boolean }> = ({
  children,
  style,
  horizontalScroll = true,
}) => {
  const { colors, radius } = useUITheme();
  const content = (
    <View style={[{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: "hidden" }, style]}>
      {children}
    </View>
  );
  return horizontalScroll ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView> : content;
};

export const TableHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { colors } = useUITheme();
  return <View style={{ backgroundColor: colors.muted }}>{children}</View>;
};

export const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => <View>{children}</View>;

export const TableRow: React.FC<{ children?: React.ReactNode; style?: StyleProp<ViewStyle>; isLast?: boolean }> = ({
  children,
  style,
  isLast,
}) => {
  const { colors, spacing } = useUITheme();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          minHeight: 44,
          paddingHorizontal: spacing[3],
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: colors.divider,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const TableHead: React.FC<{ children?: React.ReactNode; width?: number; style?: StyleProp<TextStyle> }> = ({
  children,
  width = 120,
  style,
}) => {
  const { colors, typography } = useUITheme();
  return (
    <Text
      style={[
        { width, color: colors.mutedForeground, fontFamily: typography.fontFamily.semibold, fontSize: typography.fontSize.xs },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const TableCell: React.FC<{ children?: React.ReactNode; width?: number; style?: StyleProp<TextStyle> }> = ({
  children,
  width = 120,
  style,
}) => {
  const { colors, typography } = useUITheme();
  return (
    <Text style={[{ width, color: colors.foreground, fontSize: typography.fontSize.sm }, style]} numberOfLines={2}>
      {children}
    </Text>
  );
};
