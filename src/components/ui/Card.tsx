import React from "react";
import { View, ViewStyle, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, BorderRadius, Shadows, Spacing } from "../../theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: "none" | "xs" | "sm" | "md" | "lg";
  padding?: number | "none";
  onPress?: () => void;
  borderColor?: string;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = "sm",
  padding,
  onPress,
  borderColor,
  backgroundColor = Colors.surface,
}) => {
  const resolvedPadding = padding === "none" ? 0 : (padding ?? Spacing[4]);
  const shadow = elevation === "none" ? {} : Shadows[elevation];

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius: BorderRadius.xl,
    padding: resolvedPadding,
    ...shadow,
    ...(borderColor ? { borderWidth: 1, borderColor } : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        style={[containerStyle, style]}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};

export const SectionCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => (
  <View style={[styles.sectionCard, style]}>{children}</View>
);

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
});
