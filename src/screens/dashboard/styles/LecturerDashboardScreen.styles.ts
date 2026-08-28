import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing[10],
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[5],
  },
  headerLeft: {
    gap: 2,
    flex: 1,
  },
  headerName: {
    marginTop: 2,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  statCard: {
    flex: 1,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statIconRow: {
    marginBottom: Spacing[1],
  },
  quickActions: {
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[5],
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    alignItems: "center",
    gap: Spacing[2],
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: Spacing[7],
    paddingHorizontal: Spacing[5],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  courseList: {
    gap: Spacing[3],
  },
  uploadsCard: {
    padding: 0,
    overflow: "hidden",
  },
  uploadItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
  },
  uploadIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  uploadContent: {
    flex: 1,
    gap: 3,
  },
  uploadMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border.strong,
  },
  uploadDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[4] + 38 + Spacing[3],
  },
  sectionFooter: {
    height: Spacing[4],
  },
});
