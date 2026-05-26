import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  AppText,
  Avatar,
  Badge,
  Card,
  Divider,
  SectionCard,
} from "../../components/ui";
import { CourseCard } from "../../components/course/CourseCard";
import { useAuthStore } from "../../store/auth.store";
import { MOCK_COURSES, MOCK_STUDENT, MOCK_LECTURER } from "../../data/mock";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user) ?? MOCK_STUDENT;
  const isLecturer = user.role === "lecturer";

  const student = isLecturer ? null : MOCK_STUDENT;
  const lecturer = isLecturer ? MOCK_LECTURER : null;

  const pinnedCourses = isLecturer
    ? []
    : MOCK_COURSES.filter((c) => c.isPinned && c.isEnrolled);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <Avatar name={user.fullName} uri={user.avatarUrl} size="xl" />
        <AppText variant="h4" weight="bold" style={styles.name}>
          {user.fullName}
        </AppText>
        <View style={styles.roleBadgeRow}>
          <Badge
            label={
              isLecturer
                ? (MOCK_LECTURER.title ?? "Lecturer")
                : `Level ${student?.level ?? ""}`
            }
            variant="primary"
            size="md"
          />
          {user.isVerified && (
            <Badge label="Verified" variant="success" size="md" dot />
          )}
        </View>
        <AppText variant="body2" color="tertiary" style={styles.orgText}>
          {user.organizationName}
        </AppText>
      </View>

      {isLecturer && lecturer ? (
        <SectionCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="h3" weight="bold">
                {lecturer.managedCourseIds?.length ?? 0}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Courses
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="h3" weight="bold">
                {lecturer.totalStudentsCount ?? 0}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Students
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="body1" weight="bold">
                {lecturer.specialization ?? "—"}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Specialization
              </AppText>
            </View>
          </View>
        </SectionCard>
      ) : student ? (
        <SectionCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <AppText variant="h3" weight="bold">
                {student.enrolledCourseIds?.length ?? 0}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Courses
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="h3" weight="bold">
                {student.level ?? "—"}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Level
              </AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <AppText variant="body2" weight="bold" numberOfLines={1}>
                {student.department ?? "—"}
              </AppText>
              <AppText variant="caption" color="tertiary">
                Dept.
              </AppText>
            </View>
          </View>
        </SectionCard>
      ) : null}

      <SectionCard style={styles.infoCard}>
        <AppText
          variant="label"
          weight="semibold"
          color="secondary"
          style={styles.cardLabel}
        >
          Account Information
        </AppText>
        {[
          { label: "Email", value: user.email, icon: "mail-outline" },
          {
            label: isLecturer ? "Staff ID" : "Student ID",
            value: isLecturer
              ? (lecturer?.staffId ?? "—")
              : (student?.studentId ?? "—"),
            icon: "id-card-outline",
          },
          {
            label: "Department",
            value: isLecturer
              ? (lecturer?.department ?? "—")
              : (student?.department ?? "—"),
            icon: "business-outline",
          },
          {
            label: "Joined",
            value: user.joinedAt
              ? new Date(user.joinedAt).toLocaleDateString("en-NG", {
                  month: "long",
                  year: "numeric",
                })
              : "—",
            icon: "calendar-outline",
          },
        ].map((item, index) => (
          <View key={item.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconLabel}>
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={Colors.text.tertiary}
                />
                <AppText variant="body2" color="tertiary">
                  {item.label}
                </AppText>
              </View>
              <AppText
                variant="body2"
                weight="medium"
                numberOfLines={1}
                style={styles.infoValue}
              >
                {item.value}
              </AppText>
            </View>
            {index < 3 && <Divider spacing={Spacing[3]} />}
          </View>
        ))}
      </SectionCard>

      {pinnedCourses.length > 0 && (
        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Pinned Courses
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinnedList}
          >
            {pinnedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="pinned"
                onPress={() =>
                  navigation.navigate("CourseDetails", { courseId: course.id })
                }
              />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <SectionCard style={styles.actionsCard}>
          {[
            {
              icon: "settings-outline",
              label: "Settings",
              onPress: () => navigation.navigate("Settings"),
            },
            {
              icon: "shield-checkmark-outline",
              label: "Privacy & Security",
              onPress: () => {},
            },
            {
              icon: "help-circle-outline",
              label: "Help & Support",
              onPress: () => {},
            },
          ].map((action, index) => (
            <View key={action.label}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={action.onPress}
                accessibilityRole="button"
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name={action.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color={Colors.text.secondary}
                  />
                </View>
                <AppText
                  variant="body2"
                  weight="medium"
                  style={styles.actionLabel}
                >
                  {action.label}
                </AppText>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.text.tertiary}
                />
              </TouchableOpacity>
              {index < 2 && <Divider spacing={0} />}
            </View>
          ))}
        </SectionCard>
      </View>

      <View style={styles.footer} />
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
  profileCard: {
    alignItems: "center",
    paddingTop: Spacing[6],
    paddingBottom: Spacing[5],
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
  },
  name: {
    marginTop: Spacing[2],
  },
  roleBadgeRow: {
    flexDirection: "row",
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  orgText: {
    marginTop: Spacing[1],
  },
  statsCard: {
    marginHorizontal: Spacing[5],
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing[1],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.light,
  },
  infoCard: {
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    gap: 0,
  },
  cardLabel: {
    marginBottom: Spacing[4],
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  infoIconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
  },
  section: {
    marginTop: Spacing[6],
    paddingHorizontal: Spacing[5],
  },
  sectionTitle: {
    marginBottom: Spacing[4],
  },
  pinnedList: {
    gap: Spacing[3],
  },
  actionsCard: {
    padding: 0,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    gap: Spacing[3],
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
  },
  footer: {
    height: Spacing[4],
  },
});
