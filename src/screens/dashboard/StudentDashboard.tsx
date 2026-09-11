import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  AppText,
  Avatar,
  Card,
  SectionCard,
  ScreenSkeleton,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import { useMyProjects } from "../../hooks/useProject";
import { useNotifications } from "../../hooks/useNotifications";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { getProjectStatusPresentation } from "../../api/services/project.service";
import { styles } from "./styles/StudentDashboardScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const StudentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const user = useAuthStore((state) => state.user);
  const {
    data: projects,
    isLoading: isProjectsLoading,
    isFetching: isProjectsFetching,
    refetch: refetchProjects,
  } = useMyProjects();
  const {
    data: notificationPage,
    refetch: refetchNotifications,
    isFetching: isNotificationsFetching,
  } = useNotifications();

  const project = projects?.[0];

  const unreadCount =
    notificationPage?.data.filter((item) => !item.isRead).length ?? 0;

  if (!user || isProjectsLoading) {
    return <ScreenSkeleton />;
  }

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  })();

  const firstName = user.fullName?.trim().split(/\s+/)[0] || "Student";

  const documents = project?.documents ?? [];
  const handleRefresh = async () => {
    await Promise.all([refetchProjects(), refetchNotifications()]);
  };

  const openDocuments = () => {
    const firstDocument = documents[0];

    if (firstDocument && project) {
      navigation.navigate("DocumentViewer", {
        documentId: firstDocument.id,
        projectId: project.id,
        title: firstDocument.name ?? firstDocument.title ?? "Project document",
      });

      return;
    }

    if (project) {
      navigation.navigate("ProjectDetails", {
        projectId: project.id,
      });
    }
  };

  const renderHeader = () => (
    <>
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
          <AppText style={styles.greetingText}>{greeting}</AppText>

          <AppText style={styles.headerName} numberOfLines={1}>
            {firstName}
          </AppText>

          <View style={styles.orgRow}>
            <Ionicons
              name="school-outline"
              size={13}
              color="rgba(255,255,255,0.58)"
            />

            <AppText style={styles.orgName} numberOfLines={1}>
              Ghana Communication Technology University
            </AppText>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => handleRefresh()}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Refresh dashboard"
          >
            <Ionicons
              name={
                isProjectsFetching || isNotificationsFetching
                  ? "sync-outline"
                  : "refresh-outline"
              }
              size={20}
              color={Colors.text.inverse}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={Colors.text.inverse}
            />

            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <AppText style={styles.notifBadgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <Avatar name={user.fullName} uri={user.avatarUrl} size="md" />
        </View>
      </View>
    </>
  );

  const renderEmptyStats = () => (
    <View style={styles.emptyStatsGrid}>
      <View style={styles.emptyStatCard}>
        <View style={styles.emptyStatIcon}>
          <Ionicons
            name="folder-outline"
            size={19}
            color={Colors.text.tertiary}
          />
        </View>

        <AppText style={styles.emptyStatNumber}>—</AppText>

        <AppText style={styles.emptyStatLabel}>Status</AppText>
      </View>

      <View style={styles.emptyStatCard}>
        <View style={styles.emptyStatIcon}>
          <Ionicons
            name="notifications-outline"
            size={19}
            color={Colors.text.tertiary}
          />
        </View>

        <AppText style={styles.emptyStatNumber}>{unreadCount}</AppText>

        <AppText style={styles.emptyStatLabel}>Unread</AppText>
      </View>

      <View style={styles.emptyStatCard}>
        <View style={styles.emptyStatIcon}>
          <Ionicons
            name="checkmark-circle-outline"
            size={19}
            color={Colors.text.tertiary}
          />
        </View>

        <AppText style={styles.emptyStatNumber}>—</AppText>

        <AppText style={styles.emptyStatLabel}>Progress</AppText>
      </View>
    </View>
  );

  const renderEmptyProject = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateHeader}>
        <AppText
          variant="overline"
          color="tertiary"
          style={styles.emptyStateOverline}
        >
          PROJECT WORKSPACE
        </AppText>

        <AppText variant="h2" weight="bold" style={styles.emptyStateTitle}>
          Set up your project
        </AppText>

        <AppText
          variant="body1"
          color="secondary"
          style={styles.emptyStateDescription}
        >
          Create your final year project to manage your academic work,
          documents, milestones, and supervisor reviews in one place.
        </AppText>
      </View>

      <Card style={styles.createProjectCard}>
        <View style={styles.createProjectTop}>
          <View style={styles.createProjectIcon}>
            <Ionicons
              name="folder-open-outline"
              size={25}
              color={Colors.primary}
            />
          </View>

          <View style={styles.createProjectHeading}>
            <AppText variant="body1" weight="semibold">
              Create a project workspace
            </AppText>

            <AppText variant="caption" color="secondary">
              Add your project details to get started.
            </AppText>
          </View>
        </View>

        <View style={styles.createProjectDivider} />

        <View style={styles.createProjectDetails}>
          <View style={styles.createProjectDetail}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color={Colors.text.secondary}
              />
            </View>

            <AppText variant="caption" color="secondary">
              Manage project documents
            </AppText>
          </View>

          <View style={styles.createProjectDetail}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.text.secondary}
              />
            </View>

            <AppText variant="caption" color="secondary">
              Track milestones and progress
            </AppText>
          </View>

          <View style={styles.createProjectDetail}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="person-outline"
                size={16}
                color={Colors.text.secondary}
              />
            </View>

            <AppText variant="caption" color="secondary">
              Keep supervisor activity organized
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createProjectButton}
          onPress={() => navigation.navigate("AddProject")}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel="Create project"
        >
          <AppText style={styles.createProjectButtonText} weight="bold">
            Create project
          </AppText>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={Colors.text.inverse}
          />
        </TouchableOpacity>
      </Card>

      <View style={styles.emptyStateFooter}>
        <View style={styles.emptyStateFooterIcon}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color={Colors.text.tertiary}
          />
        </View>

        <View style={styles.emptyStateFooterContent}>
          <AppText variant="caption" weight="semibold">
            Your workspace is private to you.
          </AppText>

          <AppText variant="caption" color="secondary">
            Project information and documents are managed securely within your
            academic workspace.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderStats = () => {
    if (!project) {
      return renderEmptyStats();
    }

    const statusPresentation = getProjectStatusPresentation(project.status);
    const progressValue = Math.max(0, Math.min(100, project.progress ?? 0));
    const progressColor =
      progressValue >= 100 ? Colors.status.success : Colors.primary;

    return (
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.statIconPrimary]}>
            <Ionicons
              name="folder-open-outline"
              size={17}
              color={Colors.primary}
            />
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusPresentation.badgeBackground },
            ]}
          >
            <AppText
              style={[
                styles.statusBadgeText,
                { color: statusPresentation.textColor },
              ]}
              numberOfLines={1}
            >
              {statusPresentation.label}
            </AppText>
          </View>

          <AppText style={styles.statLbl}>Status</AppText>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.statIconWarning]}>
            <Ionicons
              name="notifications-outline"
              size={17}
              color={Colors.status.warning}
            />
          </View>

          <AppText style={styles.statNum}>{unreadCount}</AppText>

          <AppText style={styles.statLbl}>Unread</AppText>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.statIconSuccess]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={17}
              color={Colors.status.success}
            />
          </View>

          <AppText style={[styles.statNum, { color: progressColor }]}>
            {progressValue}%
          </AppText>

          <AppText style={styles.statLbl}>Progress</AppText>
        </View>
      </View>
    );
  };

  const renderProjectDashboard = () => {
    if (!project) {
      return renderEmptyProject();
    }

    const statusPresentation = getProjectStatusPresentation(project.status);
    const statusMeta = {
      label: statusPresentation.label,
      icon:
        statusPresentation.label === "Approved"
          ? "checkmark-circle-outline"
          : statusPresentation.label === "Rejected"
            ? "close-circle-outline"
            : statusPresentation.label === "Changes Requested"
              ? "create-outline"
              : statusPresentation.label === "Pending Review"
                ? "time-outline"
                : statusPresentation.label === "Draft"
                  ? "pencil-outline"
                  : "folder-open-outline",
      color: statusPresentation.textColor,
      background: statusPresentation.badgeBackground,
      dot: statusPresentation.dotColor,
    };

    const supervisorName =
      project.supervisor?.fullName ??
      project.supervisor?.name ??
      "Not assigned yet";

    return (
      <>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <AppText variant="h5" weight="semibold">
                Your project
              </AppText>

              <AppText variant="caption" color="secondary">
                Keep your final year work moving forward.
              </AppText>
            </View>

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() =>
                navigation.navigate("ProjectDetails", {
                  projectId: project.id,
                })
              }
              activeOpacity={0.7}
            >
              <AppText variant="caption" color="accent" weight="semibold">
                View
              </AppText>

              <Ionicons
                name="chevron-forward"
                size={15}
                color={Colors.accent}
              />
            </TouchableOpacity>
          </View>

          <Card style={styles.projectHero}>
            <View style={styles.projectHeroTop}>
              <View style={styles.projectIdentity}>
                <View style={styles.projectIcon}>
                  <Ionicons
                    name="rocket-outline"
                    size={22}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.projectIdentityText}>
                  <AppText variant="caption" color="tertiary" weight="semibold">
                    FINAL YEAR PROJECT
                  </AppText>

                  <AppText
                    variant="caption"
                    color="secondary"
                    numberOfLines={1}
                    style={styles.projectDepartment}
                  >
                    {project.department || "Department unavailable"}
                  </AppText>
                </View>
              </View>

              <View
                style={[
                  styles.projectStatus,
                  {
                    backgroundColor: statusMeta.background,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: statusMeta.dot,
                    },
                  ]}
                />

                <Ionicons
                  name={statusMeta.icon as keyof typeof Ionicons.glyphMap}
                  size={12}
                  color={statusMeta.color}
                />

                <AppText
                  variant="caption"
                  color="accent"
                  weight="semibold"
                  numberOfLines={1}
                  style={{ color: statusMeta.color }}
                >
                  {statusMeta.label}
                </AppText>
              </View>
            </View>

            <AppText
              variant="h5"
              weight="bold"
              numberOfLines={3}
              style={styles.projectTitle}
            >
              {project.title}
            </AppText>

            <View style={styles.projectMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.text.tertiary}
                />

                <AppText variant="caption" color="secondary">
                  {project.academicYear || "Year unavailable"}
                </AppText>
              </View>

              <View style={styles.metaDot} />

              <View style={styles.metaItem}>
                <Ionicons
                  name="document-text-outline"
                  size={14}
                  color={Colors.text.tertiary}
                />

                <AppText variant="caption" color="secondary">
                  {documents.length}{" "}
                  {documents.length === 1 ? "document" : "documents"}
                </AppText>
              </View>
            </View>

            <View style={styles.supervisorRow}>
              <View style={styles.supervisorAvatar}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={Colors.accent}
                />
              </View>

              <View style={styles.supervisorContent}>
                <AppText variant="caption" color="tertiary">
                  Supervisor
                </AppText>

                <AppText variant="body2" weight="medium" numberOfLines={1}>
                  {supervisorName}
                </AppText>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.text.tertiary}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <AppText variant="h5" weight="semibold">
                Workspace
              </AppText>

              <AppText variant="caption" color="secondary">
                Everything you need for your project.
              </AppText>
            </View>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={openDocuments}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Open project documents"
            >
              <View style={[styles.actionIcon, styles.actionIconPrimary]}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.actionText}>
                <AppText variant="body2" weight="semibold">
                  Documents
                </AppText>

                <AppText variant="caption" color="secondary">
                  {documents.length} available
                </AppText>
              </View>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("ProjectDetails", {
                  projectId: project.id,
                })
              }
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Open project details"
            >
              <View style={[styles.actionIcon, styles.actionIconNeutral]}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.actionText}>
                <AppText variant="body2" weight="semibold">
                  Details
                </AppText>

                <AppText variant="caption" color="secondary">
                  Project overview
                </AppText>
              </View>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <AppText variant="h5" weight="semibold">
                Recent files
              </AppText>

              <AppText variant="caption" color="secondary">
                Your latest project documents.
              </AppText>
            </View>

            {documents.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={openDocuments}
                activeOpacity={0.7}
              >
                <AppText variant="caption" color="accent" weight="semibold">
                  View all
                </AppText>

                <Ionicons
                  name="chevron-forward"
                  size={15}
                  color={Colors.accent}
                />
              </TouchableOpacity>
            )}
          </View>

          <SectionCard style={styles.filesCard}>
            {documents.length > 0 ? (
              documents.slice(0, 4).map((document, index) => (
                <View key={document.id}>
                  <TouchableOpacity
                    style={styles.fileRow}
                    onPress={() =>
                      navigation.navigate("DocumentViewer", {
                        documentId: document.id,
                        projectId: project.id,
                        title:
                          document.name ?? document.title ?? "Project document",
                      })
                    }
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${
                      document.title ?? "project document"
                    }`}
                  >
                    <View style={styles.fileIcon}>
                      <Ionicons
                        name="document-text-outline"
                        size={18}
                        color={Colors.accent}
                      />
                    </View>

                    <View style={styles.fileContent}>
                      <AppText
                        variant="body2"
                        weight="medium"
                        numberOfLines={1}
                      >
                        {document.title || document.name || "Untitled document"}
                      </AppText>

                      <View style={styles.fileMeta}>
                        <AppText variant="caption" color="secondary">
                          {document.type || "Document"}
                        </AppText>

                        <View style={styles.fileMetaDot} />

                        <AppText variant="caption" color="tertiary">
                          Open file
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.fileChevron}>
                      <Ionicons
                        name="chevron-forward"
                        size={15}
                        color={Colors.text.tertiary}
                      />
                    </View>
                  </TouchableOpacity>

                  {index < Math.min(documents.length, 4) - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            ) : (
              <TouchableOpacity
                style={styles.emptyFiles}
                onPress={openDocuments}
                activeOpacity={0.75}
              >
                <View style={styles.emptyFilesIcon}>
                  <Ionicons
                    name="document-outline"
                    size={21}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.emptyFilesContent}>
                  <AppText variant="body2" weight="semibold">
                    No project files yet
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    Your uploaded documents will appear here.
                  </AppText>
                </View>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
          </SectionCard>
        </View>
      </>
    );
  };

  return (
    <View style={styles.outerContainer}>
      {renderHeader()}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl
            refreshing={isProjectsFetching || isNotificationsFetching}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {renderStats()}
        {renderProjectDashboard()}

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
