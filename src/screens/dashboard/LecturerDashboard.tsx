import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AppText,
  Avatar,
  Badge,
  Card,
  SectionCard,
  ScreenSkeleton,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import { useModerationQueue } from "../../hooks/useModerationQueue";
import { Colors } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { ProjectRepositoryCard } from "@/components/project/ProjectRepositoryCard";
import { styles } from "./styles/LecturerDashboardScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const LecturerDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { data: reviewQueue = [], isLoading } = useModerationQueue();

  if (!user || isLoading) return <ScreenSkeleton />;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText variant="body2" color="tertiary">
            {greeting}
          </AppText>
          <AppText
            variant="h4"
            weight="bold"
            numberOfLines={1}
            style={styles.headerName}
          >
            {user?.fullName}
          </AppText>
          <View style={styles.roleRow}>
            <Badge label="Lecturer" variant="primary" size="sm" />
            <AppText variant="caption" color="tertiary">
              {user?.departmentId ?? "Academic reviewer"}
            </AppText>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Notifications")}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
          <Avatar name={user.fullName} uri={user.avatarUrl} size="md" />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard} elevation="sm">
          <View style={styles.statIconRow}>
            <Ionicons name="book-outline" size={18} color={Colors.accent} />
          </View>
          <AppText variant="h3" weight="bold">
            {reviewQueue.length}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Pending Reviews
          </AppText>
        </Card>
        <Card style={styles.statCard} elevation="sm">
          <View style={styles.statIconRow}>
            <Ionicons
              name="people-outline"
              size={18}
              color={Colors.status.success}
            />
          </View>
          <AppText variant="h3" weight="bold">
            {reviewQueue.filter((project) => project.submittedBy).length}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Submitted Projects
          </AppText>
        </Card>
        <Card style={styles.statCard} elevation="sm">
          <View style={styles.statIconRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={Colors.status.warning}
            />
          </View>
          <AppText variant="h3" weight="bold">
            {reviewQueue.reduce(
              (count, project) => count + (project.documents?.length ?? 0),
              0,
            )}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Attached Documents
          </AppText>
        </Card>
      </View>

      <View style={styles.quickActions}>
        <SectionCard>
          <View style={styles.quickActionsGrid}>
            {[
              {
                icon: "add-circle-outline",
                label: "New Course",
                color: Colors.accent,
              },
              {
                icon: "cloud-upload-outline",
                label: "Upload",
                color: Colors.status.success,
              },
              {
                icon: "archive-outline",
                label: "Archive",
                color: Colors.status.warning,
              },
              {
                icon: "stats-chart-outline",
                label: "Analytics",
                color: Colors.primary,
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: `${action.color}15` },
                  ]}
                >
                  <Ionicons
                    name={action.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={action.color}
                  />
                </View>
                <AppText variant="caption" weight="medium" color="secondary">
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="h5" weight="semibold">
            Projects Awaiting Review
          </AppText>
          <AppText variant="caption" color="tertiary">
            {reviewQueue.length} pending
          </AppText>
        </View>
        <View style={styles.courseList}>
          {reviewQueue.map((project) => (
            <ProjectRepositoryCard
              key={project.id}
              project={{
                id: project.id,
                title: project.title,
                department: project.department ?? "Department unavailable",
                yearGroup:
                  project.academicYear?.toString() ?? "Year unavailable",
                status: project.status,
                student: project.submittedBy?.fullName,
                supervisor: project.supervisor?.fullName,
              }}
              onPress={() =>
                navigation.navigate("ProjectDetails", { projectId: project.id })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="h5" weight="semibold">
            Review activity
          </AppText>
        </View>
        <SectionCard style={styles.uploadsCard}>
          {reviewQueue.map((project, index) => (
            <View key={project.id}>
              <TouchableOpacity
                style={styles.uploadItem}
                onPress={() =>
                  navigation.navigate("ProjectDetails", {
                    projectId: project.id,
                  })
                }
                activeOpacity={0.75}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={Colors.accent}
                  />
                </View>
                <View style={styles.uploadContent}>
                  <AppText variant="body2" weight="medium" numberOfLines={1}>
                    {project.title}
                  </AppText>
                  <View style={styles.uploadMeta}>
                    <AppText variant="caption" color="tertiary">
                      {project.status}
                    </AppText>
                    <View style={styles.metaDot} />
                    <AppText variant="caption" color="tertiary">
                      {project.submittedBy?.fullName ??
                        "Contributor unavailable"}
                    </AppText>
                    <View style={styles.metaDot} />
                    <AppText variant="caption" color="tertiary">
                      {project.academicYear ?? "Year unavailable"}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
              {index < reviewQueue.length - 1 && (
                <View style={styles.uploadDivider} />
              )}
            </View>
          ))}
        </SectionCard>
      </View>

      <View style={styles.sectionFooter} />
    </ScrollView>
  );
};
