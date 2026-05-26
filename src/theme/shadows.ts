import { Platform, ViewStyle } from "react-native";

type ShadowStyle = Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
>;

const shadow = (
  color: string,
  yOffset: number,
  opacity: number,
  radius: number,
  elevation: number,
): ShadowStyle => ({
  ...Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: yOffset },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {},
  }),
});

export const Shadows = {
  none: {} as ShadowStyle,
  xs: shadow("#0D1117", 1, 0.04, 1, 1),
  sm: shadow("#0D1117", 1, 0.06, 3, 2),
  md: shadow("#0D1117", 2, 0.08, 6, 4),
  lg: shadow("#0D1117", 4, 0.1, 12, 6),
  xl: shadow("#0D1117", 8, 0.12, 20, 10),
} as const;
