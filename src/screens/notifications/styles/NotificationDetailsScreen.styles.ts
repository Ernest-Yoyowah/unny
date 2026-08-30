import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    minHeight: 64,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
  },

  hero: {
    alignItems: "center",
  },

  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: BorderRadius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },

  typeLabel: {
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },

  title: {
    textAlign: "center",
    lineHeight: 34,
  },

  time: {
    marginTop: Spacing[2],
  },

  messageCard: {
    marginTop: Spacing[7],
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },

  message: {
    lineHeight: 26,
  },

  actionCard: {
    marginTop: Spacing[4],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDim,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  actionContent: {
    flex: 1,
    gap: 4,
  },

  bottomAction: {
    marginTop: Spacing[6],
  },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[6],
  },

  notFoundIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius["2xl"],
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },

  notFoundText: {
    textAlign: "center",
    marginTop: Spacing[2],
    lineHeight: 23,
  },
});
