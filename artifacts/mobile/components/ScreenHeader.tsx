import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  noBorder?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  rightElement,
  onBack,
  noBorder = false,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={["#0a1520", "#132035", "#1c3256"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.inner, { paddingTop: insets.top + 10 }]}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {rightElement ? (
          <View style={styles.rightSlot}>{rightElement}</View>
        ) : null}
      </View>

      {/* Gold horizon rule */}
      <LinearGradient
        colors={["transparent", "rgba(201,168,76,0.5)", "rgba(232,201,106,0.9)", "rgba(201,168,76,0.5)", "transparent"]}
        locations={[0, 0.15, 0.5, 0.85, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.goldRule}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
    color: "rgba(201,168,76,0.8)",
    letterSpacing: 0.3,
  },
  rightSlot: {
    alignItems: "flex-end",
  },
  goldRule: {
    height: 1.5,
  },
});
