import { StyleSheet } from "react-native";

import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "../../../theme";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[9],
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },

  backButton: {
    width: 42,
    height: 42,
    marginTop: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.6)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    marginTop: 3,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.sm,
    lineHeight: 19,
    marginTop: 5,
    maxWidth: 280,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[7],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[12],
  },

  projectCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  projectIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    minWidth: 0,
  },

  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectIdentityContent: {
    flex: 1,
    minWidth: 0,
  },

  projectEyebrow: {
    fontSize: 9,
    letterSpacing: 0.7,
  },

  projectName: {
    marginTop: 2,
  },

  statusBadge: {
    maxWidth: 92,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    flexShrink: 0,
  },

  progressSection: {
    marginTop: Spacing[6],
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  sectionHeadingText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  progressPercentage: {
    flexShrink: 0,
  },

  progressPercentageText: {
    color: Colors.primary,
  },

  progressCard: {
    marginTop: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  progressTrack: {
    height: 9,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },

  progressMeta: {
    marginTop: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  progressMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },

  nextSection: {
    marginTop: Spacing[7],
  },

  currentCard: {
    marginTop: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },

  currentIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  currentContent: {
    flex: 1,
    minWidth: 0,
  },

  currentDescription: {
    marginTop: 3,
    lineHeight: 18,
  },

  currentStatus: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  currentStatusComplete: {
    backgroundColor: Colors.surface,
  },

  timelineSection: {
    marginTop: Spacing[7],
  },

  timeline: {
    marginTop: Spacing[4],
  },

  timelineItem: {
    flexDirection: "row",
    alignItems: "stretch",
    minWidth: 0,
  },

  timelineRail: {
    width: 32,
    alignItems: "center",
    flexShrink: 0,
  },

  timelineNode: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  timelineNodeCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  timelineNodeCurrent: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },

  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border.light,
    marginVertical: -1,
  },

  timelineLineCompleted: {
    backgroundColor: Colors.primary,
  },

  milestoneCard: {
    flex: 1,
    minWidth: 0,
    marginLeft: Spacing[3],
    marginBottom: Spacing[4],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  milestoneCardCurrent: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  milestoneTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  milestoneTitleWrap: {
    flex: 1,
    minWidth: 0,
  },

  milestoneTitle: {
    lineHeight: 20,
  },

  currentBadge: {
    alignSelf: "flex-start",
    marginTop: Spacing[2],
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
  },

  currentBadgeText: {
    color: Colors.primary,
    fontSize: 9,
    letterSpacing: 0.5,
  },

  milestoneStatus: {
    minHeight: 26,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },

  completedStatus: {
    backgroundColor: "#ECFDF3",
  },

  currentMilestoneStatus: {
    backgroundColor: Colors.primaryDim,
  },

  pendingStatus: {
    backgroundColor: Colors.background,
  },

  milestoneStatusText: {
    color: Colors.text.tertiary,
    fontSize: 10,
  },

  completedStatusText: {
    color: Colors.status.success,
  },

  currentStatusText: {
    color: Colors.primary,
  },

  milestoneHint: {
    marginTop: Spacing[3],
    lineHeight: 18,
  },

  footerSpace: {
    height: Spacing[5],
  },
});
