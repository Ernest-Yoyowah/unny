import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
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
    gap: 2,
  },

  greetingText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },

  headerName: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },

  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },

  orgName: {
    color: "rgba(255,255,255,0.55)",
    fontSize: Typography.size.xs,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.error,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
  },

  content: {
    paddingBottom: Spacing[10],
    paddingTop: Spacing[2],
  },

  statsGrid: {
    flexDirection: "row",
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    paddingVertical: Spacing[3],
    gap: Spacing[1],
    elevation: 12,
    zIndex: 20,
    ...Shadows.md,
  },

  statNum: {
    color: Colors.text.primary,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
  },

  statLbl: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },

  section: {
    marginTop: Spacing[7],
    paddingHorizontal: Spacing[5],
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[4],
  },

  sectionTitle: {
    marginBottom: Spacing[4],
  },

  projectCard: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  projectTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  projectStatus: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    height: 30,
  },

  projectTitle: {
    marginTop: Spacing[5],
    lineHeight: 26,
  },

  projectMeta: {
    marginTop: Spacing[4],
    gap: Spacing[2],
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  progressBox: {
    marginTop: Spacing[5],
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },

  supervisorRow: {
    marginTop: Spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  actionGrid: {
    flexDirection: "row",
    gap: Spacing[3],
  },

  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    paddingVertical: Spacing[4],
    gap: Spacing[2],
    ...Shadows.sm,
  },

  filesCard: {
    padding: 0,
    overflow: "hidden",
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
  },

  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  fileContent: {
    flex: 1,
    gap: 2,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[4],
  },

  footerSpace: {
    height: Spacing[5],
  },

  addProjectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },
});
