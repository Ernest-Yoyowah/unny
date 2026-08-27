import React from "react";
import { View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AppText,
  Avatar,
  Card,
  SectionCard,
  EmptyState,
  ScreenSkeleton,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import { useMyProjects } from "../../hooks/useProject";
import { useNotifications } from "../../hooks/useNotifications";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./StudentDashboardScreen.styles";
import { getProjectProgress } from "../../utils/project-progress";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const StudentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const user = useAuthStore((state) => state.user);
  const { data: projects, isLoading: isProjectsLoading } = useMyProjects();
  const { data: notificationPage } = useNotifications();
  const project = projects?.[0];
  const unreadCount =
    notificationPage?.data.filter((item) => !item.isRead).length ?? 0;

  if (!user) {
    return <ScreenSkeleton />;
  }

  if (isProjectsLoading) {
    return <ScreenSkeleton />;
  }

  if (!project) {
    return (
      <EmptyState
        icon="folder-open-outline"
        title="No project yet"
        description="Create your project to start building your workspace."
        action={{
          label: "Add Project",
          onPress: () => navigation.navigate("AddProject"),
        }}
      />
    );
  }

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  })();

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
          <AppText style={styles.greetingText}>{greeting},</AppText>

          <AppText style={styles.headerName} numberOfLines={1}>
            {user.fullName.split(" ")[0]}
          </AppText>

          <View style={styles.orgRow}>
            <Ionicons
              name="school-outline"
              size={13}
              color="rgba(255,255,255,0.55)"
            />

            <AppText style={styles.orgName} numberOfLines={1}>
              Ghana Communication Technology University
            </AppText>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.text.inverse}
            />

            {unreadCount > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <Avatar name={user.fullName} uri={user.avatarUrl} size="md" />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons
              name="folder-open-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>1</AppText>

            <AppText style={styles.statLbl}>Project</AppText>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>
              {project?.documents?.length ?? 0}
            </AppText>

            <AppText style={styles.statLbl}>Documents</AppText>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>{unreadCount}</AppText>

            <AppText style={styles.statLbl}>Alerts</AppText>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h5" weight="semibold">
              My Final Year Project
            </AppText>

            <TouchableOpacity
              style={styles.addProjectButton}
              onPress={() => navigation.navigate("AddProject")}
            >
              <Ionicons name="add" size={16} color={Colors.primary} />

              <AppText variant="caption" color="accent" weight="semibold">
                Add Project
              </AppText>
            </TouchableOpacity>
          </View>

          <Card style={styles.projectCard}>
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Ionicons
                  name="rocket-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.projectStatus}>
                <AppText variant="caption" color="accent" weight="semibold">
                  {project.status}
                </AppText>
              </View>
            </View>

            <AppText variant="h5" weight="bold" style={styles.projectTitle}>
              {project.title}
            </AppText>

            <View style={styles.projectMeta}>
              <View style={styles.metaRow}>
                <Ionicons
                  name="school-outline"
                  size={15}
                  color={Colors.text.secondary}
                />

                <AppText variant="caption" color="secondary">
                  {project.department || "Department unavailable"}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={Colors.text.secondary}
                />

                <AppText variant="caption" color="secondary">
                  {project.academicYear || "Year unavailable"}
                </AppText>
              </View>
            </View>

            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <AppText variant="caption" color="secondary">
                  Completion
                </AppText>

                <AppText variant="caption" weight="semibold">
                  {getProjectProgress(project)}%
                </AppText>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProjectProgress(project)}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.supervisorRow}>
              <Ionicons name="person-outline" size={16} color={Colors.accent} />

              <AppText variant="body2">
                Supervisor:{" "}
                {project.supervisor?.fullName ??
                  project.supervisor?.name ??
                  "Not assigned"}
              </AppText>
            </View>
          </Card>
        </View>
        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Project Workspace
          </AppText>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                project.documents?.[0]
                  ? navigation.navigate("DocumentViewer", {
                      documentId: project.documents[0].id,
                      projectId: project.id,
                      title:
                        project.documents[0].name ??
                        project.documents[0].title ??
                        "Project document",
                    })
                  : navigation.navigate("ProjectDetails", {
                      projectId: project.id,
                    })
              }
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.primary}
              />

              <AppText variant="caption" weight="semibold">
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

              <AppText variant="caption" weight="semibold">
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

              <AppText variant="caption" weight="semibold">
                Details
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h5" weight="semibold">
              Recent Project Files
            </AppText>
          </View>

          <SectionCard style={styles.filesCard}>
            {(project.documents ?? []).map((document, index) => (
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
                >
                  <View style={styles.fileIcon}>
                    <Ionicons
                      name="document-outline"
                      size={18}
                      color={Colors.accent}
                    />
                  </View>

                  <View style={styles.fileContent}>
                    <AppText variant="body2" weight="medium" numberOfLines={1}>
                      {document.title}
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      {document.type}
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.text.tertiary}
                  />
                </TouchableOpacity>

                {index < (project.documents ?? []).length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </SectionCard>
        </View>
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
