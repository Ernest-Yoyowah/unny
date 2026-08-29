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

export type TextWeight =
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

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

interface AppTextProps extends Pick<
  TextProps,
  | "accessibilityLabel"
  | "accessibilityRole"
  | "testID"
  | "onLayout"
  | "onLongPress"
> {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
  onPress?: () => void;
  selectable?: boolean;
}

const variantMap: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: Typography.size["5xl"],
    lineHeight: Math.round(
      Typography.size["5xl"] * Typography.lineHeight.tight,
    ),
    letterSpacing: Typography.letterSpacing.tighter,
  },

  h1: {
    fontSize: Typography.size["4xl"],
    lineHeight: Math.round(
      Typography.size["4xl"] * Typography.lineHeight.tight,
    ),
    letterSpacing: Typography.letterSpacing.tight,
  },

  h2: {
    fontSize: Typography.size["3xl"],
    lineHeight: Math.round(Typography.size["3xl"] * Typography.lineHeight.snug),
    letterSpacing: Typography.letterSpacing.tight,
  },

  h3: {
    fontSize: Typography.size["2xl"],
    lineHeight: Math.round(Typography.size["2xl"] * Typography.lineHeight.snug),
    letterSpacing: Typography.letterSpacing.tight,
  },

  h4: {
    fontSize: Typography.size.xl,
    lineHeight: Math.round(Typography.size.xl * Typography.lineHeight.normal),
    letterSpacing: Typography.letterSpacing.tight,
  },

  h5: {
    fontSize: Typography.size.lg,
    lineHeight: Math.round(Typography.size.lg * Typography.lineHeight.normal),
  },

  body1: {
    fontSize: Typography.size.md,
    lineHeight: Math.round(Typography.size.md * Typography.lineHeight.normal),
  },

  body2: {
    fontSize: Typography.size.base,
    lineHeight: Math.round(Typography.size.base * Typography.lineHeight.normal),
  },

  caption: {
    fontSize: Typography.size.sm,
    lineHeight: Math.round(Typography.size.sm * Typography.lineHeight.normal),
  },

  label: {
    fontSize: Typography.size.sm,
    lineHeight: Math.round(Typography.size.sm * Typography.lineHeight.snug),
  },

  overline: {
    fontSize: Typography.size.xs,
    lineHeight: Math.round(Typography.size.xs * Typography.lineHeight.normal),
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: "uppercase",
  },
};

const variantDefaultWeight: Record<TextVariant, TextWeight> = {
  display: "bold",
  h1: "bold",
  h2: "bold",
  h3: "bold",
  h4: "semibold",
  h5: "semibold",
  body1: "regular",
  body2: "regular",
  caption: "regular",
  label: "medium",
  overline: "semibold",
};

const weightMap: Record<TextWeight, TextStyle> = {
  regular: {
    fontFamily: Typography.fontFamily.regular,
  },

  medium: {
    fontFamily: Typography.fontFamily.medium,
  },

  semibold: {
    fontFamily: Typography.fontFamily.semibold,
  },

  bold: {
    fontFamily: Typography.fontFamily.bold,
  },

  extrabold: {
    fontFamily: Typography.fontFamily.extrabold,
  },
};

const colorMap: Record<TextColor, TextStyle> = {
  primary: {
    color: Colors.text.primary,
  },

  secondary: {
    color: Colors.text.secondary,
  },

  tertiary: {
    color: Colors.text.tertiary,
  },

  muted: {
    color: Colors.text.muted,
  },

  inverse: {
    color: Colors.text.inverse,
  },

  accent: {
    color: Colors.accent,
  },

  error: {
    color: Colors.status.error,
  },

  success: {
    color: Colors.status.success,
  },

  warning: {
    color: Colors.status.warning,
  },
};

const getStyleWeight = (
  style: StyleProp<TextStyle>,
): TextWeight | undefined => {
  const flattened = StyleSheet.flatten(style);

  if (!flattened?.fontWeight) {
    return undefined;
  }

  switch (flattened.fontWeight) {
    case "800":
      return "extrabold";
    case "700":
      return "bold";
    case "600":
      return "semibold";
    case "500":
      return "medium";
    case "400":
      return "regular";
    default:
      return undefined;
  }
};

export const AppText: React.FC<AppTextProps> = ({
  variant = "body1",
  weight,
  color = "primary",
  children,
  style,
  numberOfLines,
  ellipsizeMode = "tail",
  onPress,
  selectable = false,
  accessibilityLabel,
  accessibilityRole,
  testID,
  onLayout,
  onLongPress,
}) => {
  const styleWeight = getStyleWeight(style);

  const resolvedWeight = weight ?? styleWeight ?? variantDefaultWeight[variant];

  const resolvedStyle = StyleSheet.flatten(style);

  const usesExplicitStyleWeight = Boolean(resolvedStyle?.fontWeight);

  return (
    <Text
      style={[
        styles.base,
        variantMap[variant],
        weightMap[resolvedWeight],
        colorMap[color],
        style,
        usesExplicitStyleWeight && {
          fontWeight: undefined,
        },
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      onPress={onPress}
      onLongPress={onLongPress}
      selectable={selectable}
      allowFontScaling={false}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}
      onLayout={onLayout}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
