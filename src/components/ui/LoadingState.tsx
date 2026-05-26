import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "./Typography";
import { Colors, Spacing } from "../../theme";

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  style,
  size = "large",
  fullScreen = false,
}) => (
  <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
    <ActivityIndicator size={size} color={Colors.primary} />
    {message && (
      <AppText variant="body2" color="secondary" style={styles.message}>
        {message}
      </AppText>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[10],
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: Spacing[4],
  },
});
