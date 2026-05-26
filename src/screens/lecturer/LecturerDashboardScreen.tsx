import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppText, Avatar, Badge, Card, SectionCard } from "../../components/ui";
import { CourseCard } from "../../components/course/CourseCard";
import { useAuthStore } from "../../store/auth.store";
import { MOCK_COURSES, MOCK_LECTURER, MOCK_DOCUMENTS } from "../../data/mock";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatRelativeTime } from "../../utils/date.utils";
import {
  formatBytes,
  getCategoryLabel,
  getFileTypeIcon,
} from "../../utils/format.utils";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const LecturerDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user) ?? MOCK_LECTURER;

  const managedCourses = MOCK_COURSES.filter(
    (c) => c.lecturerId === "usr-lec-001" && c.status === "active",
  );
  const archivedCourses = MOCK_COURSES.filter(
    (c) => c.lecturerId === "usr-lec-001" && c.status === "archived",
  );
  const recentUploads = MOCK_DOCUMENTS.filter(
    (d) => d.uploadedById === "usr-lec-001",
  ).slice(0, 4);

  const totalStudents = managedCourses.reduce(
    (sum, c) => sum + c.enrollmentCount,
    0,
  );
  const totalResources = managedCourses.reduce(
    (sum, c) => sum + c.resourceCount,
    0,
  );

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
            {MOCK_LECTURER.title} {user.fullName.split(" ").slice(-1)[0]}
          </AppText>
          <View style={styles.roleRow}>
            <Badge label="Lecturer" variant="primary" size="sm" />
            <AppText variant="caption" color="tertiary">
              {MOCK_LECTURER.department}
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
            {managedCourses.length}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Active Courses
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
            {totalStudents}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Enrolled Students
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
            {totalResources}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Resources
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
            Managed Courses
          </AppText>
          {archivedCourses.length > 0 && (
            <AppText variant="caption" color="tertiary">
              {archivedCourses.length} archived
            </AppText>
          )}
        </View>
        <View style={styles.courseList}>
          {managedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() =>
                navigation.navigate("CourseDetails", { courseId: course.id })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="h5" weight="semibold">
            Recent Uploads
          </AppText>
        </View>
        <SectionCard style={styles.uploadsCard}>
          {recentUploads.map((doc, index) => (
            <View key={doc.id}>
              <TouchableOpacity
                style={styles.uploadItem}
                onPress={() =>
                  navigation.navigate("DocumentViewer", {
                    documentId: doc.id,
                    courseId: doc.courseId,
                    title: doc.title,
                  })
                }
                activeOpacity={0.75}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons
                    name={
                      getFileTypeIcon(
                        doc.fileType,
                      ) as keyof typeof Ionicons.glyphMap
                    }
                    size={18}
                    color={Colors.accent}
                  />
                </View>
                <View style={styles.uploadContent}>
                  <AppText variant="body2" weight="medium" numberOfLines={1}>
                    {doc.title}
                  </AppText>
                  <View style={styles.uploadMeta}>
                    <AppText variant="caption" color="tertiary">
                      {getCategoryLabel(doc.category)}
                    </AppText>
                    <View style={styles.metaDot} />
                    <AppText variant="caption" color="tertiary">
                      {doc.downloadCount} downloads
                    </AppText>
                    <View style={styles.metaDot} />
                    <AppText variant="caption" color="tertiary">
                      {formatRelativeTime(doc.uploadedAt)}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
              {index < recentUploads.length - 1 && (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing[10],
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[5],
  },
  headerLeft: {
    gap: 2,
    flex: 1,
  },
  headerName: {
    marginTop: 2,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  statCard: {
    flex: 1,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  statIconRow: {
    marginBottom: Spacing[1],
  },
  quickActions: {
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[5],
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    alignItems: "center",
    gap: Spacing[2],
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginTop: Spacing[7],
    paddingHorizontal: Spacing[5],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  courseList: {
    gap: Spacing[3],
  },
  uploadsCard: {
    padding: 0,
    overflow: "hidden",
  },
  uploadItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
  },
  uploadIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  uploadContent: {
    flex: 1,
    gap: 3,
  },
  uploadMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border.strong,
  },
  uploadDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[4] + 38 + Spacing[3],
  },
  sectionFooter: {
    height: Spacing[4],
  },
});
