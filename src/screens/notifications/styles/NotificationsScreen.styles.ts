import { StyleSheet } from "react-native";
import { Spacing, Colors } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -Spacing[2],
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  list: {
    paddingBottom: Spacing[10],
  },
  sectionHeader: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[2],
  },
  sectionTitle: {
    letterSpacing: 1,
  },
  notifItem: {
    flexDirection: "row",
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface,
  },
  notifItemUnread: {
    backgroundColor: `${Colors.accent}06`,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifIconUnread: {
    backgroundColor: Colors.accentLight,
  },
  notifContent: {
    flex: 1,
    gap: 3,
  },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  notifTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    flexShrink: 0,
  },
  notifBody: {
    lineHeight: 18,
  },
  notifTime: {
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[5] + 40 + Spacing[3],
  },
});
