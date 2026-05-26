import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Card, Button, Divider } from "../../components/ui";
import { MOCK_COURSES } from "../../data/mock";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import {
  formatCreditUnits,
  formatEnrollmentCount,
  formatSemester,
} from "../../utils/format.utils";

type Props = NativeStackScreenProps<MainStackParamList, "EnrollmentFlow">;

export const EnrollmentFlowScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { courseId } = route.params;
  const insets = useSafeAreaInsets();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const course = MOCK_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      setIsEnrolled(true);
    }, 1500);
  };

  if (isEnrolled) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color={Colors.status.success}
            />
          </View>
          <AppText variant="h3" weight="bold" style={styles.successTitle}>
            Enrolled!
          </AppText>
          <AppText variant="body1" color="secondary" style={styles.successDesc}>
            You have been enrolled in {course.code}. You can now access all
            course materials.
          </AppText>
          <Button
            variant="primary"
            size="lg"
            label="View Course"
            fullWidth
            style={styles.successBtn}
            onPress={() => {
              navigation.replace("CourseDetails", { courseId: course.id });
            }}
          />
          <Button
            variant="ghost"
            size="md"
            label="Back to Home"
            onPress={() => navigation.popToTop()}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <AppText variant="h5" weight="semibold">
          Course Enrollment
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View
          style={[styles.courseStrip, { backgroundColor: course.coverColor }]}
        />
        <Card style={styles.courseCard} elevation="sm">
          <View style={styles.courseCardHeader}>
            <AppText
              variant="overline"
              color="tertiary"
              style={styles.courseCode}
            >
              {course.code}
            </AppText>
            <AppText variant="h4" weight="bold" style={styles.courseTitle}>
              {course.title}
            </AppText>
            <AppText variant="body2" color="secondary" numberOfLines={2}>
              {course.lecturerTitle} {course.lecturerName}
            </AppText>
          </View>

          <Divider spacing={Spacing[4]} />

          {[
            { label: "Department", value: course.department },
            { label: "Semester", value: formatSemester(course.semester) },
            { label: "Academic Year", value: course.academicYear },
            {
              label: "Credit Units",
              value: formatCreditUnits(course.creditUnits),
            },
            {
              label: "Students Enrolled",
              value: formatEnrollmentCount(course.enrollmentCount),
            },
          ].map((item, index) => (
            <View key={item.label}>
              <View style={styles.infoRow}>
                <AppText variant="body2" color="tertiary">
                  {item.label}
                </AppText>
                <AppText variant="body2" weight="medium">
                  {item.value}
                </AppText>
              </View>
              {index < 4 && <Divider spacing={Spacing[3]} />}
            </View>
          ))}
        </Card>

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Colors.text.tertiary}
          />
          <AppText variant="caption" color="tertiary" style={styles.noticeText}>
            By enrolling, you agree to the academic conduct guidelines of your
            institution.
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          label={isEnrolling ? "Enrolling..." : "Confirm Enrollment"}
          fullWidth
          onPress={handleEnroll}
          isLoading={isEnrolling}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: Spacing[5],
    gap: Spacing[4],
  },
  courseStrip: {
    height: 6,
    borderRadius: BorderRadius.md,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: 0,
  },
  courseCardHeader: {
    gap: Spacing[1],
    marginBottom: Spacing[4],
  },
  courseCode: {
    letterSpacing: 1.2,
  },
  courseTitle: {
    marginTop: Spacing[1],
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  notice: {
    flexDirection: "row",
    gap: Spacing[2],
    alignItems: "flex-start",
  },
  noticeText: {
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: Spacing[5],
    paddingBottom: Spacing[6],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  successContent: {
    flex: 1,
    padding: Spacing[6],
    gap: Spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    marginBottom: Spacing[2],
  },
  successTitle: {
    letterSpacing: -0.5,
  },
  successDesc: {
    textAlign: "center",
    lineHeight: 24,
  },
  successBtn: {
    marginTop: Spacing[4],
  },
});
