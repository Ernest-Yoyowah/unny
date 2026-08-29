import React from "react";
import { FlatList, StatusBar, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppText,
  Card,
  EmptyState,
  ProgressBar,
  ScreenSkeleton,
} from "../../components/ui";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { useMyProjects } from "../../hooks/useProject";
import { getProjectProgress } from "../../utils/project-progress";
import { styles } from "./styles/MyProjectsScreen.styles";

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
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

        <View
          style={[
            styles.emptyHeader,
            {
              paddingTop: insets.top + Spacing[4],
            },
          ]}
        >
          <AppText style={styles.headerEyebrow}>PROJECT WORKSPACE</AppText>

          <AppText style={styles.headerTitle}>My Projects</AppText>

          <AppText style={styles.headerSubtitle}>
            Keep your final year project organised from one workspace.
          </AppText>
        </View>

        <View style={styles.emptyContent}>
          <EmptyState
            icon="rocket-outline"
            title="Start your project workspace"
            description="Create your first project to manage documents, supervision, communication, and progress in one place."
            action={{
              label: "Create project",
              onPress: () => navigation.navigate("AddProject"),
            }}
          />
        </View>
      </View>
    );
  }

  const renderProject = ({
    item: project,
  }: {
    item: (typeof projects)[number];
  }) => {
    const firstDocument = project.documents?.[0];
    const progress = getProjectProgress(project);
    const supervisor =
      project.supervisor?.fullName ??
      project.supervisor?.name ??
      "Not assigned";

    const openDetails = () => {
      navigation.navigate("ProjectDetails", {
        projectId: project.id,
      });
    };

    const openDocuments = () => {
      if (firstDocument) {
        navigation.navigate("DocumentViewer", {
          documentId: firstDocument.id,
          projectId: project.id,
          title:
            firstDocument.name ?? firstDocument.title ?? "Project document",
        });
        return;
      }

      openDetails();
    };

    return (
      <Card style={styles.projectCard}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={openDetails}
          style={styles.projectMain}
          accessibilityRole="button"
          accessibilityLabel={`Open project ${project.title}`}
        >
          <View style={styles.projectHeader}>
            <View style={styles.projectIdentity}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="folder-open-outline"
                  size={21}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.projectHeaderText}>
                <AppText style={styles.projectEyebrow}>
                  FINAL YEAR PROJECT
                </AppText>

                <View style={styles.status}>
                  <View style={styles.statusDot} />

                  <AppText
                    variant="caption"
                    color="accent"
                    weight="semibold"
                    numberOfLines={1}
                  >
                    {project.status || "In progress"}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.chevronButton}>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={Colors.text.secondary}
              />
            </View>
          </View>

          <View style={styles.titleSection}>
            <AppText
              variant="h5"
              weight="bold"
              style={styles.title}
              numberOfLines={2}
              ellipsizeMode="tail"
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
                  color={Colors.text.secondary}
                />
              </View>

              <View style={styles.metaContent}>
                <AppText variant="caption" color="tertiary" numberOfLines={1}>
                  Department
                </AppText>

                <AppText
                  variant="caption"
                  color="secondary"
                  weight="medium"
                  numberOfLines={1}
                  style={styles.metaText}
                >
                  {project.department || "Department unavailable"}
                </AppText>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaIconBox}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.text.secondary}
                />
              </View>

              <View style={styles.metaContent}>
                <AppText variant="caption" color="tertiary" numberOfLines={1}>
                  Academic year
                </AppText>

                <AppText
                  variant="caption"
                  color="secondary"
                  weight="medium"
                  numberOfLines={1}
                  style={styles.metaText}
                >
                  {project.academicYear || "Year unavailable"}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelRow}>
                <Ionicons
                  name="trending-up-outline"
                  size={15}
                  color={Colors.primary}
                />

                <AppText variant="caption" color="secondary" numberOfLines={1}>
                  Project completion
                </AppText>
              </View>

              <AppText
                variant="caption"
                weight="bold"
                style={styles.progressValue}
              >
                {progress}%
              </AppText>
            </View>

            <ProgressBar value={progress} />
          </View>

          <View style={styles.supervisor}>
            <View style={styles.supervisorIconBox}>
              <Ionicons name="person-outline" size={14} color={Colors.accent} />
            </View>

            <View style={styles.supervisorContent}>
              <AppText variant="caption" color="tertiary">
                Supervisor
              </AppText>

              <AppText
                variant="body2"
                weight="medium"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.supervisorName}
              >
                {supervisor}
              </AppText>
            </View>

            {!project.supervisor && (
              <View style={styles.supervisorStatus}>
                <AppText
                  variant="caption"
                  color="accent"
                  weight="semibold"
                  numberOfLines={1}
                >
                  Needed
                </AppText>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={openDocuments}
            accessibilityRole="button"
            accessibilityLabel={`Open documents for ${project.title}`}
          >
            <View style={[styles.actionIcon, styles.actionIconPrimary]}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={Colors.primary}
              />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionTitle}
            >
              Documents
            </AppText>

            <AppText
              variant="caption"
              color="tertiary"
              numberOfLines={1}
              style={styles.actionSubtitle}
            >
              {project.documents?.length ?? 0}{" "}
              {project.documents?.length === 1 ? "file" : "files"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ProjectTimeline", {
                projectId: project.id,
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Open timeline for ${project.title}`}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionTitle}
            >
              Timeline
            </AppText>

            <AppText
              variant="caption"
              color="tertiary"
              numberOfLines={1}
              style={styles.actionSubtitle}
            >
              Activity
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={openDetails}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${project.title}`}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={Colors.primary}
              />
            </View>

            <AppText
              variant="caption"
              weight="semibold"
              numberOfLines={1}
              style={styles.actionTitle}
            >
              Details
            </AppText>

            <AppText
              variant="caption"
              color="tertiary"
              numberOfLines={1}
              style={styles.actionSubtitle}
            >
              Overview
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.abstractSection}>
          <View style={styles.abstractHeader}>
            <View style={styles.abstractTitleRow}>
              <View style={styles.abstractIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color={Colors.text.secondary}
                />
              </View>

              <AppText
                variant="caption"
                color="secondary"
                weight="semibold"
                numberOfLines={1}
              >
                Abstract
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={openDetails}
              accessibilityRole="button"
              accessibilityLabel={`Read project details for ${project.title}`}
            >
              <AppText variant="caption" color="accent" weight="semibold">
                View
              </AppText>
            </TouchableOpacity>
          </View>

          <AppText
            variant="body2"
            color="secondary"
            numberOfLines={3}
            ellipsizeMode="tail"
            style={styles.abstractText}
          >
            {project.abstract || "No abstract provided yet."}
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
            Everything you need to manage your final year project.
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
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + Spacing[8],
            },
          ]}
          ItemSeparatorComponent={() => (
            <View style={styles.projectSeparator} />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.listHeaderText}>
                <View style={styles.listHeaderTitleRow}>
                  <View style={styles.listHeaderIndicator} />

                  <AppText variant="h5" weight="semibold" numberOfLines={1}>
                    Your projects
                  </AppText>
                </View>

                <AppText variant="caption" color="secondary" numberOfLines={2}>
                  Select a project to manage its workspace.
                </AppText>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addProjectButton}
                onPress={() => navigation.navigate("AddProject")}
                accessibilityRole="button"
                accessibilityLabel="Create a new project"
              >
                <View style={styles.addProjectIcon}>
                  <Ionicons name="add" size={18} color={Colors.text.inverse} />
                </View>

                <AppText
                  variant="caption"
                  color="inverse"
                  weight="semibold"
                  numberOfLines={1}
                >
                  New project
                </AppText>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </View>
  );
};
