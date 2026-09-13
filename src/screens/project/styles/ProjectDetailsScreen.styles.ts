import { StyleSheet } from "react-native";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../../theme";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  deletingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
  },

  deletingCard: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    padding: Spacing[6],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },

  deletingIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },

  deletingTitle: {
    textAlign: "center",
    marginBottom: Spacing[2],
  },

  deletingDescription: {
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },

  errorScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[5],
  },

  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[4],
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroRole: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },

  heroRoleText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.8,
  },

  heroMain: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing[3],
    gap: Spacing[3],
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroText: {
    flex: 1,
    minWidth: 0,
  },

  heroTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xl,
    lineHeight: 26,
    fontWeight: Typography.weight.bold,
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.sm,
    marginTop: 2,
  },

  heroBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing[3],
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    minHeight: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: "#7FE0A4",
  },

  statusText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },

  heroYear: {
    color: "rgba(255,255,255,0.52)",
    fontSize: Typography.size.xs,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[3],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  content: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },

  editBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[3],
    marginBottom: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  editBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  editBannerContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  bannerAction: {
    minHeight: 36,
    paddingHorizontal: Spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },

  supervisionOverviewCard: {
    marginBottom: Spacing[4],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent,
    ...Shadows.sm,
  },

  supervisionOverviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  supervisionOverviewTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    minWidth: 0,
  },

  supervisionStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    marginBottom: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accent,
  },

  supervisionStatusCardAccepted: {
    backgroundColor: Colors.status.successLight,
    borderColor: Colors.status.success,
  },

  supervisionStatusCardRejected: {
    backgroundColor: Colors.status.errorLight,
    borderColor: Colors.status.errorBorder,
  },

  supervisionStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisionStatusIconAccepted: {
    backgroundColor: Colors.status.successLight,
  },

  supervisionStatusIconRejected: {
    backgroundColor: Colors.status.errorLight,
  },

  supervisionStatusContent: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },

  viewRequestsButton: {
    minHeight: 38,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
    flexShrink: 0,
  },

  supervisionEmpty: {
    marginTop: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
  },

  supervisionRequestList: {
    marginTop: Spacing[3],
    gap: Spacing[2],
  },

  studentSupervisionRequest: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  studentSupervisionRequestAccepted: {
    backgroundColor: Colors.status.successLight,
    borderColor: Colors.status.success,
  },

  studentSupervisionRequestRejected: {
    backgroundColor: Colors.status.errorLight,
    borderColor: Colors.status.errorBorder,
  },

  requestStatusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
  },

  requestStatusBadgeAccepted: {
    backgroundColor: Colors.status.successLight,
  },

  requestStatusBadgeRejected: {
    backgroundColor: Colors.status.errorLight,
  },

  latestRequestMessage: {
    marginTop: Spacing[3],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  attentionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    ...Shadows.sm,
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

  attentionContent: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },

  attentionAction: {
    minHeight: 38,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  nextStepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },

  nextStepIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  nextStepContent: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },

  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  sectionHeaderText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  card: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[3],
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  bodyText: {
    lineHeight: 22,
  },

  editTitle: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[3],
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    backgroundColor: Colors.surface,
    marginBottom: Spacing[3],
  },

  editAbstract: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    lineHeight: 21,
    backgroundColor: Colors.surface,
    textAlignVertical: "top",
  },

  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  subsectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    flex: 1,
    minWidth: 0,
  },

  subsectionIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisorIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  assignedBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.status.successLight,
  },

  inlineEmpty: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  supervisorAvatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  personDetails: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  smallPrimaryButton: {
    minWidth: 76,
    minHeight: 38,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  iconActionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  workflowBlock: {
    marginTop: Spacing[5],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  workflowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  workflowHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  workflowHeaderContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  directoryCard: {
    marginTop: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing[3],
  },

  directoryPerson: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  directoryAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  directoryAvatarAccent: {
    backgroundColor: Colors.accentLight,
  },

  directoryActionButton: {
    minHeight: 42,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    width: "100%",
  },

  directoryActionButtonAccent: {
    backgroundColor: Colors.accent,
  },

  directoryActionButtonDisabled: {
    opacity: 0.55,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing[4],
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },

  inlineMessage: {
    paddingVertical: Spacing[4],
  },

  pendingRequest: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.accentLight,
  },

  pendingIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  pendingContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  supervisionRequest: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginTop: Spacing[4],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  requestStatusIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  requestStatusIconAccepted: {
    backgroundColor: Colors.status.successLight,
  },

  requestStatusIconRejected: {
    backgroundColor: Colors.status.errorLight,
  },

  requestStatusContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  requestActions: {
    flexDirection: "row",
    gap: Spacing[2],
    flexShrink: 0,
  },

  acceptSmallButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.status.success,
    alignItems: "center",
    justifyContent: "center",
  },

  rejectSmallButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.status.errorLight,
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryActions: {
    marginTop: Spacing[5],
    gap: Spacing[3],
  },

  primaryActionButton: {
    minHeight: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
  },

  selectedUploadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    padding: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  selectedUploadInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    flex: 1,
    minWidth: 0,
  },

  selectedUploadTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  selectedUploadActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    flexShrink: 0,
  },

  confirmUploadButton: {
    minHeight: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
  },

  cancelUploadButton: {
    minHeight: 36,
    paddingHorizontal: Spacing[2],
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryActionButton: {
    minHeight: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
  },

  deleteActionButton: {
    minHeight: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.status.errorLight,
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
  },

  commentInput: {
    minHeight: 100,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[3],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[3],
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    lineHeight: 21,
    backgroundColor: Colors.surface,
    textAlignVertical: "top",
  },

  commentButton: {
    alignSelf: "stretch",
    marginTop: Spacing[3],
    minHeight: 46,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },

  commentButtonDisabled: {
    opacity: 0.45,
  },

  review: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  reviewContent: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[2],
  },

  reviewAuthor: {
    flex: 1,
    minWidth: 0,
  },

  reviewDate: {
    color: Colors.text.muted,
    fontSize: Typography.size.xs,
    flexShrink: 0,
  },

  reviewBody: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    lineHeight: 21,
  },

  reviewText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    lineHeight: 21,
  },

  discussionEmpty: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[7],
    paddingHorizontal: Spacing[4],
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[8],
    paddingHorizontal: Spacing[5],
  },

  emptyStateIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },

  emptyStateContent: {
    alignItems: "center",
    gap: Spacing[2],
  },

  errorState: {
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.status.errorLight,
    borderWidth: 1,
    borderColor: Colors.status.errorBorder,
    marginBottom: Spacing[5],
  },

  errorStateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  errorStateIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  errorStateContent: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },

  retryButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    marginTop: Spacing[3],
  },

  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  documentContent: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  commentMeta: {},
});
