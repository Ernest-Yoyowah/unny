import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../../theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[7],
    backgroundColor: Colors.primary,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  headerTitleContainer: {
    flex: 1,
    minWidth: 0,
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.sm,
    lineHeight: 19,
    marginTop: 5,
    maxWidth: 300,
  },

  headerCount: {
    minWidth: 58,
    height: 58,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
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

  body: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[12],
  },

  studentIntro: {
    marginBottom: Spacing[5],
  },

  studentIntroText: {
    lineHeight: 20,
    marginTop: Spacing[1],
  },

  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[6],
    ...Shadows.sm,
  },

  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  overviewTitle: {
    marginTop: 3,
  },

  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewIconSuccess: {
    backgroundColor: Colors.status.successLight,
  },

  overviewDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing[4],
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },

  statPending: {
    color: Colors.accent,
  },

  statSuccess: {
    color: Colors.status.success,
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border.light,
  },

  sectionHeader: {
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },

  sectionHeaderText: {
    gap: 2,
  },

  studentRequestCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },

  studentRequestTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  personAvatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  personInfo: {
    flex: 1,
    minWidth: 0,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    flexShrink: 0,
  },

  projectBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginTop: Spacing[4],
  },

  projectIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectInfo: {
    flex: 1,
    minWidth: 0,
  },

  projectTitle: {
    marginTop: 2,
  },

  requestMessage: {
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  messageText: {
    lineHeight: 20,
    marginTop: Spacing[1],
  },

  statusExplanation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[2],
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    marginTop: Spacing[4],
  },

  statusExplanationText: {
    flex: 1,
    lineHeight: 18,
  },

  studentEmptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing[6],
    alignItems: "center",
    ...Shadows.sm,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },

  emptyTitle: {
    textAlign: "center",
  },

  emptyDescription: {
    textAlign: "center",
    lineHeight: 20,
    marginTop: Spacing[2],
  },

  helpCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    backgroundColor: Colors.primaryDim,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginTop: Spacing[2],
  },

  helpIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  helpContent: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  supervisorSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },

  supervisorSummaryIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisorSummaryContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  supervisorCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },

  supervisorCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  supervisorActions: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing[2],
    marginTop: Spacing[4],
  },

  acceptButton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },

  declineButton: {
    minHeight: 46,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.status.errorLight,
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[5],
  },
});
