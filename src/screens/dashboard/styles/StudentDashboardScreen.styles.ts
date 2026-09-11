import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../../theme";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[8],
  },

  headerLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: Spacing[3],
  },

  greetingText: {
    color: "rgba(255,255,255,0.62)",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    lineHeight: 19,
  },

  headerName: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    lineHeight: 31,
    marginTop: 1,
  },

  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: Spacing[1],
    minWidth: 0,
  },

  orgName: {
    flex: 1,
    color: "rgba(255,255,255,0.52)",
    fontSize: Typography.size.xs,
    lineHeight: 17,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    flexShrink: 0,
  },

  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.status.error,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  notifBadgeText: {
    color: Colors.text.inverse,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: Typography.weight.bold,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[6],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  content: {
    paddingTop: Spacing[3],
    paddingBottom: Spacing[10],
  },

  statsGrid: {
    flexDirection: "row",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
  },

  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  statIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[1],
  },

  statIconPrimary: {
    backgroundColor: Colors.primaryDim,
  },

  statIconAccent: {
    backgroundColor: Colors.accentLight,
  },

  statIconWarning: {
    backgroundColor: "rgba(245,158,11,0.12)",
  },

  statIconSuccess: {
    backgroundColor: "rgba(34,197,94,0.12)",
  },

  statNum: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    lineHeight: 27,
    fontWeight: Typography.weight.bold,
  },

  statusBadge: {
    maxWidth: "100%",
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing[1],
  },

  statusBadgeText: {
    fontSize: Typography.size.xs,
    lineHeight: 16,
    fontWeight: Typography.weight.semibold,
    textAlign: "center",
  },

  statLbl: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    lineHeight: 16,
    fontWeight: Typography.weight.medium,
    marginTop: 4,
  },

  emptyStatsGrid: {
    flexDirection: "row",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
  },

  emptyStatCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 92,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  emptyStatIcon: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[1],
  },

  emptyStatNumber: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    lineHeight: 24,
    fontWeight: Typography.weight.bold,
  },

  emptyStatLabel: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    lineHeight: 16,
    fontWeight: Typography.weight.medium,
    marginTop: 1,
  },

  emptyState: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[6],
  },

  emptyStateHeader: {
    paddingHorizontal: Spacing[1],
  },

  emptyStateOverline: {
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },

  emptyStateTitle: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },

  emptyStateDescription: {
    lineHeight: 23,
    marginTop: Spacing[3],
    maxWidth: "96%",
  },

  createProjectCard: {
    marginTop: Spacing[5],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  createProjectTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  createProjectIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  createProjectHeading: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  createProjectDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing[4],
  },

  createProjectDetails: {
    gap: Spacing[3],
  },

  createProjectDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  createProjectButton: {
    minHeight: 50,
    marginTop: Spacing[5],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  createProjectButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.sm,
  },

  emptyStateFooter: {
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[1],
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[2],
  },

  emptyStateFooterIcon: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  emptyStateFooterContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    paddingTop: 2,
  },

  section: {
    marginTop: Spacing[7],
    paddingHorizontal: Spacing[4],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },

  sectionHeading: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  viewAllButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: Spacing[2],
    flexShrink: 0,
  },

  projectHero: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },

  projectHeroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  projectIdentity: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  projectIcon: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectIdentityText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  projectDepartment: {
    maxWidth: "100%",
  },

  projectStatus: {
    maxWidth: "42%",
    minHeight: 30,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    flexShrink: 0,
  },

  projectTitle: {
    marginTop: Spacing[4],
    lineHeight: 25,
  },

  projectMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginTop: Spacing[3],
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minWidth: 0,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.text.tertiary,
  },

  progressArea: {
    marginTop: Spacing[5],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },

  progressMessage: {
    marginTop: 1,
  },

  progressPercentage: {
    minWidth: 48,
    height: 40,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPercentageText: {
    color: Colors.primary,
    fontSize: Typography.size.sm,
  },

  progressTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },

  supervisorRow: {
    minHeight: 54,
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  supervisorAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisorContent: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },

  actionGrid: {
    gap: Spacing[2],
  },

  actionCard: {
    minHeight: 70,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    ...Shadows.sm,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionIconPrimary: {
    backgroundColor: Colors.primaryDim,
  },

  actionIconAccent: {
    backgroundColor: Colors.accentLight,
  },

  actionIconNeutral: {
    backgroundColor: Colors.primaryDim,
  },

  actionText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },

  filesCard: {
    padding: 0,
    overflow: "hidden",
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  fileRow: {
    minHeight: 68,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  fileContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  fileMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  fileMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.text.tertiary,
  },

  fileChevron: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[3],
  },

  emptyFiles: {
    minHeight: 86,
    padding: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  emptyFilesIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  emptyFilesContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  footerSpace: {
    height: Spacing[5],
  },
});
