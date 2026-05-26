import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { AppText } from "./Typography";
import { Colors, BorderRadius, Spacing, Typography } from "../../theme";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<
  BadgeVariant,
  { container: ViewStyle; text: TextStyle }
> = {
  default: {
    container: {
      backgroundColor: Colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: Colors.border.default,
    },
    text: { color: Colors.text.secondary },
  },
  primary: {
    container: { backgroundColor: Colors.primaryDim },
    text: { color: Colors.primary },
  },
  success: {
    container: {
      backgroundColor: Colors.status.successLight,
      borderWidth: 1,
      borderColor: Colors.status.successBorder,
    },
    text: { color: Colors.status.success },
  },
  warning: {
    container: {
      backgroundColor: Colors.status.warningLight,
      borderWidth: 1,
      borderColor: Colors.status.warningBorder,
    },
    text: { color: Colors.status.warning },
  },
  error: {
    container: {
      backgroundColor: Colors.status.errorLight,
      borderWidth: 1,
      borderColor: Colors.status.errorBorder,
    },
    text: { color: Colors.status.error },
  },
  info: {
    container: {
      backgroundColor: Colors.accentLight,
      borderWidth: 1,
      borderColor: Colors.status.infoBorder,
    },
    text: { color: Colors.accent },
  },
  neutral: {
    container: { backgroundColor: Colors.border.light },
    text: { color: Colors.text.tertiary },
  },
};

const dotColorMap: Record<BadgeVariant, string> = {
  default: Colors.text.tertiary,
  primary: Colors.primary,
  success: Colors.status.success,
  warning: Colors.status.warning,
  error: Colors.status.error,
  info: Colors.accent,
  neutral: Colors.text.tertiary,
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "sm",
  dot = false,
  style,
  textStyle,
}) => {
  const v = variantStyles[variant];
  const isSmall = size === "sm";

  return (
    <View
      style={[styles.base, isSmall ? styles.sm : styles.md, v.container, style]}
    >
      {dot && (
        <View style={[styles.dot, { backgroundColor: dotColorMap[variant] }]} />
      )}
      <AppText
        style={[
          styles.text,
          isSmall ? styles.textSm : styles.textMd,
          v.text,
          textStyle,
        ]}
      >
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: BorderRadius.full,
  },
  sm: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  text: {
    fontWeight: Typography.weight.semibold,
  },
  textSm: {
    fontSize: Typography.size.xs,
  },
  textMd: {
    fontSize: Typography.size.sm,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: Spacing[1],
  },
});
