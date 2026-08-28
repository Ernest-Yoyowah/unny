import { StyleSheet } from "react-native";

import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../../theme";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  emptyHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },

  emptyContent: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: Spacing[5],
  },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },

  headerLeft: {
    flex: 1,
    minWidth: 0,
    paddingRight: Spacing[3],
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.9,
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    lineHeight: 31,
    fontWeight: Typography.weight.bold,
    marginTop: 3,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.sm,
    lineHeight: 19,
    marginTop: 5,
    maxWidth: 300,
  },

  headerRight: {
    marginLeft: Spacing[2],
    flexShrink: 0,
  },

  headerCount: {
    width: 62,
    height: 62,
    borderRadius: BorderRadius.xl,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCountNumber: {
    color: Colors.text.inverse,
    fontSize: Typography.size.lg,
    lineHeight: 22,
    fontWeight: Typography.weight.bold,
  },

  headerCountLabel: {
    color: "rgba(255,255,255,0.52)",
    fontSize: Typography.size.xs,
    marginTop: 2,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },

  listHeaderText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  listHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  listHeaderIndicator: {
    width: 4,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent,
    flexShrink: 0,
  },

  addProjectButton: {
    minHeight: 44,
    paddingLeft: Spacing[2],
    paddingRight: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    flexShrink: 0,
    ...Shadows.sm,
  },

  addProjectIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  projectSeparator: {
    height: Spacing[4],
  },

  projectCard: {
    width: "100%",
    padding: 0,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },

  projectMain: {
    padding: Spacing[4],
  },

  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
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

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectHeaderText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing[1],
  },

  projectEyebrow: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.65,
  },

  status: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    maxWidth: "100%",
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent,
    flexShrink: 0,
  },

  chevronButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  titleSection: {
    marginTop: Spacing[4],
    paddingBottom: Spacing[1],
    minWidth: 0,
  },

  title: {
    lineHeight: 25,
  },

  meta: {
    marginTop: Spacing[4],
    gap: Spacing[2],
  },

  metaRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },

  metaIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  metaContent: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },

  metaText: {
    flex: 1,
    minWidth: 0,
  },

  progressSection: {
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  progressLabelRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  progressValue: {
    color: Colors.primary,
    flexShrink: 0,
  },

  supervisor: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[4],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
  },

  supervisorIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
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

  supervisorName: {
    marginTop: 1,
  },

  supervisorStatus: {
    maxWidth: 62,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    flexShrink: 0,
  },

  actions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
  },

  actionButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  actionButtonPrimary: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primaryDim,
  },

  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionIconPrimary: {
    backgroundColor: Colors.surface,
  },

  actionTitle: {
    maxWidth: "100%",
    textAlign: "center",
  },

  actionSubtitle: {
    maxWidth: "100%",
    textAlign: "center",
  },

  abstractSection: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  abstractHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  abstractTitleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  abstractIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  abstractText: {
    lineHeight: 20,
  },
});
