import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useUITheme } from "../theme/UITheme";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon or element rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon or element rendered after the label */
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "default",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      style,
      textStyle,
      ...rest
    },
    ref
  ) => {
    const { colors, radius, typography, spacing } = useUITheme();

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      default: { minHeight: 36, paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
      sm: { minHeight: 32, paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
      lg: { minHeight: 40, paddingHorizontal: spacing[8], paddingVertical: spacing[2] },
      icon: { height: 36, width: 36, paddingHorizontal: 0, paddingVertical: 0 },
    };

    const variantStyles: Record<ButtonVariant, { bg: string; border: string; fg: string }> = {
      default: { bg: colors.primary, border: colors.primary, fg: colors.primaryForeground },
      destructive: { bg: colors.destructive, border: colors.destructive, fg: colors.destructiveForeground },
      outline: { bg: "transparent", border: colors.border, fg: colors.foreground },
      secondary: { bg: colors.secondary, border: colors.border, fg: colors.secondaryForeground },
      ghost: { bg: "transparent", border: "transparent", fg: colors.foreground },
      link: { bg: "transparent", border: "transparent", fg: colors.primary },
    };

    const v = variantStyles[variant];
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.base,
          sizeStyles[size],
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            borderWidth: variant === "ghost" ? 0 : 1,
            borderRadius: radius.md,
            opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          },
          style,
        ]}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator size="small" color={v.fg} />
        ) : (
          <>
            {leftIcon}
            {children != null && (
              <Text
                style={[
                  {
                    color: v.fg,
                    fontSize: size === "sm" ? typography.fontSize.sm : typography.fontSize.base,
                    fontFamily: typography.fontFamily.medium,
                    textDecorationLine: variant === "link" ? "underline" : "none",
                  },
                  textStyle,
                ]}
              >
                {children}
              </Text>
            )}
            {rightIcon}
          </>
        )}
      </Pressable>
    );
  }
);
Button.displayName = "Button";

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
