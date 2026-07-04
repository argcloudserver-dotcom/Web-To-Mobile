import React, { useState } from "react";
import { Image, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useUITheme } from "../theme/UITheme";

export interface AvatarProps {
  uri?: string | null;
  /** Fallback text, e.g. initials, shown when there's no image or it fails to load */
  fallback?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, fallback, size = 40, style }) => {
  const { colors, typography } = useUITheme();
  const [errored, setErrored] = useState(false);

  const showImage = !!uri && !errored;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: uri! }}
          style={{ width: size, height: size }}
          onError={() => setErrored(true)}
        />
      ) : (
        <Text
          style={{
            color: colors.secondaryForeground,
            fontSize: size * 0.4,
            fontFamily: typography.fontFamily.semibold,
          }}
        >
          {(fallback ?? "?").slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
};
Avatar.displayName = "Avatar";
