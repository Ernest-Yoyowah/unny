import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Card } from "../../components/ui";

import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

import { MOCK_FINAL_YEAR_PROJECT } from "../../data/mock";

export const ProjectTimelineScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const project = MOCK_FINAL_YEAR_PROJECT;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing[4],
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          Timeline
        </AppText>

        <AppText variant="body2" color="secondary" style={styles.subtitle}>
          Track your project milestones and completion stages.
        </AppText>
      </View>

      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <AppText variant="body2" color="secondary">
              Overall Progress
            </AppText>

            <AppText variant="h4" weight="bold">
              {project.progress}%
            </AppText>
          </View>

          <View style={styles.progressIcon}>
            <Ionicons
              name="analytics-outline"
              size={24}
              color={Colors.primary}
            />
          </View>
        </View>

        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: `${project.progress}%`,
              },
            ]}
          />
        </View>
      </Card>

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold">
          Project Milestones
        </AppText>

        <View style={styles.timeline}>
          {project.milestones.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.left}>
                <View
                  style={[
                    styles.circle,
                    item.completed && styles.completedCircle,
                  ]}
                >
                  <Ionicons
                    name={item.completed ? "checkmark" : "ellipse-outline"}
                    size={14}
                    color={
                      item.completed ? Colors.surface : Colors.text.tertiary
                    }
                  />
                </View>

                {index !== project.milestones.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      item.completed && styles.completedLine,
                    ]}
                  />
                )}
              </View>

              <Card style={styles.milestoneCard}>
                <AppText variant="body2" weight="semibold">
                  {item.title}
                </AppText>

                <AppText
                  variant="caption"
                  color="secondary"
                  style={styles.statusText}
                >
                  {item.completed ? "Completed" : "Pending"}
                </AppText>
              </Card>
            </View>
          ))}
        </View>
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

  progressCard: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressIcon: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  track: {
    marginTop: Spacing[5],
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },

  section: {
    marginTop: Spacing[7],
  },

  timeline: {
    marginTop: Spacing[4],
  },

  timelineItem: {
    flexDirection: "row",
    minHeight: 90,
  },

  left: {
    width: 38,
    alignItems: "center",
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },

  completedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border.light,
    marginTop: 4,
  },

  completedLine: {
    backgroundColor: Colors.primary,
  },

  milestoneCard: {
    flex: 1,
    marginLeft: Spacing[3],
    padding: Spacing[4],
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  statusText: {
    marginTop: Spacing[1],
  },
});
