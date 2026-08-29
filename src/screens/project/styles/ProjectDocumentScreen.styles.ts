import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius } from "../../../theme";

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
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing[2],
  },
  content: {
    padding: Spacing[5],
    gap: Spacing[5],
    paddingBottom: Spacing[12],
  },
  docIcon: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  docTitleBlock: {
    gap: Spacing[2],
  },
  docTitle: {
    letterSpacing: -0.3,
  },
  docDesc: {
    lineHeight: 22,
  },
  metaCard: {
    gap: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  weekBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignSelf: "flex-start",
  },
  actions: {
    gap: Spacing[3],
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
    paddingTop: Spacing[20],
  },
});
