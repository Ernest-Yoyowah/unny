import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../../theme";

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },

  headerContent: {
    gap: Spacing[1],
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.65)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: Typography.size.sm,
    marginTop: Spacing[1],
    lineHeight: 20,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
  },

  content: {
    paddingTop: Spacing[5],
    paddingBottom: Spacing[10],
  },

  infoCard: {
    marginHorizontal: Spacing[5],
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDim,
    flexDirection: "row",
    gap: Spacing[3],
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    gap: Spacing[1],
  },

  section: {
    marginTop: Spacing[7],
    paddingHorizontal: Spacing[5],
  },

  sectionTitle: {
    marginBottom: Spacing[4],
  },

  formCard: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  field: {
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[4],
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
  },

  textArea: {
    minHeight: 130,
    paddingTop: Spacing[3],
  },

  fieldHint: {
    marginBottom: Spacing[4],
  },

  selectField: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  selectIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  selectContent: {
    flex: 1,
    gap: 2,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
  },

  newTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[4],
  },

  newTagInput: {
    flex: 1,
  },

  tag: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },

  tagSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  tagSelectedText: {
    color: Colors.text.inverse,
  },

  uploadBox: {
    minHeight: 190,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing[5],
    gap: Spacing[2],
  },

  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[2],
  },

  uploadButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    marginTop: Spacing[2],
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing[5],
  },

  submitButton: {
    marginHorizontal: Spacing[5],
    marginTop: Spacing[7],
    minHeight: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    ...Shadows.md,
  },

  submitNote: {
    textAlign: "center",
    marginHorizontal: Spacing[8],
    marginTop: Spacing[3],
  },

  footerSpace: {
    height: Spacing[5],
  },
});
