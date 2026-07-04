import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface TooltipProps {
  children: React.ReactElement;
  label: string;
}

/**
 * Mobile has no hover, so this reveals the tooltip on long-press instead,
 * auto-hiding after a short delay — the closest RN equivalent of the web Tooltip.
 */
export const Tooltip: React.FC<TooltipProps> = ({ children, label }) => {
  const { colors, radius, spacing, typography } = useUITheme();
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Pressable
        onLongPress={() => {
          setVisible(true);
          setTimeout(() => setVisible(false), 1800);
        }}
      >
        {children}
      </Pressable>
      {visible ? (
        <View
          style={{
            position: "absolute",
            bottom: "100%",
            marginBottom: spacing[1],
            backgroundColor: colors.foreground,
            borderRadius: radius.sm,
            paddingHorizontal: spacing[2],
            paddingVertical: spacing[1],
            maxWidth: 220,
            zIndex: 50,
          }}
        >
          <Text style={{ color: colors.background, fontSize: typography.fontSize.xs }}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
};
Tooltip.displayName = "Tooltip";
