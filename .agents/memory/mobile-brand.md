---
name: Mobile brand system
description: TIL Group brand tokens and shared component patterns used across all mobile screens.
---

## Brand tokens (hard-coded, not from theme)
- NAVY_DEEP = "#0a1520"
- NAVY = "#0f1e35"
- NAVY_MID = "#1e3560"
- NAVY_LIGHT = "#243d70"
- GOLD = "#c9a84c"
- GOLD_BRIGHT = "#e8c96a"
- CREAM = "#faf9f6"

## Shared components
- `components/AuthHero.tsx` — mini navy gradient hero (230px) for all auth screens. Props: icon, title, subtitle, iconColor. Includes city silhouette SVG + gold horizon rule.
- `components/ScreenHeader.tsx` — navy gradient header used by all tab screens. Props: title, subtitle, rightElement, onBack, noBorder. White title, gold subtitle, gold horizon rule at bottom.

## Auth screen pattern
All auth screens use: KeyboardAvoidingView > ScrollView > AuthHero (230px) + cream panel (marginTop: -24, borderTopRadius: 28). Underline-style inputs (borderBottomWidth: 2) with gold focus state. Navy gradient CTA button via LinearGradient.

## Tab bar
Active tab colour: "#c9a84c" (GOLD). Tab bg: "#0a1520" dark / "#fff" light.

## Login screen (special)
Full Split Horizon hero (SCREEN_HEIGHT * 0.48) with 3-layer SVG city silhouette (react-native-svg), perspective rays, window lights, atmospheric fog gradient, gold horizon rule. Form panel slides up with -24px overlap.

**Why:** User selected "Split Horizon — Tighter Form" from canvas mockup and requested graduation into the app. All other auth screens use the lighter AuthHero variant for speed/consistency without needing full SVG.
