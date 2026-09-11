import React from "react";
import {
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
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
import { useNotifications } from "../../hooks/useNotifications";
import { useSupervisionRequests } from "../../hooks/useProjectWorkflow";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./styles/LecturerDashboardScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

type SupervisionRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  message?: string | null;
  project?: {
    id: string;
    title?: string | null;
    department?: string | null;
    academicYear?: string | number | null;
    status?: string | null;
    documents?: unknown[];
    collaborators?: unknown[];
  } | null;
  requester?: {
    id?: string;
    fullName?: string | null;
  } | null;
};

export const LecturerDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const user = useAuthStore((state) => state.user);

  const {
    data: requestData = [],
    isLoading: isRequestsLoading,
    isError,
    refetch: refetchRequests,
    isFetching: isRequestsFetching,
  } = useSupervisionRequests();

  const {
    data: notificationPage,
    refetch: refetchNotifications,
    isFetching: isNotificationsFetching,
  } = useNotifications();

  const requests = requestData as SupervisionRequest[];

  const unreadCount =
    notificationPage?.data.filter((item) => !item.isRead).length ?? 0;

  if (!user || isRequestsLoading) {
    return <ScreenSkeleton />;
  }

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const firstName =
    user.fullName?.trim().split(/\s+/).slice(0, 2).join(" ") || "Lecturer";

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  const acceptedRequests = requests.filter(
    (request) => request.status === "ACCEPTED" && Boolean(request.project),
  );

  const supervisedProjects = acceptedRequests
    .map((request) => request.project)
    .filter(Boolean)
    .filter(
      (project, index, collection) =>
        collection.findIndex((item) => item?.id === project?.id) === index,
    );

  const totalProjects = supervisedProjects.length;

  const handleRefresh = async () => {
    await Promise.all([refetchRequests(), refetchNotifications()]);
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
              {user.departmentId ?? "Academic supervisor"}
            </AppText>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={handleRefresh}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Refresh dashboard"
          >
            <Ionicons
              name={
                isRequestsFetching || isNotificationsFetching
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

  const renderStats = () => (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <View style={[styles.statIcon, styles.statIconPrimary]}>
          <Ionicons
            name="folder-open-outline"
            size={17}
            color={Colors.primary}
          />
        </View>

        <AppText style={styles.statNum}>{totalProjects}</AppText>

        <AppText style={styles.statLbl}>Projects</AppText>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statIcon, styles.statIconWarning]}>
          <Ionicons
            name="time-outline"
            size={17}
            color={Colors.status.warning}
          />
        </View>

        <AppText style={styles.statNum}>{pendingRequests.length}</AppText>

        <AppText style={styles.statLbl}>Requests</AppText>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.statIcon, styles.statIconAccent]}>
          <Ionicons
            name="notifications-outline"
            size={17}
            color={Colors.accent}
          />
        </View>

        <AppText style={styles.statNum}>{unreadCount}</AppText>

        <AppText style={styles.statLbl}>Unread</AppText>
      </View>
    </View>
  );

  const renderProjectCard = (
    project: NonNullable<SupervisionRequest["project"]>,
  ) => {
    const supervisionRequest = acceptedRequests.find(
      (request) => request.project?.id === project.id,
    );

    const studentName =
      supervisionRequest?.requester?.fullName ?? "Student unavailable";

    const collaboratorCount = project.collaborators?.length ?? 0;

    return (
      <Card key={project.id} style={styles.projectHero}>
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

              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {project.department || "Department unavailable"}
              </AppText>
            </View>
          </View>

          <View style={styles.projectStatus}>
            <View style={styles.statusDot} />

            <AppText
              variant="caption"
              color="accent"
              weight="semibold"
              numberOfLines={1}
            >
              {project.status || "Active"}
            </AppText>
          </View>
        </View>

        <AppText
          variant="h5"
          weight="bold"
          numberOfLines={3}
          style={styles.projectTitle}
        >
          {project.title || "Untitled project"}
        </AppText>

        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="person-outline"
              size={14}
              color={Colors.text.tertiary}
            />

            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {studentName}
            </AppText>
          </View>

          {project.academicYear && (
            <>
              <View style={styles.metaDot} />

              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Colors.text.tertiary}
                />

                <AppText variant="caption" color="secondary">
                  {project.academicYear}
                </AppText>
              </View>
            </>
          )}

          {collaboratorCount > 0 && (
            <>
              <View style={styles.metaDot} />

              <View style={styles.metaItem}>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={Colors.text.tertiary}
                />

                <AppText variant="caption" color="secondary">
                  {collaboratorCount}{" "}
                  {collaboratorCount === 1 ? "collaborator" : "collaborators"}
                </AppText>
              </View>
            </>
          )}
        </View>

        <View style={styles.supervisorRow}>
          <View style={styles.supervisorAvatar}>
            <Ionicons name="school-outline" size={15} color={Colors.accent} />
          </View>

          <View style={styles.supervisorContent}>
            <AppText variant="caption" color="tertiary">
              Supervision status
            </AppText>

            <AppText variant="body2" weight="medium">
              Active supervision
            </AppText>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={18}
            color={Colors.status.success}
          />
        </View>

        <TouchableOpacity
          style={styles.projectAction}
          onPress={() =>
            navigation.navigate("ProjectDetails", {
              projectId: project.id,
            })
          }
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Open ${project.title ?? "project"}`}
        >
          <View style={styles.projectActionContent}>
            <AppText variant="caption" color="tertiary">
              Supervision workspace
            </AppText>

            <AppText variant="body2" weight="semibold">
              Open project
            </AppText>
          </View>

          <Ionicons name="arrow-forward" size={17} color={Colors.primary} />
        </TouchableOpacity>
      </Card>
    );
  };

  const renderSupervision = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <AppText variant="h5" weight="semibold">
            Your supervision
          </AppText>

          <AppText variant="caption" color="secondary">
            Projects you have accepted to supervise.
          </AppText>
        </View>

        {totalProjects > 0 && (
          <AppText variant="caption" color="tertiary">
            {totalProjects} {totalProjects === 1 ? "project" : "projects"}
          </AppText>
        )}
      </View>

      {isError ? (
        <SectionCard style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.emptyContent}>
            <AppText variant="body2" weight="semibold">
              Supervision data unavailable
            </AppText>

            <AppText variant="caption" color="secondary">
              We could not load your current supervision projects.
            </AppText>
          </View>
        </SectionCard>
      ) : totalProjects === 0 ? (
        <SectionCard style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="folder-open-outline"
              size={22}
              color={Colors.primary}
            />
          </View>

          <View style={styles.emptyContent}>
            <AppText variant="body2" weight="semibold">
              No supervised projects yet
            </AppText>

            <AppText variant="caption" color="secondary">
              Projects will appear here after you accept a supervision request.
            </AppText>
          </View>
        </SectionCard>
      ) : (
        <View style={styles.projectList}>
          {supervisedProjects
            .slice(0, 3)
            .map((project) => renderProjectCard(project!))}
        </View>
      )}
    </View>
  );

  const renderWorkspace = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <AppText variant="h5" weight="semibold">
            Supervision workspace
          </AppText>

          <AppText variant="caption" color="secondary">
            Manage your supervision activity.
          </AppText>
        </View>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => {
            if (supervisedProjects[0]) {
              navigation.navigate("ProjectDetails", {
                projectId: supervisedProjects[0].id,
              });
            }
          }}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open supervised projects"
        >
          <View style={[styles.actionIcon, styles.actionIconPrimary]}>
            <Ionicons
              name="folder-open-outline"
              size={20}
              color={Colors.primary}
            />
          </View>

          <View style={styles.actionText}>
            <AppText variant="body2" weight="semibold">
              Projects
            </AppText>

            <AppText variant="caption" color="secondary">
              {totalProjects} supervised
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
          onPress={() => navigation.navigate("SupervisionRequests")}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open supervision requests"
        >
          <View style={[styles.actionIcon, styles.actionIconWarning]}>
            <Ionicons
              name="mail-open-outline"
              size={20}
              color={Colors.status.warning}
            />
          </View>

          <View style={styles.actionText}>
            <AppText variant="body2" weight="semibold">
              Requests
            </AppText>

            <AppText variant="caption" color="secondary">
              {pendingRequests.length > 0
                ? `${pendingRequests.length} awaiting response`
                : "No pending requests"}
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
            navigation.navigate("LecturerTabs", {
              screen: "SupervisorReview",
            })
          }
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Open project review queue"
        >
          <View style={[styles.actionIcon, styles.actionIconAccent]}>
            <Ionicons
              name="checkmark-done-outline"
              size={20}
              color={Colors.accent}
            />
          </View>

          <View style={styles.actionText}>
            <AppText variant="body2" weight="semibold">
              Review queue
            </AppText>

            <AppText variant="caption" color="secondary">
              Comment, approve, reject, or request changes
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
  );

  const renderAttention = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeading}>
          <AppText variant="h5" weight="semibold">
            Needs your attention
          </AppText>

          <AppText variant="caption" color="secondary">
            Supervision activity requiring a response.
          </AppText>
        </View>
      </View>

      <SectionCard style={styles.attentionCard}>
        {pendingRequests.length > 0 ? (
          <>
            <View style={styles.attentionHeader}>
              <View style={styles.attentionIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={Colors.accent}
                />
              </View>

              <View style={styles.attentionContent}>
                <AppText variant="body2" weight="semibold">
                  {pendingRequests.length}{" "}
                  {pendingRequests.length === 1 ? "request" : "requests"}{" "}
                  awaiting your response
                </AppText>

                <AppText variant="caption" color="secondary">
                  Review incoming supervision requests and decide which students
                  you would like to supervise.
                </AppText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.attentionAction}
              onPress={() => navigation.navigate("SupervisionRequests")}
              activeOpacity={0.75}
            >
              <AppText variant="caption" color="accent" weight="semibold">
                Review requests
              </AppText>

              <Ionicons name="arrow-forward" size={15} color={Colors.accent} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.attentionHeader}>
            <View style={styles.attentionIconSuccess}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color={Colors.status.success}
              />
            </View>

            <View style={styles.attentionContent}>
              <AppText variant="body2" weight="semibold">
                You're all caught up
              </AppText>

              <AppText variant="caption" color="secondary">
                There are no pending supervision requests requiring your
                response.
              </AppText>
            </View>
          </View>
        )}
      </SectionCard>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      {renderHeader()}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        {renderStats()}
        {renderSupervision()}
        {renderWorkspace()}
        {renderAttention()}

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
