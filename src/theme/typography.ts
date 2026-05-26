import { Platform } from "react-native";

const BASE_FONT = Platform.select({
  ios: "System",
  android: "Roboto",
  default: "System",
});

export const Typography = {
  fontFamily: {
    regular: BASE_FONT,
    medium: BASE_FONT,
    semibold: BASE_FONT,
    bold: BASE_FONT,
  },

  size: {
    "2xs": 10,
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 38,
  },

  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: -1,
    tight: -0.5,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1.5,
  },
} as const;
