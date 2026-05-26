import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge, Avatar } from "../ui";
import { Course, CourseStatus } from "../../types/course.types";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../theme";
import { formatSemester } from "../../utils/format.utils";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  variant?: "default" | "compact" | "pinned";
}

const statusBadgeMap: Record<
  CourseStatus,
  { label: string; variant: "success" | "neutral" | "default" }
> = {
  active: { label: "Active", variant: "success" },
  archived: { label: "Archived", variant: "neutral" },
  draft: { label: "Draft", variant: "default" },
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  variant = "default",
}) => {
  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={styles.compact}
        onPress={onPress}
        activeOpacity={0.78}
        accessibilityRole="button"
        accessibilityLabel={`${course.code}: ${course.title}`}
      >
        <View
          style={[styles.compactAccent, { backgroundColor: course.coverColor }]}
        />
        <View style={styles.compactContent}>
          <AppText variant="overline" color="tertiary">
            {course.code}
          </AppText>
          <AppText
            variant="body2"
            weight="semibold"
            numberOfLines={1}
            style={styles.compactTitle}
          >
            {course.title}
          </AppText>
          <AppText variant="caption" color="tertiary" numberOfLines={1}>
            {course.lecturerTitle} {course.lecturerName}
          </AppText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  }

  if (variant === "pinned") {
    return (
      <TouchableOpacity
        style={styles.pinnedCard}
        onPress={onPress}
        activeOpacity={0.78}
        accessibilityRole="button"
        accessibilityLabel={`Pinned: ${course.code} ${course.title}`}
      >
        <View
          style={[styles.pinnedHeader, { backgroundColor: course.coverColor }]}
        >
          <AppText variant="overline" style={styles.pinnedCode}>
            {course.code}
          </AppText>
          <View style={styles.pinnedIcon}>
            <Ionicons name="bookmark" size={13} color="rgba(255,255,255,0.7)" />
          </View>
        </View>
        <View style={styles.pinnedBody}>
          <AppText
            variant="body2"
            weight="semibold"
            numberOfLines={2}
            style={styles.pinnedTitle}
          >
            {course.title}
          </AppText>
          <AppText
            variant="caption"
            color="tertiary"
            numberOfLines={1}
            style={styles.pinnedLecturer}
          >
            {course.lecturerName}
          </AppText>
          <View style={styles.pinnedStats}>
            <Ionicons
              name="people-outline"
              size={12}
              color={Colors.text.tertiary}
            />
            <AppText variant="caption" color="tertiary" style={styles.statText}>
              {course.enrollmentCount}
            </AppText>
            <View style={styles.statDot} />
            <AppText variant="caption" color="tertiary">
              {course.creditUnits} CU
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const badge = statusBadgeMap[course.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityLabel={`${course.code}: ${course.title}`}
    >
      <View style={[styles.cardBanner, { backgroundColor: course.coverColor }]}>
        <View>
          <AppText style={styles.bannerSemester}>
            {formatSemester(course.semester)}
          </AppText>
          <AppText style={styles.bannerCode}>{course.code}</AppText>
        </View>
        <Badge label={badge.label} variant={badge.variant} />
      </View>
      <View style={styles.cardContent}>
        <AppText
          variant="h5"
          weight="semibold"
          numberOfLines={2}
          style={styles.title}
        >
          {course.title}
        </AppText>

        <View style={styles.lecturerRow}>
          <Avatar name={course.lecturerName} size="xs" />
          <View style={styles.lecturerInfo}>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {course.lecturerTitle} {course.lecturerName}
            </AppText>
            <AppText variant="caption" color="tertiary" numberOfLines={1}>
              {course.department}
            </AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons
              name="people-outline"
              size={13}
              color={Colors.text.tertiary}
            />
            <AppText variant="caption" color="tertiary" style={styles.statText}>
              {course.enrollmentCount} enrolled
            </AppText>
          </View>
          <View style={styles.stat}>
            <Ionicons
              name="document-text-outline"
              size={13}
              color={Colors.text.tertiary}
            />
            <AppText variant="caption" color="tertiary" style={styles.statText}>
              {course.resourceCount} resources
            </AppText>
          </View>
          <View style={styles.stat}>
            <Ionicons
              name="school-outline"
              size={13}
              color={Colors.text.tertiary}
            />
            <AppText variant="caption" color="tertiary" style={styles.statText}>
              {course.creditUnits} CU
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  cardBanner: {
    height: 76,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  bannerSemester: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: Typography.weight.medium,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    marginBottom: 2,
  },
  bannerCode: {
    color: "rgba(255,255,255,0.95)",
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
  cardContent: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  title: {
    lineHeight: 24,
  },
  lecturerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2.5],
  },
  lecturerInfo: {
    flex: 1,
    gap: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    paddingTop: Spacing[1],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    marginLeft: 2,
  },
  compact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingRight: Spacing[4],
  },
  compactAccent: {
    width: 3,
    alignSelf: "stretch",
  },
  compactContent: {
    flex: 1,
    padding: Spacing[3],
    gap: 2,
  },
  compactTitle: {
    marginTop: 1,
  },
  pinnedCard: {
    width: 180,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  pinnedHeader: {
    height: 72,
    padding: Spacing[3],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pinnedCode: {
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1,
  },
  pinnedIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  pinnedBody: {
    padding: Spacing[3],
    gap: Spacing[1],
  },
  pinnedTitle: {
    lineHeight: 20,
  },
  pinnedLecturer: {
    marginTop: 2,
  },
  pinnedStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing[2],
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border.strong,
  },
});
