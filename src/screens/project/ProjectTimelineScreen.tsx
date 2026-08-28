import React from "react";
import { View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "../../theme";
import { useProject } from "../../hooks/useProject";
import { MainStackParamList } from "../../navigation/types";
import {
  getProjectMilestones,
  getProjectProgress,
} from "../../utils/project-progress";
import { styles } from "./styles/ProjectTimelineScreen.styles";

type Props = NativeStackScreenProps<MainStackParamList, "ProjectTimeline">;

export const ProjectTimelineScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useProject(route.params.projectId);

  if (isLoading) {
    return <ScreenSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="cloud-offline-outline"
        title="Timeline unavailable"
        description="We couldn't load the progress for this project. Check your connection and try again."
        action={{
          label: "Try again",
          onPress: () => refetch(),
        }}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        icon="folder-open-outline"
        title="Project not found"
        description="This project may have been removed or is no longer available."
      />
    );
  }

  const progress = getProjectProgress(project);
  const milestones = getProjectMilestones(project);

  const completedCount = milestones.filter((item) => item.completed).length;
  const remainingCount = Math.max(milestones.length - completedCount, 0);

  const currentMilestoneIndex = milestones.findIndex((item) => !item.completed);

  const currentMilestone =
    currentMilestoneIndex >= 0
      ? milestones[currentMilestoneIndex]
      : milestones[milestones.length - 1];

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
        translucent={false}
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing[3],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={21} color={Colors.text.inverse} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <AppText style={styles.headerEyebrow}>PROJECT WORKSPACE</AppText>

            <AppText style={styles.headerTitle} numberOfLines={1}>
              Timeline
            </AppText>

            <AppText style={styles.headerSubtitle} numberOfLines={2}>
              Track milestones and see how your project is progressing.
            </AppText>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="time-outline"
              size={23}
              color={Colors.text.inverse}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.projectCard}>
          <View style={styles.projectIdentity}>
            <View style={styles.projectIcon}>
              <Ionicons
                name="rocket-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View style={styles.projectIdentityContent}>
              <AppText
                variant="caption"
                color="tertiary"
                weight="semibold"
                style={styles.projectEyebrow}
              >
                CURRENT PROJECT
              </AppText>

              <AppText
                variant="body2"
                weight="bold"
                numberOfLines={2}
                style={styles.projectName}
              >
                {project.title}
              </AppText>
            </View>

            <View style={styles.statusBadge}>
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
        </Card>

        <View style={styles.progressSection}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionHeadingText}>
              <AppText variant="h5" weight="semibold">
                Overall progress
              </AppText>

              <AppText variant="caption" color="secondary">
                {completedCount} of {milestones.length} milestones completed
              </AppText>
            </View>

            <View style={styles.progressPercentage}>
              <AppText
                variant="h4"
                weight="bold"
                style={styles.progressPercentageText}
              >
                {progress}%
              </AppText>
            </View>
          </View>

          <Card style={styles.progressCard}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.progressMeta}>
              <View style={styles.progressMetaItem}>
                <View style={styles.progressDot} />

                <AppText variant="caption" color="secondary">
                  Completed
                </AppText>
              </View>

              <AppText variant="caption" color="tertiary">
                {remainingCount === 0
                  ? "Project milestones complete"
                  : `${remainingCount} ${
                      remainingCount === 1 ? "milestone" : "milestones"
                    } remaining`}
              </AppText>
            </View>
          </Card>
        </View>

        {currentMilestone && (
          <View style={styles.nextSection}>
            <AppText variant="h5" weight="semibold">
              {completedCount === milestones.length
                ? "Project complete"
                : "Current milestone"}
            </AppText>

            <Card style={styles.currentCard}>
              <View style={styles.currentIcon}>
                <Ionicons
                  name={
                    completedCount === milestones.length
                      ? "checkmark-circle-outline"
                      : "flag-outline"
                  }
                  size={22}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.currentContent}>
                <AppText variant="body2" weight="semibold" numberOfLines={2}>
                  {currentMilestone.title}
                </AppText>

                <AppText
                  variant="caption"
                  color="secondary"
                  style={styles.currentDescription}
                >
                  {completedCount === milestones.length
                    ? "All project milestones have been completed."
                    : "This is the next stage in your project journey."}
                </AppText>
              </View>

              <View
                style={[
                  styles.currentStatus,
                  completedCount === milestones.length &&
                    styles.currentStatusComplete,
                ]}
              >
                <Ionicons
                  name={
                    completedCount === milestones.length
                      ? "checkmark"
                      : "arrow-forward"
                  }
                  size={15}
                  color={Colors.primary}
                />
              </View>
            </Card>
          </View>
        )}

        <View style={styles.timelineSection}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionHeadingText}>
              <AppText variant="h5" weight="semibold">
                Project milestones
              </AppText>

              <AppText variant="caption" color="secondary">
                Your project journey from start to completion
              </AppText>
            </View>
          </View>

          <View style={styles.timeline}>
            {milestones.map((item, index) => {
              const isLast = index === milestones.length - 1;
              const isCurrent =
                !item.completed && index === currentMilestoneIndex;

              return (
                <View
                  key={`${item.title}-${index}`}
                  style={styles.timelineItem}
                >
                  <View style={styles.timelineRail}>
                    <View
                      style={[
                        styles.timelineNode,
                        item.completed && styles.timelineNodeCompleted,
                        isCurrent && styles.timelineNodeCurrent,
                      ]}
                    >
                      <Ionicons
                        name={
                          item.completed
                            ? "checkmark"
                            : isCurrent
                              ? "ellipse"
                              : "ellipse-outline"
                        }
                        size={item.completed ? 15 : isCurrent ? 10 : 13}
                        color={
                          item.completed
                            ? Colors.surface
                            : isCurrent
                              ? Colors.primary
                              : Colors.text.tertiary
                        }
                      />
                    </View>

                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          item.completed && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  <Card
                    style={[
                      styles.milestoneCard,
                      isCurrent && styles.milestoneCardCurrent,
                    ]}
                  >
                    <View style={styles.milestoneTop}>
                      <View style={styles.milestoneTitleWrap}>
                        <AppText
                          variant="body2"
                          weight="semibold"
                          numberOfLines={2}
                          style={styles.milestoneTitle}
                        >
                          {item.title}
                        </AppText>

                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <AppText
                              variant="caption"
                              weight="semibold"
                              style={styles.currentBadgeText}
                            >
                              CURRENT
                            </AppText>
                          </View>
                        )}
                      </View>

                      <View
                        style={[
                          styles.milestoneStatus,
                          item.completed
                            ? styles.completedStatus
                            : isCurrent
                              ? styles.currentMilestoneStatus
                              : styles.pendingStatus,
                        ]}
                      >
                        <Ionicons
                          name={
                            item.completed
                              ? "checkmark-circle"
                              : isCurrent
                                ? "time-outline"
                                : "ellipse-outline"
                          }
                          size={14}
                          color={
                            item.completed
                              ? Colors.status.success
                              : isCurrent
                                ? Colors.primary
                                : Colors.text.tertiary
                          }
                        />

                        <AppText
                          variant="caption"
                          weight="semibold"
                          style={[
                            styles.milestoneStatusText,
                            item.completed && styles.completedStatusText,
                            isCurrent && styles.currentStatusText,
                          ]}
                        >
                          {item.completed
                            ? "Completed"
                            : isCurrent
                              ? "In progress"
                              : "Pending"}
                        </AppText>
                      </View>
                    </View>

                    <AppText
                      variant="caption"
                      color="secondary"
                      style={styles.milestoneHint}
                    >
                      {item.completed
                        ? "Milestone completed"
                        : isCurrent
                          ? "Your next project stage"
                          : "Waiting to be completed"}
                    </AppText>
                  </Card>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
