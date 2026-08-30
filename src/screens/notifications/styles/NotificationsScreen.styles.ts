import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    minHeight: 78,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  headerTitle: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  headerRight: {
    width: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  list: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[10],
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  sectionHeader: {
    paddingHorizontal: Spacing[1],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
  },

  sectionTitle: {
    letterSpacing: 0.8,
  },

  notifItem: {
    minHeight: 94,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    ...Shadows.sm,
  },

  notifItemUnread: {
    backgroundColor: Colors.primaryDim,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.10)",
  },

  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  notifIconUnread: {
    transform: [{ scale: 1.03 }],
  },

  notifContent: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  notifTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[2],
  },

  notifTitle: {
    flex: 1,
    minWidth: 0,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
    flexShrink: 0,
  },

  notifBody: {
    lineHeight: 19,
  },

  notifFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing[1],
  },

  notifTime: {
    lineHeight: 16,
  },

  itemDivider: {
    height: Spacing[2],
  },
});
