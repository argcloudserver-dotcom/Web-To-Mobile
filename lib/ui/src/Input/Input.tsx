import React, { useState } from "react";
import { TextInput, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface InputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  textContentType?: TextInputProps["textContentType"];
  /** Shows the destructive/error border, e.g. from a form validation state */
  invalid?: boolean;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, invalid, onFocus, onBlur, editable = true, ...rest }, ref) => {
    const { colors, radius, spacing, typography } = useUITheme();
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        ref={ref}
        editable={editable}
        placeholderTextColor={colors.mutedForeground}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            minHeight: 36,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: invalid ? colors.destructive : focused ? colors.ring : colors.input,
            backgroundColor: editable ? colors.background : colors.muted,
            color: colors.foreground,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            fontSize: typography.fontSize.base,
            opacity: editable ? 1 : 0.6,
          },
          style,
        ]}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";
