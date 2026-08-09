import { StyleSheet } from "react-native";
import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[12],
  },

  header: {
    marginBottom: Spacing[6],
  },

  subtitle: {
    marginTop: Spacing[2],
  },

  projectCard: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDim,
  },

  icon: {
    color: Colors.primary,
  },

  status: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
  },

  title: {
    marginTop: Spacing[5],
    lineHeight: 26,
  },

  meta: {
    marginTop: Spacing[4],
    gap: Spacing[2],
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  metaIcon: {
    color: Colors.text.secondary,
  },

  progressSection: {
    marginTop: Spacing[5],
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  supervisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[5],
  },

  supervisorIcon: {
    color: Colors.accent,
  },

  section: {
    marginTop: Spacing[7],
  },

  sectionTitle: {
    marginBottom: Spacing[4],
  },

  actions: {
    flexDirection: "row",
    gap: Spacing[3],
  },

  actionCard: {
    flex: 1,
    minHeight: 92,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    ...Shadows.sm,
  },

  actionIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
  },

  actionIconGlyph: {
    color: Colors.primary,
  },

  abstractCard: {
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
  },

  infoIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },

  infoIconGlyph: {
    color: Colors.primary,
  },

  infoContent: {
    flex: 1,
    gap: Spacing[1],
  },
});
