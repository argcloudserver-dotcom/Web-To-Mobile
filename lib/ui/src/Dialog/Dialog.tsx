import React from "react";
import {
  Modal as RNModal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  /** Tapping the dimmed backdrop closes the dialog. Defaults to true. */
  closeOnBackdropPress?: boolean;
}

/** Full-screen dimmed backdrop + centered card, the RN equivalent of the web Dialog. */
export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, closeOnBackdropPress = true }) => {
  const { colors, radius, shadows, spacing } = useUITheme();

  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: spacing[6] }}
        onPress={() => closeOnBackdropPress && onOpenChange(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            {
              width: "100%",
              maxWidth: 480,
              backgroundColor: colors.card,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing[6],
              gap: spacing[4],
            },
            shadows.lg,
          ]}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};
Dialog.displayName = "Dialog";

export const DialogHeader: React.FC<{ children?: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <View style={[{ gap: 4 }, style]}>{children}</View>
);

export const DialogTitle: React.FC<{ children?: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => {
  const { colors, typography } = useUITheme();
  return (
    <Text style={[{ color: colors.foreground, fontSize: typography.fontSize.lg, fontFamily: typography.fontFamily.semibold }, style]}>
      {children}
    </Text>
  );
};

export const DialogDescription: React.FC<{ children?: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => {
  const { colors, typography } = useUITheme();
  return <Text style={[{ color: colors.mutedForeground, fontSize: typography.fontSize.sm }, style]}>{children}</Text>;
};

export const DialogFooter: React.FC<{ children?: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <View style={[{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }, style]}>{children}</View>
);
