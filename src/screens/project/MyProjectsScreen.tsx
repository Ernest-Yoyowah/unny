import React from "react";
import { FlatList, TouchableOpacity, View, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AppText,
  Card,
  ProgressBar,
  ScreenSkeleton,
  EmptyState,
} from "../../components/ui";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { useMyProjects } from "../../hooks/useProject";
import { styles } from "./MyProjectsScreen.styles";
import { getProjectProgress } from "../../utils/project-progress";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const MyProjectsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const { data: projects, isLoading } = useMyProjects();

  if (isLoading) {
    return <ScreenSkeleton />;
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon="rocket-outline"
        title="Start your project archive"
        description="Create a project workspace to manage your report, repository, and review status in one place."
        action={{
          label: "Add Project",
          onPress: () => navigation.navigate("AddProject"),
        }}
      />
    );
  }

  const renderProject = ({
    item: project,
  }: {
    item: (typeof projects)[number];
  }) => {
    const firstDocument = project.documents?.[0];

    return (
      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.iconBox}>
            <Ionicons
              name="folder-open-outline"
              size={21}
              color={styles.icon.color}
            />
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

        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <View style={styles.metaIconBox}>
              <Ionicons
                name="school-outline"
                size={14}
                color={styles.metaIcon.color}
              />
            </View>

            <AppText
              variant="caption"
              color="secondary"
              numberOfLines={1}
              style={styles.metaText}
            >
              {project.department || "Department unavailable"}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaIconBox}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={styles.metaIcon.color}
              />
            </View>

            <AppText
              variant="caption"
              color="secondary"
              numberOfLines={1}
              style={styles.metaText}
            >
              {project.academicYear || "Year unavailable"}
            </AppText>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <AppText variant="caption" color="secondary">
              Completion
            </AppText>

            <AppText variant="caption" weight="semibold">
              {getProjectProgress(project)}%
            </AppText>
          </View>

          <ProgressBar value={getProjectProgress(project)} />
        </View>

        <View style={styles.supervisor}>
          <View style={styles.supervisorIconBox}>
            <Ionicons
              name="person-outline"
              size={14}
              color={styles.supervisorIcon.color}
            />
          </View>

          <View style={styles.supervisorContent}>
            <AppText variant="caption" color="tertiary">
              Supervisor
            </AppText>

            <AppText
              variant="body2"
              weight="medium"
              numberOfLines={1}
              style={styles.supervisorName}
            >
              {project.supervisor?.fullName ??
                project.supervisor?.name ??
                "Supervisor unavailable"}
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              firstDocument
                ? navigation.navigate("DocumentViewer", {
                    documentId: firstDocument.id,
                    projectId: project.id,
                    title:
                      firstDocument.name ??
                      firstDocument.title ??
                      "Project document",
                  })
                : navigation.navigate("ProjectDetails", {
                    projectId: project.id,
                  })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-text-outline"
                size={19}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionLabel}
            >
              Documents
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("ProjectTimeline", {
                projectId: project.id,
              })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="time-outline"
                size={19}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionLabel}
            >
              Timeline
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("ProjectDetails", {
                projectId: project.id,
              })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionLabel}
            >
              Details
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.abstractSection}>
          <View style={styles.abstractHeader}>
            <AppText variant="caption" color="secondary" weight="semibold">
              Abstract
            </AppText>

            <Ionicons
              name="document-text-outline"
              size={14}
              color={styles.abstractIcon.color}
            />
          </View>

          <AppText
            variant="body2"
            color="secondary"
            numberOfLines={4}
            style={styles.abstractText}
          >
            {project.abstract || "No abstract provided."}
          </AppText>
        </View>
      </Card>
    );
  };

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
        <View style={styles.headerLeft}>
          <AppText style={styles.headerEyebrow}>PROJECT WORKSPACE</AppText>

          <AppText style={styles.headerTitle} numberOfLines={1}>
            My Projects
          </AppText>

          <AppText style={styles.headerSubtitle} numberOfLines={2}>
            Manage your final year projects and progress.
          </AppText>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.headerCount}>
            <AppText style={styles.headerCountNumber}>
              {projects.length}
            </AppText>

            <AppText style={styles.headerCountLabel}>
              {projects.length === 1 ? "Project" : "Projects"}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderProject}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => (
            <View style={styles.projectSeparator} />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.listHeaderText}>
                <AppText variant="h5" weight="semibold">
                  Your Projects
                </AppText>

                <AppText variant="caption" color="secondary">
                  Keep track of your project workspace and progress.
                </AppText>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.addProjectButton}
                onPress={() => navigation.navigate("AddProject")}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={styles.addProjectIcon.color}
                />

                <AppText variant="caption" color="accent" weight="semibold">
                  Add Project
                </AppText>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </View>
  );
};
