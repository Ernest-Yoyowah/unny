import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./Typography";
import { Button } from "./Button";
import { Colors, Spacing } from "../../theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "folder-open-outline",
  title,
  description,
  action,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={44} color={Colors.text.tertiary} />
    </View>
    <AppText
      variant="h5"
      weight="semibold"
      color="secondary"
      style={styles.title}
    >
      {title}
    </AppText>
    {description && (
      <AppText variant="body2" color="tertiary" style={styles.description}>
        {description}
      </AppText>
    )}
    {action && (
      <Button
        variant="outline"
        size="sm"
        label={action.label}
        onPress={action.onPress}
        style={styles.action}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[8],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing[2],
  },
  description: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing[5],
  },
  action: {
    marginTop: Spacing[2],
  },
});
