import React, { useEffect, useRef } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  radius?: number;
}

/** Pulsing placeholder block, mirroring the web `animate-pulse` skeleton. */
export const Skeleton: React.FC<SkeletonProps> = ({ style, width = "100%", height = 16, radius }) => {
  const { colors, radius: r } = useUITheme();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? r.md,
          backgroundColor: colors.primaryMuted,
          opacity,
        },
        style,
      ]}
    />
  );
};
Skeleton.displayName = "Skeleton";
