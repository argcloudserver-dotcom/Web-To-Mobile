import React from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface LabelProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, style, disabled }) => {
  const { colors, typography, spacing } = useUITheme();
  return (
    <Text
      style={[
        {
          color: colors.foreground,
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.medium,
          marginBottom: spacing[1],
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
Label.displayName = "Label";
