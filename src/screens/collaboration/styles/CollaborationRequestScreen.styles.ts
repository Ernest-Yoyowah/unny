import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "../../../theme";

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
    paddingTop: Spacing[7],
  },

  hero: {
    alignItems: "center",
  },

  heroIcon: {
    width: 82,
    height: 82,
    borderRadius: BorderRadius["2xl"],
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },

  eyebrow: {
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },

  heading: {
    textAlign: "center",
    lineHeight: 35,
  },

  intro: {
    textAlign: "center",
    lineHeight: 25,
    marginTop: Spacing[3],
  },

  projectCard: {
    marginTop: Spacing[7],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },

  projectLabelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  projectLabel: {
    flex: 1,
    minWidth: 0,
    gap: Spacing[1],
  },

  infoCard: {
    marginTop: Spacing[4],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accentLight,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
    gap: Spacing[1],
  },

  infoText: {
    lineHeight: 20,
  },

  actions: {
    marginTop: Spacing[7],
    gap: Spacing[3],
  },

  rejectButton: {
    minHeight: 52,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },

  rejectText: {
    color: Colors.status.error,
  },
});
