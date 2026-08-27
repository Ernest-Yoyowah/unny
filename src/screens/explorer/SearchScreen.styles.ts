import { StyleSheet } from "react-native";

import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "../../theme";

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
    paddingBottom: Spacing[10],
    overflow: "visible",
  },

  headerContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
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
    maxWidth: 290,
  },

  headerIcon: {
    width: 52,
    height: 52,
    marginLeft: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
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
    minHeight: 52,
    paddingHorizontal: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.sm,
  },

  searchIcon: {
    width: 38,
    height: 38,
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
    fontSize: 14,
  },

  clearButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  resultsHeader: {
    marginTop: Spacing[5],
    marginBottom: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
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
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  peopleSection: {
    marginBottom: Spacing[6],
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

  personCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
  },

  personSeparator: {
    height: Spacing[2],
  },

  personIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDim,
    flexShrink: 0,
  },

  supervisorIcon: {
    backgroundColor: "#EEF2FF",
  },

  personInfo: {
    flex: 1,
    minWidth: 0,
    gap: Spacing[1],
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    minWidth: 0,
  },

  personName: {
    flexShrink: 1,
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

  roleText: {
    fontSize: 10,
    lineHeight: 14,
  },

  studentRoleText: {
    color: Colors.primary,
  },

  supervisorRoleText: {
    color: "#4F46E5",
  },

  separator: {
    height: Spacing[3],
  },

  emptyState: {
    paddingTop: Spacing[8],
    paddingHorizontal: Spacing[2],
    alignItems: "center",
  },

  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    alignItems: "center",
  },

  loadingState: {
    gap: Spacing[3],
  },

  loadingCard: {
    minHeight: 66,
    padding: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },

  loadingLines: {
    flex: 1,
    gap: Spacing[2],
  },
});
