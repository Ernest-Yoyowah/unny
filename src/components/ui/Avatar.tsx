import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "./Typography";
import { Colors, BorderRadius, Typography } from "../../theme";
import { getInitials } from "../../utils/format.utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  uri?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  backgroundColor?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
};

const colorPalette = [
  "#1C2B4A",
  "#1A3D2E",
  "#3D1C2B",
  "#1C3A4A",
  "#2B1C4A",
  "#3A2A1C",
  "#1A3540",
];

const getColorFromName = (name: string): string => {
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colorPalette.length;
  return colorPalette[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  uri,
  size = "md",
  style,
  backgroundColor,
}) => {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const bg = backgroundColor ?? getColorFromName(name);
  const initials = getInitials(name);

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: bg,
  };

  return (
    <View style={[styles.base, containerStyle, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
          accessibilityLabel={`${name} avatar`}
        />
      ) : (
        <AppText
          style={{
            fontSize,
            fontWeight: Typography.weight.semibold,
            color: Colors.text.inverse,
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
});
