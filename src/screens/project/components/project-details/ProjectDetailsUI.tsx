import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles/ProjectDetailsScreen.styles";
import { Colors } from "@/theme";
import { AppText } from "@/components/ui";

type SectionHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderIcon}>
      <Ionicons name={icon} size={17} color={Colors.primary} />
    </View>

    <View style={styles.sectionHeaderText}>
      <AppText variant="h5" weight="semibold">
        {title}
      </AppText>

      <AppText variant="caption" color="secondary">
        {description}
      </AppText>
    </View>
  </View>
);

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  last?: boolean;
};

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  last = false,
}) => (
  <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={17} color={Colors.accent} />
    </View>

    <View style={styles.infoContent}>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>

      <AppText variant="body2" weight="medium">
        {value || "Not provided"}
      </AppText>
    </View>
  </View>
);

type LoadingRowProps = {
  label: string;
};

export const LoadingRow: React.FC<LoadingRowProps> = ({ label }) => (
  <View style={styles.loadingRow}>
    <ActivityIndicator size="small" color={Colors.primary} />

    <AppText variant="caption" color="secondary">
      {label}
    </AppText>
  </View>
);

type InlineMessageProps = {
  text: string;
};

export const InlineMessage: React.FC<InlineMessageProps> = ({ text }) => (
  <View style={styles.inlineMessage}>
    <AppText variant="caption" color="secondary">
      {text}
    </AppText>
  </View>
);
