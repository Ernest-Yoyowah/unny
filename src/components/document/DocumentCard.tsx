import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge } from "../ui";
import { Document, DocumentCategory } from "../../types/document.types";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import {
  formatBytes,
  getCategoryLabel,
  getFileTypeIcon,
} from "../../utils/format.utils";
import { formatRelativeTime } from "../../utils/date.utils";

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
  onDownload?: () => void;
}

const categoryVariant: Record<
  DocumentCategory,
  "info" | "warning" | "primary" | "default" | "neutral"
> = {
  lecture_note: "info",
  assignment: "warning",
  past_question: "primary",
  textbook: "neutral",
  supplementary: "default",
  announcement: "warning",
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onDownload,
}) => {
  const iconName = getFileTypeIcon(
    document.fileType,
  ) as keyof typeof Ionicons.glyphMap;
  const category = categoryVariant[document.category];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={document.title}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={22} color={Colors.accent} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Badge
            label={getCategoryLabel(document.category)}
            variant={category}
            size="sm"
          />
          {document.week != null && (
            <AppText variant="caption" color="tertiary">
              Week {document.week}
            </AppText>
          )}
        </View>

        <AppText
          variant="body2"
          weight="semibold"
          numberOfLines={2}
          style={styles.title}
        >
          {document.title}
        </AppText>

        {document.description && (
          <AppText variant="caption" color="tertiary" numberOfLines={1}>
            {document.description}
          </AppText>
        )}

        <View style={styles.metaRow}>
          <AppText variant="caption" color="tertiary">
            {formatBytes(document.fileSize)}
          </AppText>
          <View style={styles.metaDot} />
          <Ionicons
            name="arrow-down-circle-outline"
            size={12}
            color={Colors.text.tertiary}
          />
          <AppText variant="caption" color="tertiary" style={styles.metaText}>
            {document.downloadCount}
          </AppText>
          <View style={styles.metaDot} />
          <AppText variant="caption" color="tertiary">
            {formatRelativeTime(document.uploadedAt)}
          </AppText>
        </View>
      </View>

      {onDownload && (
        <TouchableOpacity
          onPress={onDownload}
          style={styles.downloadBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Download document"
          accessibilityRole="button"
        >
          <Ionicons
            name="cloud-download-outline"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing[3],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: Spacing[1.5],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border.strong,
  },
  metaText: {
    marginLeft: 1,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
});
