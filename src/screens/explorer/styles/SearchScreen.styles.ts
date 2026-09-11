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
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[9],
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.58)",
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
    maxWidth: 300,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    flexShrink: 0,
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIcon: {
    width: 48,
    height: 48,
    marginLeft: Spacing[1],
    marginTop: Spacing[1],
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
    overflow: "hidden",
  },

  list: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[12],
  },

  searchBar: {
    minHeight: 60,
    paddingHorizontal: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },

  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  input: {
    flex: 1,
    minWidth: 0,
    marginLeft: Spacing[2],
    paddingVertical: 0,
    color: Colors.text.primary,
    fontSize: 15,
    lineHeight: 20,
  },

  clearButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  peopleSection: {
    marginTop: Spacing[7],
    marginBottom: Spacing[7],
    paddingTop: Spacing[1],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },

  sectionTitleWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  sectionCount: {
    minWidth: 30,
    height: 28,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  peopleList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: "hidden",
    ...Shadows.sm,
  },

  personRow: {
    minHeight: 70,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
  },

  personSeparator: {
    height: 1,
    marginLeft: 70,
    backgroundColor: Colors.border.light,
  },

  personAvatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDim,
    flexShrink: 0,
  },

  personAvatarSupervisor: {
    backgroundColor: "#EEF2FF",
  },

  personContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: Spacing[3],
  },

  personTopRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: Spacing[2],
  },

  personName: {
    flex: 1,
    minWidth: 0,
  },

  personSecondary: {
    marginTop: 3,
  },

  roleBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    flexShrink: 0,
  },

  studentBadge: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },

  supervisorBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },

  studentRoleText: {
    color: Colors.primary,
    fontSize: 10,
    lineHeight: 14,
  },

  supervisorRoleText: {
    color: "#4F46E5",
    fontSize: 10,
    lineHeight: 14,
  },

  personChevron: {
    width: 28,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
    flexShrink: 0,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },

  summaryCard: {
    flex: 1,
    minHeight: 74,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
    justifyContent: "center",
    ...Shadows.sm,
  },

  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },

  resultsTitle: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  resultsCount: {
    minWidth: 34,
    height: 30,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.status.successLight,
    borderWidth: 1,
    borderColor: Colors.status.success,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectSeparator: {
    height: Spacing[3],
  },

  emptyState: {
    paddingTop: Spacing[8],
    paddingHorizontal: Spacing[2],
    alignItems: "center",
  },

  errorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    alignItems: "center",
  },

  loadingState: {
    gap: Spacing[3],
  },

  loadingCard: {
    minHeight: 70,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  loadingLines: {
    flex: 1,
    gap: Spacing[2],
  },
});
