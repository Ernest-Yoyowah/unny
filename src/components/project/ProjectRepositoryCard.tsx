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
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={styles.card}>
        {/* Top section */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="school-outline" size={24} color={Colors.primary} />
          </View>

          <View style={styles.status}>
            <AppText variant="caption" color="accent" weight="semibold">
              {project.status}
            </AppText>
          </View>
        </View>

        {/* Title */}
        <AppText
          variant="h5"
          weight="bold"
          style={styles.title}
          numberOfLines={2}
        >
          {project.title}
        </AppText>

        {/* Metadata */}
        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons
              name="business-outline"
              size={15}
              color={Colors.text.secondary}
            />

            <AppText variant="caption" color="secondary">
              {project.department}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={Colors.text.secondary}
            />

            <AppText variant="caption" color="secondary">
              {project.yearGroup}
            </AppText>
          </View>
        </View>

        {/* Student */}
        {project.student && (
          <View style={styles.personRow}>
            <Ionicons name="person-outline" size={16} color={Colors.accent} />

            <AppText variant="body2">{project.student}</AppText>
          </View>
        )}

        {project.supervisor && (
          <View style={styles.personRow}>
            <Ionicons
              name="person-circle-outline"
              size={16}
              color={Colors.accent}
            />

            <AppText variant="caption" color="secondary">
              Supervisor: {project.supervisor}
            </AppText>
          </View>
        )}

        <TouchableOpacity style={styles.footer} onPress={onPress}>
          <AppText variant="caption" color="accent" weight="semibold">
            View Project
          </AppText>

          <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBox: {
    width: 48,
    height: 48,

    borderRadius: BorderRadius.lg,

    backgroundColor: Colors.primaryDim,

    justifyContent: "center",
    alignItems: "center",
  },

  status: {
    backgroundColor: Colors.accentLight,

    paddingHorizontal: Spacing[3],

    paddingVertical: Spacing[1],

    borderRadius: BorderRadius.full,
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

  personRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: Spacing[2],

    marginTop: Spacing[4],
  },

  footer: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: Spacing[5],

    paddingTop: Spacing[4],

    borderTopWidth: 1,

    borderTopColor: Colors.border.light,
  },
});
