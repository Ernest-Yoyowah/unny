import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
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
  ProgressBar,
} from "../../components/ui";
import { CourseCard } from "../../components/course/CourseCard";
import { useAuthStore } from "../../store/auth.store";
import {
  MOCK_COURSES,
  MOCK_STUDENT,
  MOCK_NOTIFICATIONS,
  MOCK_DOCUMENTS,
} from "../../data/mock";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatRelativeTime } from "../../utils/date.utils";
import { getCategoryLabel, getFileTypeIcon } from "../../utils/format.utils";

type Nav = NativeStackNavigationProp<MainStackParamList>;

const UNREAD_COUNT = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

export const StudentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user) ?? MOCK_STUDENT;

  const activeCourses = MOCK_COURSES.filter(
    (c) => c.status === "active" && c.isEnrolled,
  );
  const pinnedCourses = MOCK_COURSES.filter((c) => c.isPinned && c.isEnrolled);
  const recentDocs = MOCK_DOCUMENTS.slice(0, 4);
  const totalResources = MOCK_DOCUMENTS.filter((d) =>
    activeCourses.some((c) => c.id === d.courseId),
  ).length;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + Spacing[4] }]}>
          <View style={styles.headerLeft}>
            <AppText style={styles.greetingText}>{greeting},</AppText>
            <AppText style={styles.headerName} numberOfLines={1}>
              {user.fullName.split(" ")[0]}
            </AppText>
            <View style={styles.orgRow}>
              <Ionicons
                name="business-outline"
                size={12}
                color="rgba(255,255,255,0.5)"
              />
              <AppText style={styles.orgName} numberOfLines={1}>
                {user.organizationName}
              </AppText>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate("Notifications")}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors.text.inverse}
              />
              {UNREAD_COUNT > 0 && <View style={styles.notifDot} />}
            </TouchableOpacity>
            <Avatar name={user.fullName} uri={user.avatarUrl} size="md" />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={18} color={Colors.accent} />
            <AppText style={styles.statNum}>{activeCourses.length}</AppText>
            <AppText style={styles.statLbl}>Courses</AppText>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={Colors.accent}
            />
            <AppText style={styles.statNum}>{totalResources}</AppText>
            <AppText style={styles.statLbl}>Resources</AppText>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={Colors.accent}
            />
            <AppText style={styles.statNum}>{UNREAD_COUNT}</AppText>
            <AppText style={styles.statLbl}>Unread</AppText>
          </View>
        </View>

        {pinnedCourses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="bookmark"
                  size={14}
                  color={Colors.text.secondary}
                />
                <AppText
                  variant="label"
                  weight="semibold"
                  color="secondary"
                  style={styles.sectionTitle}
                >
                  Pinned Courses
                </AppText>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {pinnedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="pinned"
                  onPress={() =>
                    navigation.navigate("CourseDetails", {
                      courseId: course.id,
                    })
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
              Active Courses
            </AppText>
            <TouchableOpacity accessibilityRole="button">
              <AppText variant="caption" color="accent" weight="medium">
                View all
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.courseList}>
            {activeCourses.map((course) => (
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
            <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
              Recent Materials
            </AppText>
          </View>
          <SectionCard style={styles.recentCard}>
            {recentDocs.map((doc, index) => (
              <View key={doc.id}>
                <TouchableOpacity
                  style={styles.recentItem}
                  onPress={() =>
                    navigation.navigate("DocumentViewer", {
                      documentId: doc.id,
                      courseId: doc.courseId,
                      title: doc.title,
                    })
                  }
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={doc.title}
                >
                  <View style={styles.recentIcon}>
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
                  <View style={styles.recentContent}>
                    <AppText variant="body2" weight="medium" numberOfLines={1}>
                      {doc.title}
                    </AppText>
                    <AppText
                      variant="caption"
                      color="tertiary"
                      numberOfLines={1}
                    >
                      {getCategoryLabel(doc.category)} ·{" "}
                      {formatRelativeTime(doc.uploadedAt)}
                    </AppText>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.text.tertiary}
                  />
                </TouchableOpacity>
                {index < recentDocs.length - 1 && (
                  <View style={styles.recentDivider} />
                )}
              </View>
            ))}
          </SectionCard>
        </View>

        <View style={styles.sectionFooter} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing[10],
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[14],
  },
  headerLeft: {
    gap: 2,
    flex: 1,
  },
  greetingText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  headerName: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  orgName: {
    color: "rgba(255,255,255,0.5)",
    fontSize: Typography.size.xs,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.error,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    gap: Spacing[3],
    marginTop: -Spacing[7],
    marginBottom: Spacing[2],
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    alignItems: "center",
    gap: Spacing[1],
    ...Shadows.md,
  },
  statNum: {
    color: Colors.text.primary,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
  },
  statLbl: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
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
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
  },
  sectionTitle: {
    letterSpacing: -0.1,
  },
  horizontalList: {
    gap: Spacing[3],
    paddingRight: Spacing[2],
  },
  courseList: {
    gap: Spacing[3],
  },
  recentCard: {
    padding: 0,
    overflow: "hidden",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
  },
  recentIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  recentContent: {
    flex: 1,
    gap: 2,
  },
  recentDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[4] + 38 + Spacing[3],
  },
  sectionFooter: {
    height: Spacing[4],
  },
});
