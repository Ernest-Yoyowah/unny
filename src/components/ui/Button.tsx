import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from "react-native";
import { AppText } from "./Typography";
import { Colors, Typography, BorderRadius, Spacing } from "../../theme";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const containerStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.accentLight,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  danger: {
    backgroundColor: Colors.status.error,
  },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    height: 36,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.md,
  },
  md: {
    height: 48,
    paddingHorizontal: Spacing[5],
    borderRadius: BorderRadius.lg,
  },
  lg: {
    height: 56,
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
  },
};

const labelColorMap: Record<ButtonVariant, TextColor> = {
  primary: "inverse",
  secondary: "accent",
  outline: "primary",
  ghost: "secondary",
  danger: "inverse",
};

type TextColor = "primary" | "secondary" | "inverse" | "accent" | "error";

const labelColorStyleMap: Record<TextColor, TextStyle> = {
  primary: { color: Colors.text.primary },
  secondary: { color: Colors.text.secondary },
  inverse: { color: Colors.text.inverse },
  accent: { color: Colors.accent },
  error: { color: Colors.status.error },
};

const labelSizeMap: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  md: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
  },
  lg: { fontSize: Typography.size.md, fontWeight: Typography.weight.semibold },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  label,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  labelStyle,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  const labelColor = labelColorMap[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        containerStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "danger"
              ? Colors.surface
              : Colors.primary
          }
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <AppText
            variant={size === "sm" ? "caption" : "body2"}
            style={[
              labelSizeMap[size],
              labelColorStyleMap[labelColor],
              labelStyle,
            ]}
          >
            {label}
          </AppText>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: Spacing[2],
  },
  iconRight: {
    marginLeft: Spacing[2],
  },
  disabled: {
    opacity: 0.45,
  },
});
