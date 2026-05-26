import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../theme";

interface DividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color = Colors.border.light,
  thickness = 1,
  spacing = 0,
}) => (
  <View
    style={[
      styles.base,
      { backgroundColor: color, height: thickness, marginVertical: spacing },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  base: {
    width: "100%",
  },
});
