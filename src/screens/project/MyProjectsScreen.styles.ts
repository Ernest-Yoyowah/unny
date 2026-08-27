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

  headerLeft: {
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

  headerRight: {
    marginLeft: Spacing[3],
    flexShrink: 0,
  },

  headerCount: {
    minWidth: 58,
    height: 58,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerCountNumber: {
    color: Colors.text.inverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },

  headerCountLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: Typography.size.xs,
    marginTop: 1,
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
    paddingBottom: Spacing[12],
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
    gap: 3,
  },

  addProjectButton: {
    minHeight: 40,
    paddingHorizontal: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    flexShrink: 0,
  },

  addProjectIcon: {
    color: Colors.primary,
  },

  projectSeparator: {
    height: Spacing[4],
  },

  projectCard: {
    width: "100%",
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  icon: {
    color: Colors.primary,
  },

  status: {
    maxWidth: "55%",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    flexShrink: 1,
  },

  titleSection: {
    marginTop: Spacing[4],
    minWidth: 0,
  },

  title: {
    lineHeight: 25,
  },

  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing[3],
    marginTop: Spacing[4],
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    gap: Spacing[2],
  },

  metaIcon: {
    color: Colors.text.secondary,
  },

  metaIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  metaText: {
    flexShrink: 1,
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

  supervisor: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: Spacing[2],
    marginTop: Spacing[4],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
  },

  supervisorIcon: {
    color: Colors.accent,
  },

  supervisorIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisorContent: {
    flex: 1,
    minWidth: 0,
  },

  supervisorName: {
    marginTop: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing[2],
    marginTop: Spacing[4],
  },

  actionCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 72,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
  },

  actionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  actionIconGlyph: {
    color: Colors.primary,
  },

  actionLabel: {
    flexShrink: 1,
    textAlign: "center",
  },

  abstractSection: {
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  abstractHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  abstractIcon: {
    color: Colors.text.tertiary,
  },

  abstractText: {
    lineHeight: 20,
  },

  section: {
    marginTop: Spacing[7],
  },

  sectionTitle: {
    marginBottom: Spacing[4],
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
  },

  infoIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    flexShrink: 0,
  },

  infoIconGlyph: {
    color: Colors.primary,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
    gap: Spacing[1],
  },
});
