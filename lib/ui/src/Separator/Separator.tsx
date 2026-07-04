import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = "horizontal", style }) => {
  const { colors } = useUITheme();
  return (
    <View
      style={[
        orientation === "horizontal"
          ? { height: 1, width: "100%" }
          : { width: 1, height: "100%" },
        { backgroundColor: colors.border },
        style,
      ]}
    />
  );
};
Separator.displayName = "Separator";
