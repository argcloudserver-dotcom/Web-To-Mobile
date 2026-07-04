import React from "react";
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface CardProps extends ViewProps {
  style?: StyleProp<any>;
}

export const Card = React.forwardRef<View, CardProps>(({ style, children, ...rest }, ref) => {
  const { colors, radius, shadows } = useUITheme();
  return (
    <View
      ref={ref}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
        },
        shadows.sm,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
});
Card.displayName = "Card";

export const CardHeader = React.forwardRef<View, CardProps>(({ style, ...rest }, ref) => {
  const { spacing } = useUITheme();
  return <View ref={ref} style={[{ padding: spacing[6], gap: spacing[1] }, style]} {...rest} />;
});
CardHeader.displayName = "CardHeader";

export interface CardTextProps {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const CardTitle = React.forwardRef<Text, CardTextProps>(({ style, children, ...rest }, ref) => {
  const { colors, typography } = useUITheme();
  return (
    <Text
      ref={ref}
      style={[
        { color: colors.foreground, fontSize: typography.fontSize.lg, fontFamily: typography.fontFamily.semibold },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<Text, CardTextProps>(({ style, children, ...rest }, ref) => {
  const { colors, typography } = useUITheme();
  return (
    <Text
      ref={ref}
      style={[{ color: colors.mutedForeground, fontSize: typography.fontSize.sm }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
});
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<View, CardProps>(({ style, ...rest }, ref) => {
  const { spacing } = useUITheme();
  return <View ref={ref} style={[{ padding: spacing[6], paddingTop: 0 }, style]} {...rest} />;
});
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<View, CardProps>(({ style, ...rest }, ref) => {
  const { spacing } = useUITheme();
  return (
    <View
      ref={ref}
      style={[{ flexDirection: "row", alignItems: "center", padding: spacing[6], paddingTop: 0 }, style]}
      {...rest}
    />
  );
});
CardFooter.displayName = "CardFooter";
