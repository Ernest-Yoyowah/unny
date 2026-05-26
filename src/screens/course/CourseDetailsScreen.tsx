import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AppText,
  Avatar,
  Badge,
  Divider,
  SectionCard,
} from "../../components/ui";
import { DocumentCard } from "../../components/document/DocumentCard";
import { MOCK_COURSES, MOCK_DOCUMENTS } from "../../data/mock";
import { useAuthStore } from "../../store/auth.store";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import {
  formatSemester,
  formatCreditUnits,
  formatEnrollmentCount,
} from "../../utils/format.utils";
import { Document, DocumentCategory } from "../../types/document.types";

type Props = NativeStackScreenProps<MainStackParamList, "CourseDetails">;

type TabId = "overview" | "resources";

const categoryOrder: DocumentCategory[] = [
  "announcement",
  "lecture_note",
  "assignment",
  "past_question",
  "textbook",
  "supplementary",
];

const categoryLabels: Record<DocumentCategory, string> = {
  announcement: "Announcements",
  lecture_note: "Lecture Notes",
  assignment: "Assignments",
  past_question: "Past Questions",
  textbook: "Textbooks",
  supplementary: "Supplementary",
};

export const CourseDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId } = route.params;
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const course = MOCK_COURSES.find((c) => c.id === courseId);
  if (!course) return null;

  const documents = MOCK_DOCUMENTS.filter((d) => d.courseId === courseId);
  const isLecturer = user?.role === "lecturer";

  const groupedDocuments = categoryOrder
    .map((cat) => ({
      category: cat,
      title: categoryLabels[cat],
      data: documents.filter((d) => d.category === cat),
    }))
    .filter((g) => g.data.length > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View
        style={[styles.courseHeader, { backgroundColor: course.coverColor }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>

        {isLecturer && (
          <TouchableOpacity
            style={styles.moreBtn}
            accessibilityLabel="More options"
            accessibilityRole="button"
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={22}
              color="rgba(255,255,255,0.9)"
            />
          </TouchableOpacity>
        )}

        <View style={styles.courseHeaderContent}>
          <AppText variant="overline" style={styles.courseCode}>
            {course.code}
          </AppText>
          <AppText
            variant="h3"
            weight="bold"
            style={styles.courseTitle}
            numberOfLines={3}
          >
            {course.title}
          </AppText>

          <View style={styles.lecturerRow}>
            <Avatar name={course.lecturerName} size="xs" />
            <AppText variant="caption" style={styles.lecturerText}>
              {course.lecturerTitle} {course.lecturerName}
            </AppText>
          </View>
        </View>

        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <AppText variant="h5" weight="bold" style={styles.statValue}>
              {formatEnrollmentCount(course.enrollmentCount)}
            </AppText>
            <AppText variant="caption" style={styles.statLabel}>
              Students
            </AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AppText variant="h5" weight="bold" style={styles.statValue}>
              {course.resourceCount}
            </AppText>
            <AppText variant="caption" style={styles.statLabel}>
              Resources
            </AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AppText variant="h5" weight="bold" style={styles.statValue}>
              {course.creditUnits}
            </AppText>
            <AppText variant="caption" style={styles.statLabel}>
              Credits
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.tabRow}>
        {(["overview", "resources"] as TabId[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
          >
            <AppText
              variant="body2"
              weight={activeTab === tab ? "semibold" : "regular"}
              color={activeTab === tab ? "primary" : "tertiary"}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </AppText>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <Divider />

      {activeTab === "overview" ? (
        <ScrollView
          contentContainerStyle={styles.overviewContent}
          showsVerticalScrollIndicator={false}
        >
          <SectionCard>
            <AppText
              variant="label"
              weight="semibold"
              color="secondary"
              style={styles.overviewLabel}
            >
              About this Course
            </AppText>
            <AppText
              variant="body2"
              color="secondary"
              style={styles.overviewText}
            >
              {course.description}
            </AppText>
          </SectionCard>

          <SectionCard style={styles.overviewCard}>
            <AppText
              variant="label"
              weight="semibold"
              color="secondary"
              style={styles.overviewLabel}
            >
              Course Information
            </AppText>
            {[
              { label: "Academic Year", value: course.academicYear },
              { label: "Semester", value: formatSemester(course.semester) },
              { label: "Department", value: course.department },
              {
                label: "Credit Units",
                value: formatCreditUnits(course.creditUnits),
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
                {index < 3 && <Divider spacing={Spacing[3]} />}
              </View>
            ))}
          </SectionCard>

          {course.schedule && course.schedule.length > 0 && (
            <SectionCard style={styles.overviewCard}>
              <AppText
                variant="label"
                weight="semibold"
                color="secondary"
                style={styles.overviewLabel}
              >
                Class Schedule
              </AppText>
              {course.schedule.map((s, index) => (
                <View key={index}>
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleDayBadge}>
                      <AppText
                        variant="caption"
                        weight="semibold"
                        color="accent"
                      >
                        {s.day.slice(0, 3).toUpperCase()}
                      </AppText>
                    </View>
                    <View style={styles.scheduleInfo}>
                      <AppText variant="body2" weight="medium">
                        {s.startTime} — {s.endTime}
                      </AppText>
                      <AppText
                        variant="caption"
                        color="tertiary"
                        numberOfLines={1}
                      >
                        {s.venue}
                      </AppText>
                    </View>
                  </View>
                  {index < course.schedule!.length - 1 && (
                    <Divider spacing={Spacing[3]} />
                  )}
                </View>
              ))}
            </SectionCard>
          )}

          {!isLecturer && !course.isEnrolled && (
            <TouchableOpacity
              style={styles.enrollBtn}
              onPress={() =>
                navigation.navigate("EnrollmentFlow", { courseId: course.id })
              }
              accessibilityRole="button"
            >
              <AppText variant="body2" weight="semibold" color="inverse">
                Enroll in this Course
              </AppText>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <SectionList
          sections={groupedDocuments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resourcesContent}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <AppText variant="label" weight="semibold" color="secondary">
                {section.title}
              </AppText>
              <Badge
                label={String(section.data.length)}
                variant="neutral"
                size="sm"
              />
            </View>
          )}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() =>
                navigation.navigate("DocumentViewer", {
                  documentId: item.id,
                  courseId: item.courseId,
                  title: item.title,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          SectionSeparatorComponent={() => (
            <View style={styles.sectionSeparator} />
          )}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyResources}>
              <AppText variant="body2" color="tertiary">
                No resources have been uploaded yet.
              </AppText>
            </View>
          )}
        />
      )}

      {isLecturer && activeTab === "resources" && (
        <View
          style={[styles.uploadFab, { bottom: insets.bottom + Spacing[6] }]}
        >
          <TouchableOpacity
            style={styles.fabBtn}
            accessibilityRole="button"
            accessibilityLabel="Upload resource"
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color={Colors.text.inverse}
            />
            <AppText variant="body2" weight="semibold" color="inverse">
              Upload
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  courseHeader: {
    paddingBottom: Spacing[5],
  },
  backBtn: {
    margin: Spacing[4],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreBtn: {
    position: "absolute",
    top: Spacing[4],
    right: Spacing[4],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  courseHeaderContent: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
  },
  courseCode: {
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
  },
  courseTitle: {
    color: Colors.text.inverse,
    lineHeight: 32,
  },
  lecturerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  lecturerText: {
    color: "rgba(255,255,255,0.8)",
  },
  courseStats: {
    flexDirection: "row",
    marginTop: Spacing[5],
    marginHorizontal: Spacing[5],
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    color: Colors.text.inverse,
  },
  statLabel: {
    color: "rgba(255,255,255,0.65)",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: Spacing[2],
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    backgroundColor: Colors.surface,
  },
  tab: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    position: "relative",
    marginRight: Spacing[2],
  },
  tabActive: {},
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: Spacing[3],
    right: Spacing[3],
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  overviewContent: {
    padding: Spacing[5],
    gap: Spacing[4],
    paddingBottom: Spacing[10],
  },
  overviewCard: {
    gap: 0,
  },
  overviewLabel: {
    marginBottom: Spacing[3],
  },
  overviewText: {
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[1],
  },
  scheduleDayBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleInfo: {
    flex: 1,
    gap: 2,
  },
  enrollBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[4],
    alignItems: "center",
    marginTop: Spacing[4],
  },
  resourcesContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[20],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  itemSeparator: {
    height: Spacing[3],
  },
  sectionSeparator: {
    height: Spacing[5],
  },
  emptyResources: {
    padding: Spacing[8],
    alignItems: "center",
  },
  uploadFab: {
    position: "absolute",
    right: Spacing[5],
  },
  fabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
  },
});
