import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Colors, BorderRadius, Spacing } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton: React.FC<Props> = ({
  width = "100%",
  height = 16,
  radius = BorderRadius.md,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius, opacity },
        style,
      ]}
    />
  );
};

export const ScreenSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + Spacing[5] }]}>
      <Skeleton width="58%" height={28} />
      <Skeleton width="88%" height={16} style={styles.line} />
      <Skeleton
        width="100%"
        height={120}
        radius={BorderRadius.xl}
        style={styles.block}
      />
      <Skeleton
        width="100%"
        height={72}
        radius={BorderRadius.xl}
        style={styles.block}
      />
      <Skeleton
        width="100%"
        height={72}
        radius={BorderRadius.xl}
        style={styles.block}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: { backgroundColor: Colors.border.default },
  screen: {
    flex: 1,
    padding: Spacing[5],
    paddingTop: Spacing[5],
    backgroundColor: Colors.background,
  },
  line: { marginTop: Spacing[3] },
  block: { marginTop: Spacing[5] },
});
