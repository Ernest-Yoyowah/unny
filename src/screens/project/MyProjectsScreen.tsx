import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Card, ProgressBar } from "../../components/ui";

import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

import { MainStackParamList } from "../../navigation/types";
import { MOCK_FINAL_YEAR_PROJECT } from "../../data/mock";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const MyProjectsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const project = MOCK_FINAL_YEAR_PROJECT;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing[4] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          My Project
        </AppText>

        <AppText variant="body2" color="secondary" style={styles.subtitle}>
          Manage your final year project documentation and progress.
        </AppText>
      </View>

      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.iconBox}>
            <Ionicons
              name="folder-open-outline"
              size={24}
              color={Colors.primary}
            />
          </View>

          <View style={styles.status}>
            <AppText variant="caption" color="accent" weight="semibold">
              {project.status}
            </AppText>
          </View>
        </View>

        <AppText variant="h5" weight="bold" style={styles.title}>
          {project.title}
        </AppText>

        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons
              name="school-outline"
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

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <AppText variant="caption" color="secondary">
              Completion
            </AppText>

            <AppText variant="caption" weight="semibold">
              {project.progress}%
            </AppText>
          </View>

          <ProgressBar value={project.progress} />
        </View>

        <View style={styles.supervisor}>
          <Ionicons name="person-outline" size={16} color={Colors.accent} />

          <AppText variant="body2">{project.supervisor.name}</AppText>
        </View>
      </Card>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate("ProjectDocuments", {
              projectId: project.id,
            })
          }
        >
          <Ionicons
            name="document-text-outline"
            size={22}
            color={Colors.primary}
          />

          <AppText variant="body2" weight="semibold">
            Documents
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate("ProjectTimeline", {
              projectId: project.id,
            })
          }
        >
          <Ionicons name="time-outline" size={22} color={Colors.primary} />

          <AppText variant="body2" weight="semibold">
            Timeline
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate("ProjectDetails", {
              projectId: project.id,
            })
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={Colors.primary}
          />

          <AppText variant="body2" weight="semibold">
            Details
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold">
          Project Overview
        </AppText>

        <Card style={styles.abstractCard}>
          <AppText variant="body2" color="secondary">
            {project.abstract}
          </AppText>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: BorderRadius.xl,
    padding: Spacing[5],
    ...Shadows.sm,
  },

  projectHeader: {
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

  progressSection: {
    marginTop: Spacing[5],
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  supervisor: {
    marginTop: Spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  actions: {
    flexDirection: "row",
    gap: Spacing[3],
    marginTop: Spacing[5],
  },

  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    gap: Spacing[2],
    ...Shadows.sm,
  },

  section: {
    marginTop: Spacing[7],
  },

  abstractCard: {
    marginTop: Spacing[3],
    padding: Spacing[4],
  },
});
