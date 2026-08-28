import React from "react";
import {
  Text,
  TextStyle,
  StyleProp,
  StyleSheet,
  TextProps,
} from "react-native";
import { Colors, Typography } from "../../theme";

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "body1"
  | "body2"
  | "caption"
  | "label"
  | "overline";

export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export type TextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverse"
  | "accent"
  | "muted"
  | "error"
  | "success"
  | "warning";

interface AppTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: TextProps["ellipsizeMode"];
  onPress?: () => void;
  selectable?: boolean;
}

const variantMap: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: Typography.size["5xl"],
    lineHeight: Typography.size["5xl"] * Typography.lineHeight.tight,
  },
  h1: {
    fontSize: Typography.size["4xl"],
    lineHeight: Typography.size["4xl"] * Typography.lineHeight.tight,
  },
  h2: {
    fontSize: Typography.size["3xl"],
    lineHeight: Typography.size["3xl"] * Typography.lineHeight.snug,
  },
  h3: {
    fontSize: Typography.size["2xl"],
    lineHeight: Typography.size["2xl"] * Typography.lineHeight.snug,
  },
  h4: {
    fontSize: Typography.size.xl,
    lineHeight: Typography.size.xl * Typography.lineHeight.normal,
  },
  h5: {
    fontSize: Typography.size.lg,
    lineHeight: Typography.size.lg * Typography.lineHeight.normal,
  },
  body1: {
    fontSize: Typography.size.md,
    lineHeight: Typography.size.md * Typography.lineHeight.normal,
  },
  body2: {
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * Typography.lineHeight.normal,
  },
  caption: {
    fontSize: Typography.size.sm,
    lineHeight: Typography.size.sm * Typography.lineHeight.normal,
  },
  label: {
    fontSize: Typography.size.sm,
    lineHeight: Typography.size.sm * Typography.lineHeight.snug,
    fontWeight: Typography.weight.medium,
  },
  overline: {
    fontSize: Typography.size.xs,
    lineHeight: Typography.size.xs * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: "uppercase",
  },
};

const weightMap: Record<TextWeight, TextStyle> = {
  regular: { fontWeight: Typography.weight.regular },
  medium: { fontWeight: Typography.weight.medium },
  semibold: { fontWeight: Typography.weight.semibold },
  bold: { fontWeight: Typography.weight.bold },
};

const colorMap: Record<TextColor, TextStyle> = {
  primary: { color: Colors.text.primary },
  secondary: { color: Colors.text.secondary },
  tertiary: { color: Colors.text.tertiary },
  muted: { color: Colors.text.muted },
  inverse: { color: Colors.text.inverse },
  accent: { color: Colors.accent },
  error: { color: Colors.status.error },
  success: { color: Colors.status.success },
  warning: { color: Colors.status.warning },
};

export const AppText: React.FC<AppTextProps> = ({
  variant = "body1",
  weight,
  color = "primary",
  children,
  style,
  numberOfLines,
  ellipsizeMode,
  onPress,
  selectable = false,
}) => {
  const baseWeight = StyleSheet.flatten(variantMap[variant])?.fontWeight
    ? {}
    : weightMap[weight ?? "regular"];

  return (
    <Text
      style={[
        variantMap[variant],
        baseWeight,
        weight ? weightMap[weight] : {},
        colorMap[color],
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      selectable={selectable}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};
