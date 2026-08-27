import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText, Card } from "../ui";

import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

type RepositoryProject = {
  id: string;
  title: string;
  department: string;
  yearGroup: string;
  status: string;
  student?: string;
  supervisor?: string;
};

type Props = {
  project: RepositoryProject;
  onPress: () => void;
};

export const ProjectRepositoryCard: React.FC<Props> = ({
  project,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${project.title}, ${project.department}`}
    >
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.iconBox}>
            <Ionicons name="school-outline" size={22} color={Colors.primary} />
          </View>

          <View style={styles.status}>
            <AppText
              variant="caption"
              color="accent"
              weight="semibold"
              numberOfLines={1}
            >
              {project.status}
            </AppText>
          </View>
        </View>

        <View style={styles.titleSection}>
          <AppText
            variant="h5"
            weight="bold"
            style={styles.title}
            numberOfLines={3}
          >
            {project.title}
          </AppText>
        </View>

        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <View style={styles.metadataIcon}>
              <Ionicons
                name="business-outline"
                size={14}
                color={Colors.text.secondary}
              />
            </View>

            <AppText
              variant="caption"
              color="secondary"
              numberOfLines={1}
              style={styles.metadataText}
            >
              {project.department}
            </AppText>
          </View>

          <View style={styles.metadataItem}>
            <View style={styles.metadataIcon}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={Colors.text.secondary}
              />
            </View>

            <AppText
              variant="caption"
              color="secondary"
              numberOfLines={1}
              style={styles.metadataText}
            >
              {project.yearGroup}
            </AppText>
          </View>
        </View>

        {(project.student || project.supervisor) && (
          <View style={styles.peopleSection}>
            {project.student && (
              <View style={styles.personRow}>
                <View style={styles.personIcon}>
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={Colors.accent}
                  />
                </View>

                <View style={styles.personContent}>
                  <AppText variant="caption" color="tertiary" numberOfLines={1}>
                    Student
                  </AppText>

                  <AppText
                    variant="body2"
                    weight="medium"
                    numberOfLines={1}
                    style={styles.personName}
                  >
                    {project.student}
                  </AppText>
                </View>
              </View>
            )}

            {project.supervisor && (
              <View style={styles.personRow}>
                <View style={styles.personIcon}>
                  <Ionicons
                    name="person-circle-outline"
                    size={15}
                    color={Colors.accent}
                  />
                </View>

                <View style={styles.personContent}>
                  <AppText variant="caption" color="tertiary" numberOfLines={1}>
                    Supervisor
                  </AppText>

                  <AppText
                    variant="body2"
                    weight="medium"
                    numberOfLines={1}
                    style={styles.personName}
                  >
                    {project.supervisor}
                  </AppText>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <AppText variant="caption" color="accent" weight="semibold">
            View Project
          </AppText>

          <View style={styles.footerIcon}>
            <Ionicons name="arrow-forward" size={15} color={Colors.accent} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: Spacing[4],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  status: {
    maxWidth: "55%",
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    flexShrink: 1,
  },

  titleSection: {
    marginTop: Spacing[4],
    minWidth: 0,
  },

  title: {
    lineHeight: 25,
  },

  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing[3],
    marginTop: Spacing[4],
  },

  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    gap: Spacing[2],
  },

  metadataIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  metadataText: {
    flexShrink: 1,
  },

  peopleSection: {
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing[3],
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
    gap: Spacing[2],
  },

  personIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  personContent: {
    flex: 1,
    minWidth: 0,
  },

  personName: {
    marginTop: 1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginTop: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  footerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
