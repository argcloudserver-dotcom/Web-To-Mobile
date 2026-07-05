import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const { width: W } = Dimensions.get("window");

const GOLD = "#c9a84c";
const GOLD_BRIGHT = "#e8c96a";

interface AuthHeroProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle?: string;
  iconColor?: string;
}

export function AuthHero({ icon, title, subtitle, iconColor }: AuthHeroProps) {
  return (
    <View style={s.hero}>
      <LinearGradient
        colors={["#0a1520", "#132035", "#1c3256", "#243d70"]}
        locations={[0, 0.3, 0.65, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* City silhouette */}
      <Svg
        viewBox="0 0 400 55"
        width={W}
        height={70}
        style={s.city}
        preserveAspectRatio="none"
      >
        <Path
          d="M0,55 L0,38 L18,38 L18,30 L30,30 L30,38 L48,38 L48,24 L58,24 L58,18 L66,18 L66,24 L82,24 L82,38 L96,38 L96,26 L106,26 L106,18 L114,18 L114,10 L122,10 L122,18 L136,18 L136,34 L150,34 L150,38 L162,38 L162,22 L172,22 L172,14 L180,14 L180,22 L194,22 L194,38 L208,38 L208,28 L220,28 L220,38 L234,38 L234,24 L244,24 L244,16 L252,16 L252,24 L266,24 L266,36 L280,36 L280,28 L292,28 L292,36 L308,36 L308,38 L320,38 L320,22 L332,22 L332,38 L348,38 L348,30 L360,30 L360,38 L376,38 L376,32 L400,32 L400,55 Z"
          fill="rgba(255,255,255,0.09)"
        />
      </Svg>

      {/* Gold horizon rule */}
      <LinearGradient
        colors={["transparent", "rgba(201,168,76,0.45)", "rgba(232,201,106,0.85)", "rgba(201,168,76,0.45)", "transparent"]}
        locations={[0, 0.15, 0.5, 0.85, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={s.horizonRule}
      />

      {/* Logo row */}
      <View style={s.logoRow}>
        <LinearGradient
          colors={[GOLD, GOLD_BRIGHT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.logoIcon}
        >
          <Svg width={18} height={18} viewBox="0 0 20 20" fill="none">
            <Path
              d="M2.5 17.5L10 2.5L17.5 17.5"
              stroke="#132035"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M5.5 13H14.5"
              stroke="#132035"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </Svg>
        </LinearGradient>
        <Text style={s.brand}>TIL Group</Text>
      </View>

      {/* Page icon + title */}
      <View style={s.pageIconWrap}>
        <Feather name={icon} size={22} color={iconColor ?? GOLD} />
      </View>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    height: 230,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 36,
  },
  city: {
    position: "absolute",
    bottom: 4,
    left: 0,
  },
  horizonRule: {
    position: "absolute",
    bottom: 4,
    left: 0,
    right: 0,
    height: 1.5,
  },
  logoRow: {
    position: "absolute",
    top: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  brand: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  pageIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(201,168,76,0.12)",
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(201,168,76,0.75)",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
