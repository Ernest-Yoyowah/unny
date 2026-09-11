import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors, BorderRadius } from "../../theme";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
  rounded?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color,
  trackColor = Colors.border.light,
  height = 6,
  style,
  rounded = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const resolvedColor =
    color ?? (value >= max ? Colors.status.success : Colors.primary);

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: trackColor,
          height,
          borderRadius: rounded ? height / 2 : 0,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
            backgroundColor: resolvedColor,
            borderRadius: rounded ? height / 2 : 0,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
