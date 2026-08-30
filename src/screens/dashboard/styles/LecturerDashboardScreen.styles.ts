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

  statNum: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    lineHeight: 27,
    fontWeight: Typography.weight.bold,
  },

  statLbl: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    lineHeight: 16,
    fontWeight: Typography.weight.medium,
    marginTop: 1,
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

  projectList: {
    gap: Spacing[3],
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

  projectAction: {
    minHeight: 54,
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  projectActionContent: {
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

  actionIconWarning: {
    backgroundColor: "rgba(245,158,11,0.12)",
  },

  actionText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },

  emptyCard: {
    minHeight: 86,
    padding: Spacing[3],
    borderRadius: BorderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  emptyIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  emptyContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  attentionCard: {
    padding: 0,
    overflow: "hidden",
    borderRadius: BorderRadius.xl,
  },

  attentionHeader: {
    minHeight: 86,
    padding: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  attentionIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  attentionIconSuccess: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  attentionContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  attentionAction: {
    minHeight: 48,
    paddingHorizontal: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footerSpace: {
    height: Spacing[5],
  },
});
